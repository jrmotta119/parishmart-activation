# ParishMart Monorepo

A faith-based marketplace platform connecting parishes, local vendors, and their communities. Monorepo managed with [Turborepo](https://turbo.build/).

---

## Project Structure

```
parishmart/
├── apps/
│   ├── api/                    # Express.js + TypeScript backend
│   │   └── src/
│   │       ├── controllers/    # Route controllers
│   │       ├── db/             # PostgreSQL connection + migrations
│   │       ├── middleware/     # Auth, error handling, rate limiting
│   │       ├── repositories/   # DB query layer
│   │       ├── routes/         # API route definitions
│   │       ├── services/       # Business logic (email, image processing, marketplace)
│   │       ├── templates/      # Handlebars email templates
│   │       └── utils/          # Token utils, email templates, helpers
│   ├── marketplace/            # Next.js 14 mobile-first marketplace (App Router)
│   │   └── src/
│   │       ├── app/            # Next.js App Router pages
│   │       │   ├── browse/     # Browse parishes, products, vendors, donations
│   │       │   ├── donation/[donationId]/  # Campaign detail page
│   │       │   ├── product/[productId]/   # Product detail page
│   │       │   ├── store/[storeId]/       # Parish store page
│   │       │   └── vendor/[vendorId]/     # Local vendor page
│   │       ├── components/     # UI components by domain
│   │       │   ├── browse/     # Browse/search UI
│   │       │   ├── donation/   # Campaign detail shell
│   │       │   ├── home/       # Home page (hero, featured sections)
│   │       │   ├── layout/     # BottomNav, Providers wrapper
│   │       │   ├── product/    # Product detail shell + gallery
│   │       │   ├── store/      # Parish store + product cards
│   │       │   └── vendor/     # Vendor page shell + service cards
│   │       ├── context/        # CartContext (localStorage cart)
│   │       ├── lib/            # Mock data, helpers
│   │       └── types/          # Shared TS types (StoreProduct, CartItem, etc.)
│   └── onboarding/             # Vite + React registration & admin portal
│       └── src/
│           ├── components/     # Registration forms, admin dashboard
│           ├── lib/            # api.ts helper (apiUrl())
│           └── types/          # Form types
└── packages/
    ├── shared/                 # Shared constants + types (@parishmart/shared)
    ├── config/                 # Shared tooling config
    └── ui/                     # Shared UI component library
```

---

## Apps

| App | Description | Local port |
|---|---|---|
| `apps/api` | REST API — registration, admin, webhooks, image processing | 3001 |
| `apps/marketplace` | Mobile-first Next.js consumer marketplace | 3002 |
| `apps/onboarding` | Vite/React registration portal + admin dashboard | 3000 |

---

## Infrastructure & External Services

### Production

| Resource | Service | URL / identifier |
|---|---|---|
| API backend | **Heroku** | `api.parishmart.com` |
| Onboarding frontend | **Vercel** | `home.parishmart.com` |
| Marketplace frontend | **Vercel** | *(Vercel auto-deploy from `main`)* |
| Database | **Heroku Postgres** | attached to Heroku app |
| Email | **Gmail SMTP** | App Password via `EMAIL_USER` / `EMAIL_PASS` |
| Image processing | **ImaMod** | `IMAMOD_API_URL` + `IMAMOD_API_KEY` |
| File storage | **AWS S3** | `AWS_BUCKET_NAME`, `AWS_REGION` |

### QA

| Resource | Service | URL / identifier |
|---|---|---|
| API backend | **Railway** | `web-production-6ce8a.up.railway.app` |
| Onboarding frontend | **Vercel** | Vercel preview URLs (branch: `qa`) |
| Marketplace frontend | **Vercel** | Vercel preview URLs (branch: `qa`) |
| Database | **Railway PostgreSQL** | `maglev.proxy.rlwy.net:35888` / db: `railway` |
| Email | **Resend** (HTTP API) | `RESEND_API_KEY` — bypasses Railway SMTP block |
| Image processing | **ImaMod** | same keys as production |
| File storage | **AWS S3** | same bucket as production |

> **Why Resend for QA?** Railway blocks all outbound SMTP ports (25, 465, 587, 2525).
> The API auto-selects Resend when `RESEND_API_KEY` is set, otherwise falls back to SMTP.

---

## Deploy Strategy

```
main branch  →  Vercel (auto)  +  Heroku (manual: git push heroku main)
qa branch    →  Vercel preview (auto)  +  Railway (auto)
```

`qa` is a long-lived branch — never deleted. Merge production fixes into `qa` as needed; merge `qa` → `main` when promoting to production.

---

## Environment Variables

### `apps/api`

| Variable | Required | Description |
|---|---|---|
| `PORT` | no | Server port (default 3001) |
| `NODE_ENV` | yes | `development` / `qa` / `production` |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `JWT_SECRET` | yes | Secret for signing JWTs |
| `CORS_ORIGINS` | yes | Comma-separated allowed origins (supports `*` wildcard) |
| `BASE_URL` | yes | **API** base URL (e.g. `https://api.parishmart.com`) — used in email approval links and ImaMod webhooks |
| `EMAIL_HOST` | SMTP only | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP only | SMTP port (e.g. `587`) |
| `EMAIL_SECURE` | SMTP only | `true` for SSL/465, `false` for TLS/587 |
| `EMAIL_USER` | SMTP only | SMTP username / Gmail address |
| `EMAIL_PASS` | SMTP only | Gmail App Password (16 chars) |
| `RESEND_API_KEY` | Resend only | Resend API key — takes priority over SMTP |
| `EMAIL_FROM_NAME` | yes | Sender display name (e.g. `ParishMart`) |
| `EMAIL_FROM_ADDRESS` | yes | Sender address (must match verified domain in Resend) |
| `IMAMOD_API_URL` | yes | ImaMod base URL |
| `IMAMOD_API_KEY` | yes | ImaMod API key |
| `IMAMOD_API_SECRET` | yes | ImaMod API secret |
| `AWS_ACCESS_KEY_ID` | yes | AWS credentials for S3 |
| `AWS_SECRET_ACCESS_KEY` | yes | AWS credentials for S3 |
| `AWS_REGION` | yes | S3 region |
| `AWS_BUCKET_NAME` | yes | S3 bucket name |
| `MARKETPLACE_API_KEY` | yes | Key for external marketplace API access |
| `MARKETPLACE_API_SECRET` | yes | Secret for external marketplace API access |

### `apps/onboarding`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | yes | Full API base URL (e.g. `https://api.parishmart.com`) |

### `apps/marketplace`

No runtime env vars — currently uses mock data. Will need `NEXT_PUBLIC_API_URL` when connected to the live API.

---

## Quick Start (local)

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install

```bash
npm install
```

### Build shared package (required before running API)

```bash
cd packages/shared && npm run build
```

### Run all apps

```bash
npm run dev
```

Or individually:

```bash
npm run dev:api          # API only  (port 3001)
npm run dev:onboarding   # Onboarding only  (port 3000)
npm run dev:marketplace  # Marketplace only  (port 3002)
```

### Database

```bash
npm run db:migrate   # Run pending migrations
npm run db:seed      # Seed with sample data
```

---

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server health |
| GET | `/api/health/db` | Database health |
| GET | `/api/health/email` | Email service health |
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/admin/logout` | Admin logout |
| GET | `/api/auth/admin/list` | List admin users |
| POST | `/api/auth/admin/create` | Create admin user |
| GET | `/api/admin/dashboard/:tab` | Dashboard data |
| GET | `/api/admin/approve/:token` | One-click approval from email |
| GET | `/api/admin/reject/:token` | One-click rejection from email |
| POST | `/api/registration` | Parish/store registration |
| POST | `/api/vendors/missions` | Fetch missions for vendor form |
| POST | `/api/webhook/image-processing` | ImaMod webhook callback |
| GET | `/api/external/*` | External marketplace API |

---

## Troubleshooting

**`@parishmart/shared` not found during build**
```bash
cd packages/shared && npm run build
```

**Railway SMTP timeout**
Railway blocks all outbound SMTP. Set `RESEND_API_KEY` instead of SMTP vars.

**Approval email links go to home page**
`BASE_URL` must point to the API server, not the frontend.
- Heroku: `BASE_URL=https://api.parishmart.com`
- Railway: `BASE_URL=https://web-production-6ce8a.up.railway.app`

**CORS errors from Vercel preview URLs**
Add a wildcard pattern to `CORS_ORIGINS`, e.g.:
```
CORS_ORIGINS=https://home.parishmart.com,https://*.vercel.app
```

**Vendor approval creating merchandise**
Ensure `merchandise: []` is passed in the ImaMod job payload for vendor approvals (stores pass the full merchandise array).
