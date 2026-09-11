import { describe, it, expect } from 'vitest';
import { analyzeLocally } from '@/lib/ai/providers/local-fallback';

describe('Local Deterministic AI Analyzer', () => {
  it('classifies positive praise accurately with positive sentiment score >= 0.6', () => {
    const text = 'PROJECT LOOP is an amazing, fantastic tool! The UI is easy, fast, and helpful.';
    const result = analyzeLocally(text, 5);

    expect(result.sentiment).toBe('positive');
    expect(result.score).toBeGreaterThanOrEqual(0.6);
    expect(result.urgency).toBe('low');
    expect(result.churn_risk).toBe(false);
  });

  it('classifies critical billing complaints and flags churn risk', () => {
    const text = 'Cannot login to application! Double billed on Enterprise subscription and refund was refused. We are cancelling!';
    const result = analyzeLocally(text, 1);

    expect(result.sentiment).toBe('negative');
    expect(result.urgency).toBe('critical');
    expect(result.churn_risk).toBe(true);
    expect(result.themes).toContain('Billing & Pricing');
  });

  it('detects Application Performance theme for latency feedback', () => {
    const text = 'The dashboard analytics charts are extremely slow and lagging during peak hours.';
    const result = analyzeLocally(text, 2);

    expect(result.themes).toContain('Application Performance');
  });
});
