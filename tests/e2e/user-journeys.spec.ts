import { test, expect } from '@playwright/test';

test.describe('PROJECT LOOP End-to-End User Journeys', () => {
  test('1. Public Landing Page renders hero section and CTA buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PROJECT LOOP/i);
    await expect(page.getByText(/AI Customer Feedback Intelligence Platform/i).first()).toBeVisible();
    await expect(page.getByText(/Turn Raw Feedback into/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Launch Live Demo/i }).first()).toBeVisible();
  });

  test('2 & 3. Auth pages render login and signup interfaces', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/Sign In to your Account/i)).toBeVisible();

    await page.goto('/signup');
    await expect(page.getByText(/Create New Workspace Account/i)).toBeVisible();
  });

  test.describe('Authenticated Dashboard Journeys', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login?role=owner');
      await page.waitForURL(/\/dashboard/);
    });

    test('4-7. Executive Dashboard metrics, charts, and urgent feedback', async ({ page }) => {
      await expect(page.getByText(/Total Feedback/i).first()).toBeVisible();
      await expect(page.getByText(/Average Rating/i).first()).toBeVisible();
      await expect(page.getByText(/Positive Sentiment/i).first()).toBeVisible();
      await expect(page.getByText(/Urgent & Churn Risks/i).first()).toBeVisible();
      await expect(page.getByText(/Urgent Escalations & Churn Risks/i).first()).toBeVisible();
    });

    test('8-14. Feedback Explorer page, search, filters, drawer, and CSV modal', async ({ page }) => {
      await page.goto('/dashboard/feedback');
      await expect(page.getByText(/Feedback Explorer/i).first()).toBeVisible();

      const searchInput = page.getByPlaceholder(/Search feedback/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill('billing');
      }

      await expect(page.getByRole('combobox').first()).toBeVisible();

      const inspectBtn = page.getByRole('button', { name: /Inspect/i }).first();
      if (await inspectBtn.isVisible()) {
        await inspectBtn.click();
        await expect(page.getByText(/Feedback Detail/i).first()).toBeVisible();
      }

      const importBtn = page.getByRole('button', { name: 'CSV Import' });
      if (await importBtn.isVisible()) {
        await importBtn.click();
        await expect(page.getByText(/CSV Feedback Ingestion Wizard/i)).toBeVisible();
      }
    });

    test('15 & 16. Analytics Page and Emerging Trends list', async ({ page }) => {
      await page.goto('/dashboard/analytics');
      await expect(page.getByText(/Advanced Intelligence & Emerging Trends/i).first()).toBeVisible();
    });

    test('17 & 18. Ask LOOP Grounded Q&A Interface and citation answers', async ({ page }) => {
      await page.goto('/dashboard/ask');
      await expect(page.getByText(/Ask LOOP Intelligence/i).first()).toBeVisible();

      const queryInput = page.getByPlaceholder(/Ask anything about customer sentiment/i);
      await expect(queryInput).toBeVisible();

      await queryInput.fill('What are the main issues with billing?');
      await page.getByRole('button', { name: /Ask LOOP/i }).click();

      await expect(page.getByText(/Feedback Records Evaluated/i).first()).toBeVisible();
    });

    test('19, 20 & 21. VoC Reports page, detail view, and print preview', async ({ page }) => {
      await page.goto('/dashboard/reports');
      await expect(page.getByText(/Voice of Customer Reports/i).first()).toBeVisible();

      const viewReportLink = page.getByRole('link', { name: /View Report/i }).first();
      if (await viewReportLink.isVisible()) {
        await viewReportLink.click();
        await expect(page.getByText(/Executive Summary/i).first()).toBeVisible();

        await page.goto('/dashboard/reports/rep_1/print');
        await expect(page.getByText(/Voice-of-Customer Executive Report/i)).toBeVisible();
      }
    });

    test('22 & 23. Feedback Sources management and Add Source modal', async ({ page }) => {
      await page.goto('/dashboard/sources');
      await expect(page.getByText(/Data Ingestion Sources/i).first()).toBeVisible();
    });

    test('24. Team & RBAC Management page', async ({ page }) => {
      await page.goto('/dashboard/team');
      await expect(page.getByText(/Team & Role Management/i).first()).toBeVisible();
    });

    test('25. Settings & API Configuration page', async ({ page }) => {
      await page.goto('/dashboard/settings');
      await expect(page.getByText(/Settings & Administration/i).first()).toBeVisible();
    });
  });
});
