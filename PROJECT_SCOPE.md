# AI Permit & Inspection Navigator – Project Scope

## 📌 Project Vision
The **AI Permit & Inspection Navigator** is a SaaS platform that streamlines the building permit and inspection process for municipalities, contractors, and homeowners. The platform combines workflow automation, AI-driven assistance, reporting, and proactive scheduling to:

- Help users submit, track, and manage permits & inspections.  
- Provide AI moderation and suggestions for approval/denial decisions.  
- Automate feedback loops to retrain AI models over time.  
- Generate and export reports (PDF/CSV).  
- Enable forecasting, SLA management, and alerts for compliance.  
- Offer an extensible SaaS model that can later be monetized.  

**Long-term goal:** Spin up entire SaaS backends in hours using scaffolding automation (Cursor + GitHub + n8n) while building a product valuable enough for municipal and contractor adoption.

---

## ⚙️ Tech Stack
- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **Database:** PostgreSQL (via Prisma ORM)  
- **Auth:** NextAuth.js (JWT sessions, optional OAuth later)  
- **UI:** TailwindCSS + shadcn/ui components  
- **Data Viz:** Recharts  
- **AI Integration:**  
  - Inference Service (`INFERENCE_SERVICE_URL`)  
  - Training Service (`TRAINING_SERVICE_URL`)  
- **Exports:** @react-pdf/renderer, file-saver  
- **Alerts:** Slack webhook + Nodemailer (Email)  
- **Background Jobs:** node-cron  
- **Payments (future):** Stripe (stub already included)  

---

## 📅 Phase-by-Phase Plan

### Phase 1 – Core Models & CRUD
- **Models:**  
  - User (email, password, role, reports, pdfExports)  
  - Report (linked to User, with status, address)  
  - PdfExport (linked to User + Report, stores file URL)  
- **APIs:**  
  - `/api/users` – User creation & management  
  - `/api/reports` – Create, update, fetch reports  
  - `/api/pdf` – Export report to PDF  
- **DB:** Prisma migrations + PostgreSQL setup  
- **UI:** Simple dashboard with report submission  

### Phase 2 – Moderation Assistance
- AI Suggestion Pipeline: Propose categories/actions for reports  
- Store logs in `AIAssistLog`  
- Admin can approve/reject AI suggestions  
- **Models:**  
  - `AIAssistLog` (suggestions, confidence, rationale, SLA urgency)  
  - `ModerationAction` (override actions taken by admins)  

### Phase 3 – Feedback Capture & Retraining
- Capture moderator feedback (`AIFeedback`)  
- Store curated examples in `AITrainingExample`  
- Create retrain jobs (`RetrainJob`) → send to training service  
- **API:** `/api/feedback`  

### Phase 4 – Forecasting & Scheduling
- Forecasting model predicts workload & SLA risks  
- **Models:**  
  - `ForecastLog` (JSON results)  
  - `SLATask` (tied to deadlines)  
  - `SLASettings` (threshold rules per category)  
- **UI Components:** Forecast Graph + SLA Calendar  

### Phase 5 – Admin Dashboards
- Panels: Retrain jobs, Model deployments, SLA task list, Audit logs  
- **Models:** `AuditLog`, `ProductionModel`  
- **UI:** Admin dashboard pages with charts & data tables  

### Phase 6 – Alerts & Notifications
- Slack + Email integration when SLA is breached  
- Configurable notification rules  
- Runs via node-cron background tasks  

### Phase 7 – Export & Reporting
- PDF Exports of reports, admin summaries, SLA charts  
- CSV exports for data analysis  
- Store all exports in `PdfExport`  
- **UI:** “Export PDF/CSV” buttons  

### Phase 8 – Monetization & SaaS Prep
- Stripe subscription/pay-per-use integration  
- Plans: free, pro, enterprise  
- Feature gating + rate limits by plan  
- Admin tools for managing subscriptions  

---

## 🛠 Stretch Features / Post-Phase-8
- **Containerized Deployment:** Docker + CI/CD  
- **n8n Integration:** Automate repo scaffolding & workflows  
- **Advanced AI:** Auto-report summarization, permit pre‑approvals, contractor email drafts  
- **Multi-Tenant SaaS:** Per-municipality data isolation  
- **GIS Layer:** Address mapping for permits/inspections  
- **Mobile App:** React Native app for inspectors on-site  

---

## 🧭 Development Guidelines

**Auth**  
- NextAuth.js w/ credentials provider (email/pass).  
- JWT-based sessions. OAuth optional later.  

**Database**  
- Use UUIDs as PKs.  
- Always use Prisma migrations (`npx prisma migrate dev`).  

**UI/UX**  
- TailwindCSS + shadcn/ui for consistency.  
- Dashboard layout with cards, charts, and tables.  

**AI Pipelines**  
- Inference: REST → `INFERENCE_SERVICE_URL`  
- Retraining: POST job to `TRAINING_SERVICE_URL`  
- Logging: `AIAssistLog`, `AIFeedback`, `AITrainingExample`  

**Background Jobs**  
- node-cron for daily forecasts & SLA monitoring  
- Retrain queue management  

---

## 🚀 Next Steps
1. Finalize schema (`prisma/schema.prisma`) & migrate.  
2. Implement Phase 1 endpoints (`/api/users, /api/reports, /api/pdf`).  
3. Build minimal dashboard UI for reports & exports.  
4. Set up NextAuth.js for login/auth.  
5. Configure `.env`: