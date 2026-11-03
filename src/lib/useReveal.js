import { useEffect } from 'react';

/* Wave-rise reveals: every [data-rise] element rises in once when it enters the viewport.
   Delay follows a sine wave across siblings (set via --i on the element). Reduced motion → shown at once. */
export function useReveal(dep) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-rise]:not(.is-in)'));
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

/** Inline style for the n-th item in a group: sine-staggered delay. */
export const riseDelay = (i) => ({ '--rise-delay': `${Math.round(80 + 70 * i + 60 * Math.sin(i * 1.3))}ms` });
