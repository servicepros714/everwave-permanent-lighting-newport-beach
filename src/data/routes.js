/* ─────────────────────────────────────────────────────────────
   Route registry — one entry per page. Used by:
   • the app (document title, meta description, canonical, breadcrumbs)
   • the build (per-route HTML head + JSON-LD, sitemap.xml, robots.txt) — see scripts/seo.js
   `index: false` keeps a page out of the sitemap and adds noindex.
   ───────────────────────────────────────────────────────────── */
import { BUSINESS, SERVICES, quoteLabel } from './business.js';

const city = `${BUSINESS.city}, ${BUSINESS.region}`;
const permanent = SERVICES.find((s) => s.type === 'Permanent');
const seasonal = SERVICES.find((s) => s.type === 'Seasonal');

export const ROUTES = [
  {
    path: '/',
    label: 'Home',
    title: `${BUSINESS.name} | Christmas & Permanent Lights in ${city}`,
    description: `Permanent LED roofline lighting and professional Christmas light installation in ${city}. Design, install, maintenance and takedown. Book your install window online.`,
    priority: '1.0',
  },
  {
    path: '/services',
    label: 'Services',
    title: `Lighting Services in ${city}`,
    description: `Permanent roofline lighting and seasonal Christmas light installation for ${BUSINESS.city} homes. Compare packages, add-ons and how pricing works.`,
    priority: '0.9',
  },
  {
    path: `/services/${permanent.slug}`,
    label: permanent.name,
    parent: '/services',
    service: permanent.type,
    title: `${permanent.name} in ${city}`,
    description: `Permanent LED roofline lighting for ${BUSINESS.city} homes — mounted once, left in place and ready for every holiday. Quoted online, confirmed at your visit.`,
    priority: '0.9',
  },
  {
    path: `/services/${seasonal.slug}`,
    label: seasonal.name,
    parent: '/services',
    service: seasonal.type,
    title: `${seasonal.name} in ${city}`,
    description: `Done-for-you Christmas light installation in ${BUSINESS.city}: leased LED lights, custom design, in-season maintenance and takedown after the holidays.`,
    priority: '0.9',
  },
  {
    path: '/process',
    label: 'Our Process',
    title: 'Our Process — From Booking to Takedown',
    description: `How ${BUSINESS.name} works: book online, we confirm the design and price at your visit, our crew installs and tests, and seasonal lights come down after the holidays.`,
    priority: '0.7',
  },
  {
    path: '/gallery',
    label: 'Gallery',
    title: 'Gallery — Lighting Design Previews',
    description: `Illustrated design previews of permanent and seasonal roofline lighting styles from ${BUSINESS.name} in ${BUSINESS.city}.`,
    priority: '0.6',
  },
  {
    path: '/about',
    label: 'About Us',
    title: `About ${BUSINESS.name}`,
    description: `${BUSINESS.name} is a ${BUSINESS.city}-based lighting company installing permanent roofline lighting and Christmas lights across nearby Orange County cities.`,
    priority: '0.7',
  },
  {
    path: '/faq',
    label: 'FAQ',
    title: 'Frequently Asked Questions',
    description: `Answers about pricing, deposits, outdoor outlets, timers, takedown, weather and the service area for ${BUSINESS.name} in ${BUSINESS.city}.`,
    priority: '0.7',
    faq: true,
  },
  {
    path: '/quote',
    label: quoteLabel(),
    title: `${quoteLabel()} — Christmas & Permanent Lighting`,
    description: `How pricing works at ${BUSINESS.name}: starting-at packages, online quoting and a final price confirmed at your visit. Request a quote or book online.`,
    priority: '0.8',
  },
  {
    path: '/contact',
    label: 'Contact Us',
    title: `Contact ${BUSINESS.name}`,
    description: `Get in touch with ${BUSINESS.name} in ${city} about permanent lighting or Christmas light installation, or book your install window online.`,
    priority: '0.8',
  },
  {
    path: '/book',
    label: 'Book Online',
    title: 'Book Your Install',
    description: `Book permanent or seasonal Christmas light installation in ${BUSINESS.city} online. Pick a package, add-ons and an install window. Pay a deposit or pay at the visit.`,
    priority: '0.8',
  },
  { path: '/privacy', label: 'Privacy Policy', title: 'Privacy Policy', description: `How ${BUSINESS.name} collects, uses and protects the personal information you share through this website.`, priority: '0.3', legal: true },
  { path: '/terms', label: 'Terms & Conditions', title: 'Terms and Conditions', description: `The terms that apply when you use the ${BUSINESS.name} website, request a quote or book an installation.`, priority: '0.3', legal: true },
  { path: '/cookies', label: 'Cookie Policy', title: 'Cookie Policy', description: `How the ${BUSINESS.name} website uses cookies and browser storage.`, priority: '0.3', legal: true },
  { path: '/accessibility', label: 'Accessibility', title: 'Accessibility Statement', description: `Our commitment to making the ${BUSINESS.name} website usable for everyone, and how to report a barrier.`, priority: '0.3', legal: true },

  /* Not indexed: transactional pages. */
  { path: '/checkout', label: 'Checkout', title: 'Checkout', description: 'Reserve your install window.', index: false },
  { path: '/confirmation', label: 'Booking confirmed', title: 'You’re booked', description: 'Your booking confirmation.', index: false },
];

export const NOT_FOUND = { path: '/404', label: 'Page not found', title: 'Page not found', description: 'This page could not be found.', index: false };

export const routeFor = (path) => ROUTES.find((r) => r.path === path) || NOT_FOUND;

/** "Title | Brand" (home already contains the brand). */
export const fullTitle = (r) => (r.path === '/' || r.title.includes(BUSINESS.name) ? r.title : `${r.title} | ${BUSINESS.name}`);

export const canonical = (path) => BUSINESS.siteUrl + (path === '/' ? '/' : path);

/** Breadcrumb trail for a route: Home → parent → page. */
export function crumbs(r) {
  if (r.path === '/') return [];
  const out = [{ path: '/', label: 'Home' }];
  if (r.parent) { const p = routeFor(r.parent); out.push({ path: p.path, label: p.label }); }
  out.push({ path: r.path, label: r.label });
  return out;
}
