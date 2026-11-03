/* Pacific-time math (DST-aware via Intl). Mirrors worker/worker.js. */
import { SEASON, LEAD_HOURS, TIME_WINDOWS } from '../data/business.js';

const TZ = 'America/Los_Angeles';
const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

export function pacificParts(ms = Date.now()) {
  const o = {};
  for (const p of fmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, s: +o.second };
}

export function pacificToUtc(y, m, d, h) {
  const target = Date.UTC(y, m - 1, d, h, 0, 0);
  let guess = target + 8 * 3600e3;
  for (let i = 0; i < 3; i++) {
    const p = pacificParts(guess);
    const diff = target - Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
    if (diff === 0) break;
    guess += diff;
  }
  return guess;
}

export const pad = (n) => String(n).padStart(2, '0');
export const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
export const parseIso = (s) => s.split('-').map(Number);

/** Today's date in Pacific time as YYYY-MM-DD. */
export const todayIso = (nowMs = Date.now()) => {
  const p = pacificParts(nowMs);
  return iso(p.y, p.m, p.d);
};

/** The season we're booking: this year's until Dec 20 passes, then next year's. */
export function seasonYear(nowMs = Date.now()) {
  const p = pacificParts(nowMs);
  return p.m * 100 + p.d > SEASON.end.month * 100 + SEASON.end.day ? p.y + 1 : p.y;
}

export function seasonRange(nowMs = Date.now()) {
  const y = seasonYear(nowMs);
  return {
    year: y,
    from: iso(y, SEASON.start.month, SEASON.start.day),
    to: iso(y, SEASON.end.month, SEASON.end.day),
  };
}

export function inSeason(dateStr) {
  const [, m, d] = parseIso(dateStr);
  const v = m * 100 + d;
  return v >= SEASON.start.month * 100 + SEASON.start.day && v <= SEASON.end.month * 100 + SEASON.end.day;
}

export function slotStartMs(dateStr, windowId) {
  const w = TIME_WINDOWS.find((t) => t.id === windowId);
  if (!w) return NaN;
  const [y, m, d] = parseIso(dateStr);
  return pacificToUtc(y, m, d, w.start);
}

export function slotIsBookable(dateStr, windowId, booked = {}, nowMs = Date.now()) {
  if (!inSeason(dateStr)) return false;
  if ((booked[dateStr] || []).includes(windowId)) return false;
  return slotStartMs(dateStr, windowId) >= nowMs + LEAD_HOURS * 3600e3;
}

export function openWindows(dateStr, booked, nowMs) {
  return TIME_WINDOWS.filter((w) => slotIsBookable(dateStr, w.id, booked, nowMs));
}

/** Add days to an ISO date (calendar math in UTC so DST never shifts it). */
export function addDays(dateStr, n) {
  const [y, m, d] = parseIso(dateStr);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}
export const weekday = (dateStr) => {
  const [y, m, d] = parseIso(dateStr);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sun
};

export function seasonDays(nowMs = Date.now()) {
  const { from, to } = seasonRange(nowMs);
  const out = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export function firstOpenSlot(booked, nowMs = Date.now()) {
  for (const d of seasonDays(nowMs)) {
    const w = openWindows(d, booked, nowMs);
    if (w.length) return { date: d, window: w[0] };
  }
  return null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const monthShort = (m) => MONTHS[m - 1];
export const monthLong = (m) => MONTHS_LONG[m - 1];
export const dayShort = (i) => DAYS[i];

export function fmtDate(dateStr, long = false) {
  if (!dateStr) return '';
  const [, m, d] = parseIso(dateStr);
  const wd = weekday(dateStr);
  return long ? `${DAYS_LONG[wd]}, ${MONTHS_LONG[m - 1]} ${d}` : `${DAYS[wd]}, ${MONTHS[m - 1]} ${d}`;
}
