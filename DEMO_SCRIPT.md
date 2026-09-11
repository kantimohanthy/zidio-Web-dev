# DEMO_SCRIPT.md — PROJECT LOOP Evaluator Walkthrough (5-7 Minutes)

This demonstration guide provides evaluators with a step-by-step path to test every feature of PROJECT LOOP.

---

## ⏱ 5-7 Minute Demonstration Path

### Minute 1: Public Landing Page & 1-Click Role Login
1. Open `http://localhost:3000`. Observe the B2B product page, feature highlights, and interactive demo entry launcher.
2. Click **"1-Click Evaluator Logins"** or choose **Owner Role Login (`owner@loop.demo`)**.
3. Observe instant redirection to `/dashboard` with 100+ pre-seeded realistic customer feedback records already loaded across multiple channels and dates.

### Minute 2: Executive Overview Dashboard
1. Review the Top Metric Cards: Total Feedback (105), CSAT Rating, Positive Sentiment Share (54%), Urgent & Churn Risks.
2. Inspect the **Sentiment Velocity Over Time** interactive area chart and **Feedback Channels** pie chart.
3. Check the **Top Recurring Themes** bar chart and **Urgent Escalations & Churn Risks** widget.
4. Test the global segment filter dropdown at the top right (switch from *All Segments* to *Enterprise*).

### Minute 3: Feedback Explorer & Ingestion
1. Navigate to **Feedback** in the sidebar.
2. Test search: Type `billing` into the search bar. Observe live filtering.
3. Test filters: Set Sentiment to `Negative` and Urgency to `Critical`.
4. Click any feedback row (e.g. Marcus Vance - Double Billed). Observe the **Feedback Detail Drawer** opening on the right.
5. Contrast the **Original Customer Feedback** text with the **AI Derived Intelligence** (Sentiment score, Urgency level, Churn risk flag, Executive summary, and Recommended action).
6. Click **"Reprocess Analysis"** to verify processing functionality.
7. Click **"CSV Import"** at the top right to test the 4-step CSV Ingestion Wizard.

### Minute 4: Advanced Intelligence & Emerging Trends
1. Navigate to **Analytics** in the sidebar.
2. Review the **Emerging Trends Engine**: Observe themes classified into *Emerging*, *Stable*, and *Declining*.
3. Read the **Explainable Trend Calculation** box detailing the mathematical growth rate and negative concentration.
4. Inspect the **Representative Customer Evidence** cards attached to each trend.

### Minute 5: Ask LOOP (Grounded AI Q&A)
1. Navigate to **Ask LOOP** in the sidebar.
2. Click one of the suggested prompts: *"What are customers complaining about this month?"* or type your own question.
3. Observe the AI synthesis response grounded strictly in database records.
4. Click any **Grounded Evidence Citation** card (e.g., `#Citation-fb_1`) to open the exact feedback record drawer.

### Minute 6: Voice of Customer Reports & PDF Printing
1. Navigate to **Reports** in the sidebar.
2. Click **"View"** on *Q3 2026 Voice of Customer Intelligence Report*.
3. Review the Executive Summary, Emerging Risks, Actionable Recommendations, and Customer Quotes.
4. Click **"Print / Export PDF"**. Observe the clean printable layout (`/dashboard/reports/[id]/print`) and automatic print window.

### Minute 7: Administration, Team Roles & Settings
1. Navigate to **Team** in the sidebar. Observe role controls and the Shareable Workspace Invitation Link.
2. Use the top Header dropdown **"Demo Role"** to switch instantly to **Viewer Role (`viewer@loop.demo`)**.
3. Notice that administrative buttons (CSV Import, Add Source, Role Modifiers) are hidden or restricted server-side for Viewer role.
4. Navigate to **Settings** to view the AI Pipeline Mode selector (Local Engine vs OpenAI API Key mode) and the **Organization Audit Log History**.
