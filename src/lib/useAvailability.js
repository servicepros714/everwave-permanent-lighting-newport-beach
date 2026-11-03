import { useEffect, useState } from 'react';
import { getAvailability } from './api.js';
import { seasonRange } from './time.js';

/* Booked slots for the whole season, shared by the home page and the booking flow. */
let cache = null;
let inflight = null;

export function useAvailability(refreshKey = 0) {
  const [state, setState] = useState(() => cache || { booked: {}, status: 'loading' });
  useEffect(() => {
    let live = true;
    if (refreshKey) { cache = null; inflight = null; }
    if (cache && !refreshKey) { setState(cache); return undefined; }
    const { from, to } = seasonRange();
    inflight = inflight || getAvailability(from, to)
      .then((r) => (cache = { booked: r.booked || {}, status: 'live' }))
      .catch(() => ({ booked: {}, status: 'offline' }))
      .finally(() => { inflight = null; });
    inflight.then((s) => live && setState(s));
    return () => { live = false; };
  }, [refreshKey]);
  return state;
}
