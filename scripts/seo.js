/* ─────────────────────────────────────────────────────────────
   Build-time SEO: per-route <head> tags, JSON-LD, <noscript> fallback,
   sitemap.xml and robots.txt — all generated from src/data/*.js, so the
   structured data can never drift from what the site shows.

   Structured data rules: only facts that are visible on the site.
   No ratings, reviews, hours, coordinates, price range or social
   profiles unless they are filled in (and shown) in business.js.
   ───────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import { BUSINESS, FAQS, SERVICES, SERVICE_AREA, missingDetails } from '../src/data/business.js';
import { ROUTES, canonical, crumbs, fullTitle, routeFor } from '../src/data/routes.js';

const SITE = BUSINESS.siteUrl;
const OG_IMAGE = `${SITE}/og-image.jpg`;
const BIZ_ID = `${SITE}/#business`;
const WEB_ID = `${SITE}/#website`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');
const cities = () => [...SERVICE_AREA.coast, ...SERVICE_AREA.inland].map((c) => c.name);

function business() {
  const a = BUSINESS.address || {};
  const node = {
    '@type': 'HomeAndConstructionBusiness',
    '@id': BIZ_ID,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: `${SITE}/`,
    logo: `${SITE}/icon-512.png`,
    image: OG_IMAGE,
    address: {
      '@type': 'PostalAddress',
      ...(a.street ? { streetAddress: a.street } : {}),
      addressLocality: a.city || BUSINESS.city,
      addressRegion: a.region || BUSINESS.region,
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
      addressCountry: BUSINESS.country,
    },
    areaServed: cities().map((name) => ({ '@type': 'City', name })),
  };
  if (BUSINESS.legalName) node.legalName = BUSINESS.legalName;
  if (BUSINESS.phone) node.telephone = BUSINESS.phone;
  if (BUSINESS.email) node.email = BUSINESS.email;
  if (BUSINESS.social.length) node.sameAs = BUSINESS.social;
  return node;
}

function jsonLd(r) {
  const url = canonical(r.path);
  const graph = [
    business(),
    { '@type': 'WebSite', '@id': WEB_ID, url: `${SITE}/`, name: BUSINESS.name, publisher: { '@id': BIZ_ID }, inLanguage: 'en-US' },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: fullTitle(r), description: r.description, isPartOf: { '@id': WEB_ID }, about: { '@id': BIZ_ID }, inLanguage: 'en-US' },
  ];
  const trail = crumbs(r);
  if (trail.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: canonical(c.path) })),
    });
  }
  if (r.service) {
    const s = SERVICES.find((x) => x.type === r.service);
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: s.name,
      serviceType: s.name,
      description: s.summary,
      provider: { '@id': BIZ_ID },
      areaServed: cities().map((name) => ({ '@type': 'City', name })),
      url,
    });
  }
  if (r.faq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function headFor(r) {
  const url = canonical(r.path);
  const title = fullTitle(r);
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    r.index === false ? '<meta name="robots" content="noindex" />' : '',
    BUSINESS.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(BUSINESS.googleSiteVerification)}" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc(BUSINESS.name)} — ${esc(BUSINESS.city)}, ${esc(BUSINESS.region)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    r.index === false ? '' : `<script type="application/ld+json">\n${json(jsonLd(r))}\n</script>`,
  ].filter(Boolean);
  return `<!--seo:start-->\n    ${lines.join('\n    ')}\n    <!--seo:end-->`;
}

/** Plain-HTML fallback for visitors and crawlers without JavaScript. */
export function noscriptFor(r) {
  const links = ROUTES.filter((x) => x.index !== false && x.path !== r.path)
    .map((x) => `<a href="${x.path}">${esc(x.label)}</a>`).join(' · ');
  const contact = [BUSINESS.phoneHref && `<a href="${BUSINESS.phoneHref}">${esc(BUSINESS.phoneDisplay)}</a>`, BUSINESS.email && `<a href="mailto:${esc(BUSINESS.email)}">${esc(BUSINESS.email)}</a>`].filter(Boolean).join(' · ');
  return `<!--ns:start--><noscript><div style="padding:24px;font-family:system-ui,sans-serif;max-width:760px;margin:auto">` +
    `<h1>${esc(r.path === '/' ? BUSINESS.name : r.label)}</h1><p>${esc(r.description)}</p>` +
    (contact ? `<p>${contact}</p>` : '') +
    `<p>Please enable JavaScript to use online booking.</p><nav>${links}</nav></div></noscript><!--ns:end-->`;
}

export function inject(html, r) {
  return html
    .replace(/<!--seo-->|<!--seo:start-->[\s\S]*?<!--seo:end-->/, headFor(r))
    .replace(/<!--seo-noscript-->|<!--ns:start-->[\s\S]*?<!--ns:end-->/, noscriptFor(r));
}

export function sitemap(date = new Date().toISOString().slice(0, 10)) {
  const urls = ROUTES.filter((r) => r.index !== false)
    .map((r) => `  <url>\n    <loc>${canonical(r.path)}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>${r.priority || '0.5'}</priority>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robots() {
  return `User-agent: *\nAllow: /\nDisallow: /checkout\nDisallow: /confirmation\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

/** Vite plugin: home head in dev + build; every other route, sitemap and robots after the build. */
export function seoPlugin() {
  let outDir = 'dist';
  let isBuild = false;
  return {
    name: 'everwave-seo',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); isBuild = c.command === 'build'; },
    transformIndexHtml: { order: 'pre', handler: (html) => inject(html, routeFor('/')) },
    closeBundle() {
      if (!isBuild) return;
      const base = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      // Clean URLs on Cloudflare Pages: /about is served from about.html.
      for (const r of ROUTES) {
        if (r.path === '/') continue;
        const file = path.join(outDir, `${r.path.slice(1)}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, inject(base, r));
      }
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap());
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robots());
      const missing = missingDetails();
      if (missing.length) {
        console.warn(`\n⚠ Business details still missing (src/data/business.js):\n  - ${missing.join('\n  - ')}\n`);
      }
    },
  };
}
