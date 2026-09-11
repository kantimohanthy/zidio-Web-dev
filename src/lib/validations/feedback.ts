import { z } from 'zod';

export const feedbackItemSchema = z.object({
  feedback_text: z.string().min(3, 'Feedback text must be at least 3 characters long'),
  customer_name: z.string().optional(),
  customer_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  customer_segment: z.enum(['enterprise', 'pro', 'smb', 'free']).optional(),
  source_id: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  product_category: z.string().optional(),
  country: z.string().optional(),
  created_at: z.string().optional(),
});

export const feedbackAnalysisResultSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  score: z.number().min(0).max(1),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  churn_risk: z.boolean(),
  summary: z.string(),
  suggested_action: z.string(),
  themes: z.array(z.string()),
});

export type FeedbackItemInput = z.infer<typeof feedbackItemSchema>;
export type FeedbackAnalysisResultInput = z.infer<typeof feedbackAnalysisResultSchema>;
