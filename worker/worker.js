/* ─────────────────────────────────────────────────────────────────────
   Everwave Permanent Lighting Newport Beach — booking API
   Cloudflare Worker name: everwave-newportbeach-api
   Source tag: everwave-newportbeach · Booking ID prefix: EW-

   Bindings (set in the Cloudflare dashboard, never by CLI):
     DB                 D1 database binding (shared `bookings` table)
     STRIPE_SECRET_KEY  secret — sk_live_… or sk_test_…
     ALLOWED_ORIGINS    optional var — comma-separated site origins for CORS
     ADMIN_TOKEN        optional secret — enables GET/PATCH admin routes

   Routes
     GET   /api/health
     GET   /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
     POST  /api/payment-intent        { draftRef }
     POST  /api/bookings              booking payload (see validateBooking)
     GET   /api/bookings              admin (Bearer ADMIN_TOKEN)
     PATCH /api/bookings/:id          admin (Bearer ADMIN_TOKEN), PATCHABLE fields only
   ───────────────────────────────────────────────────────────────────── */

const SOURCE = 'everwave-newportbeach';
const PREFIX = 'EW-';
const DRAFT_PREFIX = 'EWR-';
const DEPOSIT_CENTS = 14900; // $149 reservation deposit, applied to the final invoice
const CURRENCY = 'usd';
const SLOT_CAPACITY = 1; // bookings allowed per date + time window
const LEAD_HOURS = 48;
const SEASON = { start: [10, 20], end: [12, 20] }; // [month, day], Pacific time, inclusive
const TZ = 'America/Los_Angeles';

/* Stored exactly like this in the D1 `time` column (en dash). Value = 24h start hour, Pacific. */
const TIME_WINDOWS = { '8AM–12PM': 8, '12PM–4PM': 12 };
const LIGHTING_TYPES = ['Permanent', 'Seasonal'];

const PATCHABLE = [
  'status', 'reschedule_date', 'reschedule_time', 'notes2',
  'original_date', 'original_time', 'payment_status', 'date', 'time',
];
const FREE_STATUSES = ['cancelled', 'canceled'];

/* One statement per entry — run with prepare().run(), never .exec() (newline parsing bug). */
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, date TEXT, time TEXT, service TEXT, name TEXT, phone TEXT, email TEXT, vehicle TEXT, address TEXT, notes TEXT, source TEXT, created_at TEXT, status TEXT DEFAULT 'Booked', reschedule_date TEXT, reschedule_time TEXT, notes2 TEXT, original_date TEXT, original_time TEXT, payment_status TEXT)",
  'CREATE INDEX IF NOT EXISTS idx_bookings_source_date ON bookings (source, date)',
];

/* ───────── schema (non-blocking) ───────── */
let schemaPromise = null;
function ensureSchema(env) {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      for (const sql of SCHEMA) await env.DB.prepare(sql).run();
    })().catch((err) => {
      schemaPromise = null; // try again on the next request
      console.log('ensureSchema failed (continuing):', err && err.message);
    });
  }
  return schemaPromise;
}

/* ───────── helpers ───────── */
function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const list = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allow = list.length === 0 ? '*' : list.includes(origin) ? origin : list[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}
function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
  });
}
const clean = (v, max = 300) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
const isISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));

/* ───────── Pacific time (DST-aware via Intl) ───────── */
const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});
function pacificParts(ms) {
  const o = {};
  for (const p of fmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, s: +o.second };
}
/** UTC epoch ms for a Pacific wall-clock time. */
function pacificToUtc(y, m, d, h) {
  const target = Date.UTC(y, m - 1, d, h, 0, 0);
  let guess = target + 8 * 3600e3;
  for (let i = 0; i < 3; i++) {
    const p = pacificParts(guess);
    const wall = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
    const diff = target - wall;
    if (diff === 0) break;
    guess += diff;
  }
  return guess;
}
function inSeason(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const v = m * 100 + d;
  return v >= SEASON.start[0] * 100 + SEASON.start[1] && v <= SEASON.end[0] * 100 + SEASON.end[1] && y >= 2024;
}
function slotIsBookable(dateStr, time, nowMs) {
  if (!isISODate(dateStr) || !(time in TIME_WINDOWS) || !inSeason(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  return pacificToUtc(y, m, d, TIME_WINDOWS[time]) >= nowMs + LEAD_HOURS * 3600e3;
}

/* ───────── occupancy (reschedule-aware, cancelled frees the slot) ───────── */
const SLOT_D = "COALESCE(NULLIF(reschedule_date, ''), date)";
const SLOT_T = "COALESCE(NULLIF(reschedule_time, ''), time)";
const ACTIVE = "(status IS NULL OR LOWER(status) NOT IN ('cancelled', 'canceled'))";

async function bookedBetween(env, from, to) {
  const { results } = await env.DB.prepare(
    `SELECT ${SLOT_D} AS d, ${SLOT_T} AS t, COUNT(*) AS n FROM bookings WHERE source = ? AND ${ACTIVE} AND ${SLOT_D} BETWEEN ? AND ? GROUP BY d, t`
  ).bind(SOURCE, from, to).all();
  const booked = {};
  for (const r of results || []) {
    if (r.n >= SLOT_CAPACITY) (booked[r.d] = booked[r.d] || []).push(r.t);
  }
  return booked;
}
async function slotCount(env, date, time) {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM bookings WHERE source = ? AND ${ACTIVE} AND ${SLOT_D} = ? AND ${SLOT_T} = ?`
  ).bind(SOURCE, date, time).first();
  return row ? row.n : 0;
}

/* ───────── Stripe ───────── */
function form(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === 'object') form(v, key, out);
    else if (v !== undefined && v !== null) out.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(v)));
  }
  return out.join('&');
}
async function stripe(env, method, path, body, idempotencyKey) {
  if (!env.STRIPE_SECRET_KEY) throw Object.assign(new Error('Payments are not configured yet.'), { status: 503 });
  const headers = { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` };
  if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const res = await fetch('https://api.stripe.com/v1' + path, { method, headers, body: body ? form(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data.error && data.error.message) || 'Stripe request failed';
    throw Object.assign(new Error(msg), { status: 502 });
  }
  return data;
}

/* ───────── booking validation ───────── */
function validateBooking(b) {
  const out = {
    date: clean(b.date, 10),
    time: clean(b.time, 20),
    service: clean(b.service, 80),
    type: clean(b.lighting_type, 20),
    vehicle: clean(b.vehicle, 200),
    name: clean(b.name, 120),
    phone: String(b.phone || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''),
    email: clean(b.email, 160).toLowerCase(),
    address: clean(b.address, 240),
    details: clean(b.notes, 600),
    draftRef: clean(b.draft_ref, 24).toUpperCase(),
    paymentStatus: b.payment_status === 'Paid' ? 'Paid' : 'Pay Later',
    paymentIntentId: clean(b.payment_intent_id, 80),
  };
  const missing = [];
  if (!LIGHTING_TYPES.includes(out.type)) missing.push('lighting type');
  if (!out.service) missing.push('package');
  if (!isISODate(out.date)) missing.push('install date');
  if (!(out.time in TIME_WINDOWS)) missing.push('time window');
  if (out.name.length < 2) missing.push('full name');
  if (out.phone.length !== 10) missing.push('phone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email)) missing.push('email');
  if (out.address.length < 6) missing.push('service address');
  if (!new RegExp('^' + DRAFT_PREFIX + '[A-Z0-9]{6,12}$').test(out.draftRef)) missing.push('booking reference');
  if (out.paymentStatus === 'Paid' && !/^pi_[A-Za-z0-9]+$/.test(out.paymentIntentId)) missing.push('payment');
  if (!out.vehicle.startsWith(out.type)) out.vehicle = clean(`${out.type} · ${out.vehicle}`, 200);
  return { out, missing };
}
function newId() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return PREFIX + Array.from(bytes, (x) => abc[x % abc.length]).join('');
}

/* ───────── handlers ───────── */
async function handleAvailability(url, env, cors) {
  await ensureSchema(env);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!isISODate(from || '') || !isISODate(to || '') || from > to) return json({ error: 'from and to dates are required' }, 400, cors);
  if ((Date.parse(to) - Date.parse(from)) / 864e5 > 120) return json({ error: 'Range too large' }, 400, cors);
  const booked = await bookedBetween(env, from, to);
  return json({ booked, now: new Date().toISOString(), leadHours: LEAD_HOURS }, 200, cors);
}

async function handlePaymentIntent(request, env, cors) {
  // Deliberately no ensureSchema here: payment must never wait on (or fail because of) D1.
  const body = await request.json().catch(() => ({}));
  const draftRef = clean(body.draftRef, 24).toUpperCase();
  if (!new RegExp('^' + DRAFT_PREFIX + '[A-Z0-9]{6,12}$').test(draftRef)) return json({ error: 'Missing booking reference' }, 400, cors);
  const pi = await stripe(env, 'POST', '/payment_intents', {
    amount: DEPOSIT_CENTS,
    currency: CURRENCY,
    automatic_payment_methods: { enabled: 'true' },
    description: 'Everwave reservation deposit (applied to final invoice)',
    metadata: { source: SOURCE, draft_ref: draftRef },
  }, `everwave-pi-${draftRef}`); // same draft → same PaymentIntent
  return json({ clientSecret: pi.client_secret, id: pi.id, amount: pi.amount }, 200, cors);
}

async function handleCreateBooking(request, env, cors) {
  await ensureSchema(env);
  const raw = await request.json().catch(() => null);
  if (!raw) return json({ error: 'Invalid request' }, 400, cors);
  const { out: b, missing } = validateBooking(raw);
  if (missing.length) return json({ error: `Missing or invalid: ${missing.join(', ')}`, fields: missing }, 400, cors);

  // Idempotency: one booking per PaymentIntent, and one per draft reference.
  const dupe = await env.DB.prepare(
    'SELECT id, payment_status FROM bookings WHERE source = ? AND (notes LIKE ? OR (? <> \'\' AND notes LIKE ?)) LIMIT 1'
  ).bind(SOURCE, `%Ref: ${b.draftRef}%`, b.paymentIntentId, `%PI: ${b.paymentIntentId}%`).first();
  if (dupe) return json({ id: dupe.id, payment_status: dupe.payment_status, duplicate: true }, 200, cors);

  const nowMs = Date.now();
  let piStatus = '';
  if (b.paymentStatus === 'Paid') {
    const pi = await stripe(env, 'GET', '/payment_intents/' + encodeURIComponent(b.paymentIntentId));
    const ok = ['succeeded', 'processing'].includes(pi.status) && pi.amount === DEPOSIT_CENTS &&
      pi.metadata && pi.metadata.source === SOURCE && pi.metadata.draft_ref === b.draftRef;
    if (!ok) return json({ error: 'We could not verify your deposit payment. Please try again or call us.' }, 402, cors);
    piStatus = pi.status;
  }

  const bookable = slotIsBookable(b.date, b.time, nowMs);
  if (b.paymentStatus !== 'Paid' && !bookable) {
    return json({ error: 'That install window is no longer available. Please pick another time.', code: 'SLOT_UNAVAILABLE' }, 409, cors);
  }

  const parts = [`Type: ${b.type}`];
  if (b.details) parts.push(b.details);
  parts.push(`Ref: ${b.draftRef}`);
  if (b.paymentIntentId) parts.push(`PI: ${b.paymentIntentId}${piStatus === 'processing' ? ' (processing)' : ''}`);
  const createdAt = new Date(nowMs).toISOString();

  for (let attempt = 0; attempt < 4; attempt++) {
    const id = newId();
    try {
      if (b.paymentStatus === 'Paid') {
        // A paid booking is always saved. If it lost a slot race, flag it for a call.
        const taken = (await slotCount(env, b.date, b.time)) >= SLOT_CAPACITY;
        const notes = (taken || !bookable ? 'SLOT CONFLICT — call customer to reschedule · ' : '') + parts.join(' · ');
        await env.DB.prepare(
          "INSERT INTO bookings (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booked', 'Paid')"
        ).bind(id, b.date, b.time, b.service, b.name, b.phone, b.email, b.vehicle, b.address, notes, SOURCE, createdAt).run();
        return json({ id, payment_status: 'Paid', conflict: taken || !bookable }, 201, cors);
      }
      // Pay Later: insert atomically only if the slot is still free.
      const res = await env.DB.prepare(
        `INSERT INTO bookings (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, payment_status)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booked', 'Pay Later'
         WHERE (SELECT COUNT(*) FROM bookings WHERE source = ? AND ${ACTIVE} AND ${SLOT_D} = ? AND ${SLOT_T} = ?) < ?`
      ).bind(id, b.date, b.time, b.service, b.name, b.phone, b.email, b.vehicle, b.address, parts.join(' · '), SOURCE, createdAt,
        SOURCE, b.date, b.time, SLOT_CAPACITY).run();
      if (!res.meta || res.meta.changes !== 1) {
        return json({ error: 'That install window was just booked. Please pick another time.', code: 'SLOT_UNAVAILABLE' }, 409, cors);
      }
      return json({ id, payment_status: 'Pay Later' }, 201, cors);
    } catch (err) {
      if (!/UNIQUE|constraint/i.test(String(err && err.message))) throw err; // id collision → retry
    }
  }
  return json({ error: 'Could not save the booking. Please call us.' }, 500, cors);
}

function isAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return false; // admin routes stay closed until a token is set
  return (request.headers.get('Authorization') || '') === `Bearer ${env.ADMIN_TOKEN}`;
}

async function handleListBookings(url, env, cors) {
  await ensureSchema(env);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '500', 10) || 500, 1), 2000);
  const { results } = await env.DB.prepare(
    'SELECT * FROM bookings WHERE source = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(SOURCE, limit).all();
  return json({ bookings: results || [] }, 200, cors);
}

async function handlePatchBooking(request, env, cors, id) {
  await ensureSchema(env);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'Invalid request' }, 400, cors);
  const keys = Object.keys(body).filter((k) => PATCHABLE.includes(k));
  if (!keys.length) return json({ error: `Nothing to update. Allowed: ${PATCHABLE.join(', ')}` }, 400, cors);
  for (const k of keys) {
    const v = body[k];
    if ((k === 'time' || k === 'reschedule_time' || k === 'original_time') && v && !(v in TIME_WINDOWS)) return json({ error: `Invalid ${k}` }, 400, cors);
    if ((k === 'date' || k === 'reschedule_date' || k === 'original_date') && v && !isISODate(v)) return json({ error: `Invalid ${k}` }, 400, cors);
    if (k === 'payment_status' && v && !['Paid', 'Pay Later'].includes(v)) return json({ error: 'payment_status must be Paid or Pay Later' }, 400, cors);
  }
  const sets = keys.map((k) => `${k} = ?`).join(', ');
  const vals = keys.map((k) => (body[k] == null ? null : String(body[k]).slice(0, 1000)));
  const res = await env.DB.prepare(`UPDATE bookings SET ${sets} WHERE id = ? AND source = ?`).bind(...vals, id, SOURCE).run();
  if (!res.meta || res.meta.changes === 0) return json({ error: 'Booking not found' }, 404, cors);
  const row = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND source = ?').bind(id, SOURCE).first();
  return json({ booking: row }, 200, cors);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    try {
      if (path === '/api/health') return json({ ok: true, source: SOURCE }, 200, cors);
      if (path === '/api/availability' && request.method === 'GET') return await handleAvailability(url, env, cors);
      if (path === '/api/payment-intent' && request.method === 'POST') return await handlePaymentIntent(request, env, cors);
      if (path === '/api/bookings' && request.method === 'POST') return await handleCreateBooking(request, env, cors);
      if (path === '/api/bookings' && request.method === 'GET') {
        if (!isAdmin(request, env)) return json({ error: 'Not found' }, 404, cors);
        return await handleListBookings(url, env, cors);
      }
      const m = path.match(/^\/api\/bookings\/([A-Za-z0-9-]+)$/);
      if (m && request.method === 'PATCH') {
        if (!isAdmin(request, env)) return json({ error: 'Not found' }, 404, cors);
        return await handlePatchBooking(request, env, cors, m[1]);
      }
      return json({ error: 'Not found' }, 404, cors);
    } catch (err) {
      console.log('Worker error:', err && err.stack);
      return json({ error: (err && err.status && err.message) || 'Something went wrong. Please call us.' }, (err && err.status) || 500, cors);
    }
  },
};
