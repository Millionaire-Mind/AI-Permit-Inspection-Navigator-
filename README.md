# AI Permit & Inspection Navigator (Full Next.js)

This repository contains the Phase 1–8 implementation of the AI Permit & Inspection Navigator:
- Moderation assistance (AI suggestions)
- Feedback capture and retraining pipeline
- Forecasting and proactive scheduling
- Admin dashboards (retrain, canary, SLA, audit logs)
- Alerts (Slack, Email)
- PDF/CSV exports
- Canary & model lifecycle management
- Cost-aware retrain scheduling
- Monetization stubs

---

## Assumptions & Requirements
- Node.js 20+ recommended
- Yarn or npm
- PostgreSQL for Prisma (DATABASE_URL)
- External training service endpoint (TRAINING_SERVICE_URL)
- External inference service endpoint (INFERENCE_SERVICE_URL)
- Slack webhook + signing secret for interactive messages

---

## Setup
1. Copy `.env.example` to `.env` and fill placeholders.
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Seed (optional):
   ```bash
   npm run prisma:seed
   ```

### Environment variables
- DATABASE_URL: PostgreSQL connection string
- INFERENCE_SERVICE_URL: External inference API base URL
- INFERENCE_API_KEY: Token for inference service
- TRAINING_SERVICE_URL: External training API base URL