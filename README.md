# PROJECT LOOP — AI Customer Feedback Intelligence Platform

> **Zidio Web Development Internship Team Project**  
> **Mentor**: Shaurya Pandey  
> **Repository**: [https://github.com/kantimohanthy/zidio-Web-dev](https://github.com/kantimohanthy/zidio-Web-dev)

PROJECT LOOP is a full-stack, multi-tenant B2B SaaS web application designed to collect, organize, analyze, search, and act on customer feedback across multiple ingestion channels. The platform transforms unstructured customer feedback into actionable business intelligence through automated sentiment classification, theme and topic extraction, emerging trend velocity detection, grounded AI question answering ("Ask LOOP"), executive analytics dashboards, and Voice-of-Customer (VoC) reporting.

---

## Key Features

- **Multi-Tenant SaaS Security**: Organization-scoped data isolation enforced via Supabase PostgreSQL Row-Level Security (RLS) policies.
- **Server-Side Role-Based Access Control (RBAC)**: Owner, Admin, Analyst, and Viewer roles with permission safeguards protecting owner roles and tenant data.
- **Multi-Channel Feedback Ingestion**: Manual entry form, CSV upload wizard (with header mapping, row validation, and progress reporting), and REST/Webhook ingestion API.
- **Dual-Mode AI Analysis Engine**:
  1. *OpenAI LLM Mode*: Cloud provider completions when an API key is configured.
  2. *Local Fallback Mode*: Deterministic, zero-dependency NLP lexicon and rule-based analyzer when no API key is set.
- **Explainable Emerging Trend Engine**: Window-over-window comparison math, growth rates, negative sentiment concentration, and representative customer evidence citations.
- **Ask LOOP (Grounded AI Q&A)**: Grounded natural language query engine backed by PostgreSQL text search and verifiable customer evidence citations.
- **Voice-of-Customer (VoC) Reports**: Multi-section report generator, date/segment scope, printable PDF view (`/dashboard/reports/[id]/print`).
- **1-Click Evaluator Demo Access**: Pre-seeded demo credentials and role switcher allowing evaluators to test all 4 roles instantly.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14+ (App Router), TypeScript (Strict Mode), React 18
- **Styling & UI**: Tailwind CSS, Lucide Icons
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

Set the placeholders in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key # Optional - falls back to local analyzer if omitted
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Run Database Seed Verification
```bash
npm run db:seed
```

### 4. Start Local Development Server
```bash
npm run dev
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

## 🧪 Verification & Automated Testing Suite

### 1. Code Quality & Type Checks
```bash
npm run lint          # Next.js ESLint check (0 errors, 0 warnings)
npm run type-check    # TypeScript strict type check (0 errors)
```

### 2. Unit & Integration Tests (Vitest)
```bash
npm run test          # Vitest test suite (6 test files, 13 unit tests passed)
```

### 3. Production Build Validation
```bash
npm run build         # Next.js 14 production build (15/15 routes generated)
```

### 4. End-to-End User Journey Tests (Playwright)
Install the Chromium browser executable first:
```bash
npm run test:e2e:install  # Installs Playwright Chromium browser
# or
npx playwright install chromium
```

Run the Playwright E2E suite:
```bash
npm run test:e2e -- --workers=1
```
* **Playwright Test Cases**: 10 test specs in `tests/e2e/user-journeys.spec.ts` (10/10 passed).
* **User Behaviors Covered**: 25 distinct interactions verified across public landing, auth, executive dashboard, feedback explorer, CSV upload wizard, analytics trends, Ask LOOP Q&A, VoC report print preview, ingestion sources, RBAC team management, and settings.

---

## 📁 Repository Documentation Map

- [`ARCHITECTURE.md`](file:///h:/zidio%20Web%20dev/ARCHITECTURE.md): System architecture, data flow, multi-tenancy, and security design.
- [`REQUIREMENTS_TRACEABILITY.md`](file:///h:/zidio%20Web%20dev/REQUIREMENTS_TRACEABILITY.md): Matrix mapping requirements to code implementation and test verification.
- [`DEMO_SCRIPT.md`](file:///h:/zidio%20Web%20dev/DEMO_SCRIPT.md): 5-7 minute evaluator demonstration walkthrough.
- [`CONTRIBUTING.md`](file:///h:/zidio%20Web%20dev/CONTRIBUTING.md): Git branch conventions and pull request workflows.
- [`SUBMISSION_CHECKLIST.md`](file:///h:/zidio%20Web%20dev/SUBMISSION_CHECKLIST.md): Project submission deliverables checklist.
