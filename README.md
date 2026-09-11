# PROJECT LOOP — AI Customer Feedback Intelligence Platform

> **Zidio Web Development Internship Team Project**  
> **Deadline**: 3 October 2026  
> **Mentor**: Shaurya Pandey  

PROJECT LOOP is a full-stack, multi-tenant B2B SaaS web application designed to collect, organize, analyze, search, and act on customer feedback across multiple ingestion channels. The platform transforms unstructured customer feedback into actionable business intelligence through automated sentiment classification, theme and topic extraction, emerging trend velocity detection, grounded AI question answering ("Ask LOOP"), executive analytics dashboards, and Voice-of-Customer (VoC) reporting.

---

## Key Features

- **Multi-Tenant SaaS Security**: Organization-scoped data isolation enforced via Supabase PostgreSQL Row-Level Security (RLS) policies.
- **Server-Side Role-Based Access Control (RBAC)**: Owner, Admin, Analyst, and Viewer roles with strict permission checks on all mutation endpoints.
- **Multi-Channel Feedback Ingestion**: Manual entry form, CSV upload wizard (with drag-and-drop, header mapping, row validation, and progress reporting), and REST/Webhook ingestion API.
- **Dual-Mode AI Analysis Engine**:
  1. *OpenAI LLM Mode*: Cloud provider completions when an API key is configured.
  2. *Local Fallback Mode*: Deterministic, zero-dependency NLP lexicon and rule-based analyzer when no API key is set.
- **Explainable Emerging Trend Engine**: Window-over-window comparison math, growth rates, negative sentiment concentration, and representative customer evidence citations.
- **Ask LOOP (Grounded AI Q&A)**: Grounded natural language query engine backed by PostgreSQL text search and verifiable customer evidence citations.
- **Voice-of-Customer (VoC) Reports**: Multi-section report generator, date/segment scope, printable PDF view (`/dashboard/reports/[id]/print`).
- **1-Click Evaluator Demo Access**: Pre-seeded demo credentials and role switcher allowing evaluators to test all 4 roles instantly.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14+ (App Router), TypeScript (Strict Mode), React 19 / 18
- **Styling & UI**: Tailwind CSS, Lucide Icons, Radix UI primitives
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row-Level Security (RLS)
- **Data Visualization**: Recharts
- **Validation**: Zod
- **Forms & CSV**: React Hook Form, PapaParse
- **Testing**: Vitest, React Testing Library, Playwright E2E

---

## Quick Setup & Local Execution

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the placeholders:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key # Optional - falls back to local analyzer if omitted
```

### 2. Install Dependencies
```bash
cmd /c "npm install"
```

### 3. Run Database Seed Verification
```bash
npm run db:seed
```

### 4. Start Local Development Server
```bash
cmd /c "npm run dev"
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔑 Evaluator Demo Credentials (1-Click Login)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Owner** | `owner@loop.demo` | `password123` | Full org, billing, member & data deletion control |
| **Admin** | `admin@loop.demo` | `password123` | Team management, source config & feedback reprocessing |
| **Analyst** | `analyst@loop.demo` | `password123` | Feedback ingestion, analytics exploration, report creation |
| **Viewer** | `viewer@loop.demo` | `password123` | Read-only access to dashboards, feedback, and reports |

---

## Automated Verification Suite

Run type checking, unit tests, and production build:
```bash
npm run type-check
npm run test
npm run build
```

---

## 📁 Repository Documentation Map

- [`ARCHITECTURE.md`](file:///h:/zidio%20Web%20dev/ARCHITECTURE.md): Detailed system architecture, data flow, multi-tenancy, and security design.
- [`REQUIREMENTS_TRACEABILITY.md`](file:///h:/zidio%20Web%20dev/REQUIREMENTS_TRACEABILITY.md): Matrix mapping every Zidio requirement to its code implementation and test.
- [`DEMO_SCRIPT.md`](file:///h:/zidio%20Web%20dev/DEMO_SCRIPT.md): 5-7 minute evaluator demonstration walkthrough.
- [`CONTRIBUTING.md`](file:///h:/zidio%20Web%20dev/CONTRIBUTING.md): Git branch conventions and pull request workflows.
- [`SUBMISSION_CHECKLIST.md`](file:///h:/zidio%20Web%20dev/SUBMISSION_CHECKLIST.md): Project submission deliverables checklist.
