/* Worker API client. VITE_API_BASE = Worker URL (no trailing slash). */
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');

async function call(path, opts = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
  } catch {
    throw Object.assign(new Error('We could not reach our booking system. Check your connection or call us.'), { status: 0 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong.'), { status: res.status, code: data.code });
  return data;
}

export const getAvailability = (from, to) =>
  call(`/api/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

export const createPaymentIntent = (draftRef) =>
  call('/api/payment-intent', { method: 'POST', body: JSON.stringify({ draftRef }) });

export const createBooking = (payload) =>
  call('/api/bookings', { method: 'POST', body: JSON.stringify(payload) });
