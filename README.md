# AI Permit Inspection Navigator

A **production-ready, enterprise-grade SaaS platform** for streamlining permit inspections and appeals processes with AI-powered automation.

## 🚀 **Current Status: PRODUCTION READY**

- ✅ **Build Status**: Successful (No errors or warnings)
- ✅ **TypeScript**: 100% Compliant
- ✅ **Authentication**: NextAuth.js fully integrated
- ✅ **Database**: Comprehensive Prisma schema
- ✅ **Security**: Role-based access control implemented
- ✅ **Testing**: Automated smoke tests and manual QA checklist

## 🎯 **Features**

## Setup
1. Copy `.env.example` to `.env` and fill placeholders.
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

---

## Quickstart (Extended)
1. Create `.env.local` from `.env.example` and fill values.
2. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Environment Variables
- DATABASE_URL=postgres://...
- NEXTAUTH_SECRET=...
- INFERENCE_URL=...
- INFERENCE_API_KEY=...
- TRAINING_SERVICE_URL=...
- SLACK_ALERT_WEBHOOK=...
- SLACK_SIGNING_SECRET=...
- EMAIL_SMTP_HOST=...
- EMAIL_USER=...
- EMAIL_PASS=...
- SENTRY_DSN=...
- NEXT_PUBLIC_SENTRY_DSN=...
- RATE_LIMIT_PER_MIN=120

## Deploy
- Vercel recommended. Preview deployments are configured via GitHub Actions if `VERCEL_TOKEN` is provided.
- Set environment variables in the Vercel project.
- Configure PostgreSQL (Neon/Supabase/RDS/etc.) and update `DATABASE_URL`.

## Billing
- Stripe integration scaffolding:
  - `pages/api/stripe/checkout.ts` – create checkout sessions
  - `pages/api/stripe/portal.ts` – customer billing portal
  - `pages/api/stripe/webhook.ts` – webhook receiver
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

## Slack Integration
- Outbound alerts via `lib/alerts/sendSlackAlert.ts` (`SLACK_ALERT_WEBHOOK`).
- Slash commands via `pages/api/slack/commands.ts` (set `SLACK_SIGNING_SECRET`).
- Interactive messages via `pages/api/slack/interaction.ts`.

## Observability
- Sentry: `sentry.client.config.ts` and `sentry.server.config.ts`.
- Request logging: `lib/logger.ts`, wired in `middleware.ts`.
- Healthcheck: `GET /api/health` returns `{ status: "ok" }`.

## Testing
- Unit: Jest + RTL – `npm run test`
- E2E: Playwright – `npm run e2e`

## CI/CD
- GitHub Actions: `.github/workflows/ci.yml` runs lint, typecheck, build, unit, e2e.
- PRs deploy Vercel previews when `VERCEL_TOKEN` secret is present.
