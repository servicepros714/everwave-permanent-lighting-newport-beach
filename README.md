# Everwave Permanent Lighting — Newport Beach

Vite + React site with a 6-step booking flow, Stripe deposit checkout, and a Cloudflare Worker + D1 backend.

| Item | Value |
|---|---|
| Source tag | `everwave-newportbeach` |
| Booking ID prefix | `EW-` (draft refs `EWR-`) |
| Worker | `everwave-newportbeach-api` |
| Pages project | `everwave-permanent-lighting-newport-beach` |
| Deposit | $149 (applied to the final invoice) |

## 1. Run locally (Windows CMD)

```cmd
cd everwave-permanent-lighting-newport-beach
npm install
npm run dev
```

Edit `.env.local` first:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_...
VITE_API_BASE=https://everwave-newportbeach-api.<your-subdomain>.workers.dev
```

## 2. Cloudflare dashboard (no CLI)

1. **D1** → Create database (any name). Open **Console** and paste `worker/schema.sql` (optional — the Worker creates the table on its own).
2. **Workers & Pages** → Create → Worker named `everwave-newportbeach-api` → Edit code → paste `worker/worker.js` → Deploy.
3. Worker → **Settings → Bindings** → add D1 binding, variable name `DB`, pick the database.
4. Worker → **Settings → Variables and Secrets**:
   - `STRIPE_SECRET_KEY` (Secret) — `sk_live_…` or `sk_test_…`
   - `ALLOWED_ORIGINS` (Text, optional) — e.g. `https://everwave-permanent-lighting-newport-beach.pages.dev`
   - `ADMIN_TOKEN` (Secret, optional) — turns on `GET /api/bookings` and `PATCH /api/bookings/:id` for the admin dashboard
5. **Workers & Pages** → Create → Pages → **Direct Upload** → name it `everwave-permanent-lighting-newport-beach` (create the project once so GitHub Actions can deploy to it).

## 3. GitHub

```cmd
git init
git add .
git commit -m "Everwave Newport Beach site"
git branch -M main
git remote add origin https://github.com/servicepros714/everwave-permanent-lighting-newport-beach.git
git push -u origin main
```

Repo → Settings → Secrets and variables → Actions:
- `CLOUDFLARE_API_TOKEN` (token with *Cloudflare Pages: Edit*)
- `CLOUDFLARE_ACCOUNT_ID`
- Optional: `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_API_BASE` (override `.env.local` when set)

Every push to `main` builds and deploys. The build writes one HTML file per route (`about.html`, `services/permanent-lighting.html`, …) so Cloudflare Pages serves clean URLs with the right `<head>`; any other path falls back to the app (Pages' SPA mode — keep the project free of a top-level `404.html`).

## Data (shared D1 columns)

`id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, reschedule_date, reschedule_time, notes2, original_date, original_time, payment_status`

- `time`: `8AM–12PM` or `12PM–4PM` (en dash)
- `vehicle`: `Seasonal · 2-Story · Front & Sides · +Wreaths`
- `notes`: `Type: … · Add-ons: … · Estimate: … · Ref: EWR-… · PI: pi_…`
- `payment_status`: `Paid` / `Pay Later`
- PATCHABLE: status, reschedule_date, reschedule_time, notes2, original_date, original_time, payment_status, date, time

Worker behavior: availability is source-scoped and reschedule-aware; Cancelled frees a slot; Pay Later inserts are atomic; paid bookings are verified with Stripe first, and a paid booking that loses a slot race is still saved and flagged `SLOT CONFLICT`; PaymentIntents are idempotent per draft ref; Pacific time is DST-aware.

## Netlify (live site)

Live at **https://everwave-permanent-lighting-newport-beach.netlify.app** (`BUSINESS.siteUrl`). `netlify.toml` sets the
build (`npm run build` → `dist`, Node 20) and the app fallback. Manual deploy from this folder:

```cmd
netlify deploy --build --prod
```

For automatic deploys on push, link the GitHub repo in Netlify → Site configuration → Build & deploy.
Set `VITE_STRIPE_PUBLISHABLE_KEY` / `VITE_API_BASE` under Netlify → Environment variables, and add the Netlify
origin to the Worker's `ALLOWED_ORIGINS` (if set) so booking works.

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/services`, `/services/permanent-lighting`, `/services/christmas-lights` | Services overview + one page per service |
| `/process`, `/gallery`, `/about`, `/faq` | Our process, gallery (illustrated previews), about, FAQ |
| `/quote`, `/contact` | Quote + contact (email form appears once `BUSINESS.email` is set) |
| `/book`, `/checkout`, `/confirmation` | Booking flow (checkout + confirmation are `noindex`) |
| `/privacy`, `/terms`, `/cookies`, `/accessibility` | Legal pages (linked from the footer) |

## Business details — one file

Everything about the business lives in **`src/data/business.js`**: name, phone, email, hours, address, social links,
Google review link, Search Console code, About-page story, credentials and the policies used by the Terms page.
Empty values are hidden everywhere — nothing fake is shown. `npm run build` prints the list of details still missing.

## SEO (generated at build time)

`scripts/seo.js` (a Vite plugin) reads `src/data/routes.js` + `business.js` and writes, for every route:
title, meta description, canonical, Open Graph/Twitter tags, JSON-LD (`HomeAndConstructionBusiness`, `WebSite`,
`WebPage`, `BreadcrumbList`, plus `Service` on service pages and `FAQPage` on `/faq`) and a `<noscript>` fallback.
It also writes `dist/sitemap.xml` and `dist/robots.txt`. Change a page's title/description in `src/data/routes.js`.
Structured data only includes facts shown on the site — no ratings, hours, price range or coordinates unless you add them.

## TODO before launch

- [ ] Real phone number → `BUSINESS.phone`, `phoneDisplay`, `phoneHref` (the one provided had 9 digits, so no phone is shown).
- [ ] Business email → `BUSINESS.email` (turns on the contact + quote forms).
- [ ] Legal entity name → `BUSINESS.legalName`; review the legal pages with an attorney.
- [ ] Cancellation, deposit-refund and payment terms → `POLICIES` (Terms page shows a neutral fallback until then).
- [ ] Package and add-on prices (`null` shows "Online quoting").
- [ ] Confirm the service-area city list and takedown timing in the FAQ.
- [ ] Confirm existing marketing claims ("commercial-grade" lights, "we're new to Newport Beach").
- [ ] Replace illustrated gallery scenes with real night install photos.
- [ ] Add real reviews / Google review link when they exist (never invent them).
- [ ] Custom domain → `BUSINESS.siteUrl` (canonical, OG, sitemap and schema all follow it).
- [ ] Google Search Console → `BUSINESS.googleSiteVerification`, then submit `/sitemap.xml`.
- [ ] Set `VITE_STRIPE_PUBLISHABLE_KEY` and `VITE_API_BASE` (repo secrets or `.env.local`) — booking needs the Worker.
