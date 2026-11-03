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

Every push to `main` builds and deploys. `public/_redirects` keeps client routes (`/book`, `/checkout`, `/confirmation`) working.

## Data (shared D1 columns)

`id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, reschedule_date, reschedule_time, notes2, original_date, original_time, payment_status`

- `time`: `8AM–12PM` or `12PM–4PM` (en dash)
- `vehicle`: `Seasonal · 2-Story · Front & Sides · +Wreaths`
- `notes`: `Type: … · Add-ons: … · Estimate: … · Ref: EWR-… · PI: pi_…`
- `payment_status`: `Paid` / `Pay Later`
- PATCHABLE: status, reschedule_date, reschedule_time, notes2, original_date, original_time, payment_status, date, time

Worker behavior: availability is source-scoped and reschedule-aware; Cancelled frees a slot; Pay Later inserts are atomic; paid bookings are verified with Stripe first, and a paid booking that loses a slot race is still saved and flagged `SLOT CONFLICT`; PaymentIntents are idempotent per draft ref; Pacific time is DST-aware.

## TODO before launch

- [ ] Real phone number (`src/data/business.js` and `telephone` in `index.html` JSON-LD) — the one provided had 9 digits.
- [ ] Package and add-on prices (`null` shows "Online quoting").
- [ ] Confirm the service-area city list.
- [ ] Confirm takedown timing in the FAQ.
- [ ] Replace illustrated gallery scenes with real night install photos.
- [ ] Add real reviews / Google review link when they exist (never invent them).
- [ ] Update canonical / OG URLs when a custom domain is connected.
