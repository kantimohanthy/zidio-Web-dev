import { describe, it, expect } from 'vitest';
import { answerFeedbackQuestion } from '@/lib/ai/ask-loop';
import { DEMO_FEEDBACK_ITEMS } from '@/lib/utils/mock-db';

describe('Ask LOOP Grounded Q&A Engine', () => {
  it('answers billing questions with grounded evidence citations', () => {
    const result = answerFeedbackQuestion('What are customers saying about billing?', DEMO_FEEDBACK_ITEMS);

    expect(result.hasSufficientEvidence).toBe(true);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.answer).toContain('matching feedback records');
  });

  it('handles queries with no matching evidence gracefully', () => {
    const result = answerFeedbackQuestion('xyz non-existent quantum teleportation issue', DEMO_FEEDBACK_ITEMS);

    expect(result.hasSufficientEvidence).toBe(false);
    expect(result.citations.length).toBe(0);
    expect(result.answer).toContain('could not find sufficient matching records');
  });
});
