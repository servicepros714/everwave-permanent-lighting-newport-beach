/* Builds the Worker payload, saves the booking, stores the confirmation snapshot. */
import { ADDONS, PACKAGES, TIME_WINDOWS } from '../data/business.js';
import { createBooking } from './api.js';
import { estimate, homeSummary } from './pricing.js';
import { CONFIRM_KEY } from './draft.jsx';

export function bookingPayload(d) {
  const pkg = PACKAGES.find((p) => p.id === d.packageId);
  const addons = (d.addons || []).map((id) => ADDONS.find((a) => a.id === id)).filter(Boolean).map((a) => a.name);
  const notes = [`Add-ons: ${addons.length ? addons.join(', ') : 'none'}`, `Estimate: ${estimate(d).label}`].join(' · ');
  return {
    lighting_type: d.type,
    service: pkg ? pkg.name : d.packageId,
    vehicle: homeSummary(d), // home details live in the shared `vehicle` column
    date: d.date,
    time: d.time,
    name: d.name.trim(),
    phone: d.phone.replace(/\D/g, ''),
    email: d.email.trim(),
    address: d.address.trim(),
    notes,
    draft_ref: d.ref,
  };
}

export async function finishBooking(draft, paymentStatus, paymentIntentId) {
  const res = await createBooking({
    ...bookingPayload(draft),
    payment_status: paymentStatus,
    payment_intent_id: paymentIntentId || undefined,
  });
  const win = TIME_WINDOWS.find((w) => w.id === draft.time);
  const snap = {
    id: res.id,
    paymentStatus: res.payment_status || paymentStatus,
    conflict: !!res.conflict,
    draft: { ...draft, windowLabel: win ? win.label : draft.time },
    at: Date.now(),
  };
  try { sessionStorage.setItem(CONFIRM_KEY, JSON.stringify(snap)); } catch { /* ignore */ }
  return snap;
}
