/* Estimate math. Any unset (null) price → "Online quoting". Permanent is always quoted online. */
import { PACKAGES, ADDONS, STORY_OPTIONS } from '../data/business.js';

export const money = (n) => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
export const QUOTE = 'Online quoting';

export function priceLabel(price) {
  return price == null ? QUOTE : `Starting at ${money(price)}`;
}

export function addonLabel(a) {
  if (a.price == null) return QUOTE;
  return a.flat ? money(a.price) : `+${money(a.price)}`;
}

export function visibleAddons(type) {
  return ADDONS.filter((a) => !(a.seasonalOnly && type === 'Permanent'));
}

/** Returns { amount, label } — amount is null when anything is unpriced. */
export function estimate(b) {
  const pkg = PACKAGES.find((p) => p.id === b.packageId);
  if (!pkg || !b.type) return { amount: null, label: '—' };
  if (b.type === 'Permanent') return { amount: null, label: QUOTE };
  const base = pkg.price[b.type];
  if (base == null) return { amount: null, label: QUOTE };
  let total = base;
  const story = STORY_OPTIONS.find((s) => s.id === b.stories);
  if (story && story.pct) total += (base * story.pct) / 100;
  for (const id of b.addons || []) {
    const a = ADDONS.find((x) => x.id === id);
    if (!a) continue;
    if (a.price == null) return { amount: null, label: QUOTE };
    total += a.price;
  }
  return { amount: total, label: `Starting at ${money(total)}` };
}

/** Value for the shared `vehicle` column, e.g. "Seasonal · 2-Story · Front & Sides · +Wreaths". */
export function homeSummary(b) {
  const pkg = PACKAGES.find((p) => p.id === b.packageId);
  const parts = [b.type, b.stories, pkg ? pkg.name : ''].filter(Boolean);
  const add = (b.addons || []).map((id) => ADDONS.find((a) => a.id === id)).filter(Boolean).map((a) => '+' + a.short);
  return [...parts, ...add].join(' · ');
}
