/* Booking draft — persisted in sessionStorage so it survives Stripe redirects. */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DRAFT_PREFIX } from '../data/business.js';

const KEY = 'everwave-draft-v1';
export const CONFIRM_KEY = 'everwave-last-booking';

const newRef = () => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = (crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(8)) : Array.from({ length: 8 }, () => Math.random() * 256));
  return DRAFT_PREFIX + Array.from(bytes, (x) => abc[Math.floor(x) % abc.length]).join('');
};

export const blankDraft = () => ({
  ref: newRef(),
  type: '',
  packageId: '',
  stories: '',
  addons: [],
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  step: 0,
});

function load() {
  try {
    const d = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (d && d.ref) return { ...blankDraft(), ...d };
  } catch { /* storage blocked */ }
  return blankDraft();
}

const Ctx = createContext(null);

export function DraftProvider({ children }) {
  const [draft, setDraft] = useState(load);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* ignore */ }
  }, [draft]);
  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) })), []);
  const reset = useCallback(() => {
    const fresh = blankDraft();
    setDraft(fresh);
    try { sessionStorage.setItem(KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
  }, []);
  return <Ctx.Provider value={{ draft, update, reset }}>{children}</Ctx.Provider>;
}

export const useDraft = () => useContext(Ctx);

/** True when every booking step has a value. */
export const draftComplete = (d) =>
  !!(d.type && d.packageId && d.stories && d.date && d.time && d.name && d.phone && d.email && d.address);
