# PROJECT LOOP — AI Customer Feedback Intelligence Platform

> **Zidio Web Development Internship Team Project**  
> **Mentor**: Shaurya Pandey  
> **Repository**: [https://github.com/kantimohanthy/zidio-Web-dev](https://github.com/kantimohanthy/zidio-Web-dev)  
> **Live Production URL**: `[INSERT_YOUR_VERCEL_DEPLOYMENT_URL_HERE]` *(e.g. https://project-loop.vercel.app)*

PROJECT LOOP is a full-stack, multi-tenant B2B SaaS web application designed to collect, organize, analyze, search, and act on customer feedback across multiple ingestion channels. The platform transforms unstructured customer feedback into actionable business intelligence through automated sentiment classification, theme and topic extraction, emerging trend velocity detection, grounded AI question answering ("Ask LOOP"), executive analytics dashboards, and Voice-of-Customer (VoC) reporting.

---

## 🎯 Problem Solved & Key Features

Modern B2B software companies receive thousands of customer feedback entries across support tickets, NPS surveys, app reviews, and sales chats. Manually triaging this volume leads to delayed product decisions, missed churn risks, and unaddressed product friction. **PROJECT LOOP** solves this by providing:

- **Multi-Tenant SaaS Isolation**: Organization-scoped data isolation enforced via Supabase PostgreSQL Row-Level Security (RLS) policies.
- **Server-Side Role-Based Access Control (RBAC)**: Owner, Admin, Analyst, and Viewer roles with permission safeguards protecting owner roles and tenant data.
- **Multi-Channel Feedback Ingestion**: Manual entry form, CSV upload wizard (with header mapping, row validation, and progress reporting), and REST/Webhook ingestion API (`/api/ingest`).
- **Dual-Mode AI Analysis Engine**:
  1. *OpenAI LLM Mode*: Cloud provider completions when an `OPENAI_API_KEY` is configured.
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

## 🏛 System Architecture Summary

```
                  ┌─────────────────────────────────────────┐
                  │          Next.js 14 App Router          │
                  │   (Dashboard, Explorer, Q&A, Reports)  │
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────┐                             ┌───────────────────────┐
│  Auth & Org Context   │                             │   Feedback Ingestion  │
│ (RBAC: Owner/Admin/   │                             │  (CSV / API / Manual) │
│   Analyst/Viewer)     │                             └───────────┬───────────┘
└───────────┬───────────┘                                         │
            │                                                     │
            ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Dual-Mode Intelligence Engine                         │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │     OpenAI GPT-4o-mini API      │   │  Local Deterministic NLP Engine │  │
│  │     (Active if API Key set)     │   │   (Zero-dependency fallback)    │  │
│  └─────────────────────────────────┘   └─────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL Database / RLS                       │
│  Profiles | Organizations | Members | FeedbackItems | SentimentResults |     │
│  DetectedThemes | FeedbackSources | Reports | AuditLogs                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
project-loop/
├── .env.example                # Safe environment variable placeholders
├── .gitignore                  # Git ignore rules (protecting .env and build assets)
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and npm scripts
├── playwright.config.ts        # Playwright E2E testing configuration
├── vitest.config.ts            # Vitest unit testing configuration
├── ARCHITECTURE.md             # System architecture & RLS security documentation
├── DEMO_SCRIPT.md              # 3-5 minute evaluator walkthrough script
├── REQUIREMENTS_TRACEABILITY.md# Matrix mapping project requirements to code & tests
├── SUBMISSION_CHECKLIST.md     # Zidio internship deliverables checklist
├── scripts/
│   └── seed.ts                 # Database seed execution script
├── supabase/
│   ├── seed.sql                # SQL seed data for Supabase database
│   └── migrations/
│       └── 20260907000000_initial_schema.sql  # Full PostgreSQL schema with RLS
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/ingest/         # Webhook / REST API feedback ingestion endpoint
│   │   ├── dashboard/          # Analytics, Explorer, Q&A, Reports, Team, Sources
│   │   ├── login/              # Login interface & demo role switcher
│   │   └── signup/             # Multi-tenant organization registration
│   ├── components/             # Reusable UI components, charts, drawers, and modals
│   ├── context/                # AuthContext and OrgContext for RBAC & tenant state
│   └── lib/                    # Supabase client, AI providers, and permission utilities
└── tests/
    ├── unit/                   # Vitest unit tests (CSV, permissions, trend engine, Q&A)
    └── e2e/                    # Playwright end-to-end user journey tests
```

---

## ⚡ Quick Setup & Local Execution

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the placeholders in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=your-openai-api-key-here # Optional - falls back to local analyzer if omitted
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
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

The application includes a pre-seeded demo environment with 4 distinct user roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Owner** | `owner@loop.demo` | `password123` | Full org, billing, member & data deletion control |
| **Admin** | `admin@loop.demo` | `password123` | Team management, source config & feedback reprocessing |
| **Analyst** | `analyst@loop.demo` | `password123` | Feedback ingestion, analytics exploration, report creation |
| **Viewer** | `viewer@loop.demo` | `password123` | Read-only access to dashboards, feedback, and reports |

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Builds optimized production bundle (`15/15` routes verified) |
| `npm run start` | Runs production server after build |
| `npm run lint` | Runs Next.js ESLint check (`0` errors, `0` warnings) |
| `npm run type-check` | Runs TypeScript strict type check (`tsc --noEmit`) |
| `npm run test` | Runs Vitest unit test suite (`13/13` unit tests passed) |
| `npm run test:e2e` | Runs Playwright E2E test suite (`10/10` specs passed) |
| `npm run db:seed` | Runs mock database seed verification script |

---

## 🧪 Testing & Verification Summary

### 1. Code Quality & Type Checks
```bash
npm run lint          # Next.js ESLint check (0 errors, 0 warnings)
npm run type-check    # TypeScript strict check (0 errors)
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
```bash
npm run test:e2e:install   # Installs Playwright Chromium browser
npm run test:e2e -- --workers=1
```
* **Playwright Test Cases**: 10 test specs in `tests/e2e/user-journeys.spec.ts` (`10/10` passed).
* **User Journeys Verified**: 25 distinct interactions covering landing page, login/signup, executive dashboard, feedback explorer with filters, CSV upload modal, analytics trends, Ask LOOP Q&A, VoC report print view, feedback sources, RBAC team management, and settings.

---

## 🔒 Security & Multi-Tenant Data Protection

- **Zero Committed Secrets**: `.gitignore` strictly excludes `.env` and `.env*.local` files. All sample keys in `.env.example` use non-functional placeholders.
- **Tenant Isolation**: Database schema enforces `organization_id` on all feedback and analytics tables, secured by Supabase Row-Level Security (RLS) policies.
- **Server-Side Permission Validation**: Critical operations (member role updates, member removal, source deletion) require `owner` or `admin` role checks in [permissions.ts](file:///h:/zidio%20Web%20dev/src/lib/utils/permissions.ts).

---

## 🌐 Deployment Section

### Host Configuration (Vercel)
- **Framework Preset**: Next.js
- **Node.js Version**: 18.x or 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

**Public Live Deployment Link**: `[INSERT_YOUR_VERCEL_DEPLOYMENT_URL_HERE]`

---

## 📸 Screenshots Section

*(Place screenshot files inside `docs/screenshots/` directory for project report inclusion)*

1. `docs/screenshots/01-executive-dashboard.png` — Executive KPI metrics, sentiment chart, and urgent feedback feed.
2. `docs/screenshots/02-feedback-explorer.png` — Feedback explorer table with search, filters, and feedback detail drawer.
3. `docs/screenshots/03-csv-import-modal.png` — Multi-step CSV ingestion wizard with header mapping.
4. `docs/screenshots/04-analytics-emerging-trends.png` — Sentiment breakdown, theme distribution, and emerging trends.
5. `docs/screenshots/05-ask-loop-qa.png` — Grounded AI Q&A interface with feedback citations.
6. `docs/screenshots/06-voc-report-print.png` — Voice-of-Customer report and clean print preview.

---

## ⚙️ Known Limitations & Fallback Behavior

- **Offline / Standalone Mode**: When `NEXT_PUBLIC_DEMO_MODE=true` or Supabase credentials are not connected, the platform operates seamlessly using a local deterministic NLP analyzer and mock dataset containing 105+ pre-seeded realistic feedback items across 4 sources and 7 themes.
- **OpenAI API Fallback**: If `OPENAI_API_KEY` is omitted, sentiment scoring, theme detection, and Ask LOOP Q&A automatically use the local rule-based NLP provider without breaking.

