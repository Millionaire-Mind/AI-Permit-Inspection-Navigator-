# Architecture

## Overview
- Next.js 14 App Router
- PostgreSQL via Prisma
- Background jobs (cron) for alerts and retraining
- External services: Training, Inference, Slack, Email (SMTP), Stripe, S3-compatible storage

## High-Level Diagram

User → Next.js (UI) → API Routes (App/Pages) → Prisma → PostgreSQL

Admin → Admin UI → Retrain/Canary APIs → External Training/Inference → ProductionModel

Cron → Alert Sweep → AlertEvent/Audit → Slack/Email Notifications

## Data Flow
- Appeals
  - Moderator creates/updates appeals (App Routes)
  - AI Assist suggestions logged; feedback stored for retraining
- Retraining
  - Scheduler triggers retrain (manual or cron)
  - Jobs stored in `RetrainJob` with metadata (samples, validation, modelVersion)
  - Canary deploy → `ProductionModel` stage=canary, then promotion to production
- Alerts
  - Rules in `AlertRule`
  - Sweep creates `AlertEvent` and `Audit`, and notifies Slack/Email
  - Timeline aggregates Alert/Audit for observability
- Observability
  - Sentry for error tracking, Health endpoint, Middleware logging, Rate limiting

## Key Models
- `RetrainJob(id, status, sampleCount, metadata)`
- `ProductionModel(modelVersion, stage, deployedAt, metadata)`
- `AlertRule(kind, threshold, windowHours, active)`
- `ForecastLog(results)`
- `Audit(action, actor, detail, createdAt)`

## Security & Access
- Middleware role-gates `/admin`, `/editor`, `/protected`
- NextAuth JWT cookie support (optional), plus legacy cookie fallback for demos

## Extensions
- Replace in-memory rate limiting with Redis
- Replace Slack-only alerts with incident tooling (PagerDuty, Opsgenie)
- Add feature flags to gate experimental features