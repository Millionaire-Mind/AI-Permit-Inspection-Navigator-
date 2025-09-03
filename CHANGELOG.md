# Changelog

All notable changes to this project will be documented in this file.

## [v0.9.0] - 2025-09-03

- Forecasting & Scheduling
  - Implement forecast runner with SMA bands, `ForecastLog` persistence
  - Background scheduler via instrumentation, periodic jobs
  - SLA proactive task creation and Slack alert
- Admin Dashboards
  - Admin page wired with trend graph, forecast logs, retrain admin, canary controls
  - Added audit and model list APIs
- Alerts & Notifications
  - Slack signing verification for interactive endpoint
  - Email alerts via Nodemailer (runtime-loaded)
  - Alert sweep cron; alert events persistence
- Export & Reporting
  - PDF export template improved; `PdfExport` persisted (guarded)
  - CSV export hardened
- Monetization & SaaS Prep
  - Stripe checkout/portal/webhook endpoints
  - Billing page; feature gating and gating PDF export
- Infra/Build
  - Instrumentation hook, cron-safe dynamic requires
  - Type fixes and Prisma guards across APIs

[Unreleased]: https://github.com/Millionaire-Mind/AI-Permit-Inspection-Navigator-/compare/v0.9.0...HEAD
[v0.9.0]: https://github.com/Millionaire-Mind/AI-Permit-Inspection-Navigator-/releases/tag/v0.9.0