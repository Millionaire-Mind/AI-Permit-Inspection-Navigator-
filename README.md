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
