import { describe, it, expect } from 'vitest';
import { computeEmergingTrends } from '@/lib/ai/trend-engine';
import { FeedbackItem } from '@/lib/supabase/types';

describe('Emerging Trend Engine', () => {
  it('correctly identifies an emerging trend when theme volume grows by >= 25%', () => {
    const currentPeriod: FeedbackItem[] = Array(10).fill(null).map((_, i) => ({
      id: `curr_${i}`,
      organization_id: 'org_1',
      source_id: 'src_1',
      feedback_text: 'Dashboard is very slow',
      status: 'new',
      created_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
      themes: [{ id: 't1', organization_id: 'org_1', name: 'Application Performance', category: 'Technical', created_at: '' }],
      sentiment_result: { id: `s_${i}`, organization_id: 'org_1', feedback_id: `curr_${i}`, sentiment: 'negative', score: 0.2, urgency: 'high', churn_risk: false, summary: '', suggested_action: '', model_version: '', processed_at: '' }
    }));

    const previousPeriod: FeedbackItem[] = Array(2).fill(null).map((_, i) => ({
      id: `prev_${i}`,
      organization_id: 'org_1',
      source_id: 'src_1',
      feedback_text: 'Dashboard slow',
      status: 'new',
      created_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
      themes: [{ id: 't1', organization_id: 'org_1', name: 'Application Performance', category: 'Technical', created_at: '' }]
    }));

    const trends = computeEmergingTrends(currentPeriod, previousPeriod, 3);
    const perfTrend = trends.find(t => t.themeName === 'Application Performance');

    expect(perfTrend).toBeDefined();
    expect(perfTrend?.status).toBe('emerging');
    expect(perfTrend?.growthRate).toBe(400); // (10-2)/2 * 100 = 400%
    expect(perfTrend?.isStatisticallySignificant).toBe(true);
  });

  it('handles zero-period previous volume safely without Infinity or NaN', () => {
    const currentPeriod: FeedbackItem[] = Array(5).fill(null).map((_, i) => ({
      id: `curr_${i}`,
      organization_id: 'org_1',
      source_id: 'src_1',
      feedback_text: 'New security concern',
      status: 'new',
      created_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
      themes: [{ id: 't2', organization_id: 'org_1', name: 'Security & Auth', category: 'Security', created_at: '' }],
    }));

    const previousPeriod: FeedbackItem[] = [];

    const trends = computeEmergingTrends(currentPeriod, previousPeriod, 3);
    const secTrend = trends.find(t => t.themeName === 'Security & Auth');

    expect(secTrend).toBeDefined();
    expect(Number.isFinite(secTrend?.growthRate)).toBe(true);
    expect(secTrend?.growthRate).toBe(100); // 100% baseline when previous is 0
  });
});
