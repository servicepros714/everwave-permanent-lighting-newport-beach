/* Keeps <head> in sync on client-side navigation. The first load already has the right tags
   (each route is pre-built with its own head by scripts/seo.js); this updates them as the visitor moves around. */
import { useEffect } from 'react';
import { canonical, fullTitle, routeFor } from '../data/routes.js';
import { missingDetails } from '../data/business.js';

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  if (value == null) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
}

export function usePageMeta(path) {
  useEffect(() => {
    const r = routeFor(path);
    const title = fullTitle(r);
    const url = r.path === '/404' ? null : canonical(r.path);
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', r.description);
    setMeta('link[rel="canonical"]', 'rel', 'canonical', url);
    setMeta('meta[name="robots"]', 'name', 'robots', r.index === false ? 'noindex' : null);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', r.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', r.description);
  }, [path]);
}

/* Remind the owner in development which business details are still placeholders. */
if (import.meta.env.DEV) {
  const missing = missingDetails();
  if (missing.length) console.warn('[Everwave] Business details still missing in src/data/business.js:\n- ' + missing.join('\n- '));
}
