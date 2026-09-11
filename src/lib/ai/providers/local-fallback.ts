import { SentimentType, UrgencyLevel } from '../../supabase/types';
import { FeedbackAnalysisResultInput } from '../../validations/feedback';

const POSITIVE_WORDS = [
  'great', 'excellent', 'love', 'awesome', 'fantastic', 'amazing', 'good', 'superb',
  'best', 'easy', 'helpful', 'wonderful', 'perfect', 'brilliant', 'intuitive', 'fast',
  'delighted', 'smooth', 'valuable', 'recommend', 'flawless', 'happy', 'impressive'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'horrible', 'awful', 'hate', 'slow', 'broken', 'bug', 'crash',
  'error', 'worst', 'difficult', 'confusing', 'unusable', 'frustrating', 'expensive',
  'overpriced', 'fail', 'failed', 'issue', 'problem', 'refund', 'cancel', 'cannot', 'cant',
  'disappointed', 'useless', 'glitch', 'stuck', 'annoying', 'complaint'
];

const THEME_RULES: Record<string, { category: string; keywords: string[] }> = {
  'Billing & Pricing': {
    category: 'Finance',
    keywords: ['billing', 'invoice', 'charge', 'price', 'pricing', 'cost', 'expensive', 'refund', 'subscription', 'credit card', 'payment', 'plan']
  },
  'Application Performance': {
    category: 'Technical',
    keywords: ['slow', 'lag', 'speed', 'latency', 'load time', 'timeout', 'freeze', 'performance', 'hang', 'memory', 'cpu']
  },
  'Bugs & Stability': {
    category: 'Technical',
    keywords: ['bug', 'crash', 'error', 'broken', 'glitch', 'fail', 'failed', 'issue', 'exception', 'stack trace', '404', '500']
  },
  'User Experience & UI': {
    category: 'Design',
    keywords: ['ui', 'ux', 'interface', 'confusing', 'navigation', 'design', 'layout', 'dashboard', 'button', 'menu', 'workflow', 'cluttered', 'intuitive']
  },
  'Customer Support': {
    category: 'Service',
    keywords: ['support', 'agent', 'helpdesk', 'ticket', 'response time', 'representative', 'chat', 'documentation', 'docs', 'service', 'helpful']
  },
  'Mobile App': {
    category: 'Product',
    keywords: ['mobile', 'ios', 'android', 'phone', 'tablet', 'app store', 'push notification', 'touch screen']
  },
  'Integrations & API': {
    category: 'Product',
    keywords: ['api', 'webhook', 'integration', 'zapier', 'slack', 'connect', 'export', 'import', 'sync', 'token', 'oauth']
  },
  'Onboarding & Setup': {
    category: 'Growth',
    keywords: ['onboarding', 'setup', 'getting started', 'tutorial', 'welcome', 'sign up', 'registration', 'first step', 'learning curve']
  }
};

const CRITICAL_KEYWORDS = ['cannot login', 'data loss', 'security vulnerability', 'billing fraud', 'unauthorized charge', 'system down', 'app crash', 'production outage', 'urgent refund'];
const HIGH_KEYWORDS = ['broken feature', 'cannot export', 'payment failed', 'frequent crash', 'cancel subscription', 'extremely slow', 'useless update'];

export function analyzeLocally(feedbackText: string, rating?: number): FeedbackAnalysisResultInput {
  const textLower = feedbackText.toLowerCase();
  const words = textLower.split(/\W+/).filter(Boolean);

  // 1. Calculate Sentiment Score
  let posCount = 0;
  let negCount = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) posCount++;
    if (NEGATIVE_WORDS.includes(word)) negCount++;
  }

  // Factor rating into sentiment score if provided
  let sentimentScore = 0.5; // Neutral default
  if (rating !== undefined && rating > 0) {
    if (rating >= 4) posCount += rating - 2;
    else if (rating <= 2) negCount += (4 - rating);
  }

  const totalHits = posCount + negCount;
  if (totalHits > 0) {
    sentimentScore = posCount / totalHits;
  } else if (rating) {
    sentimentScore = (rating - 1) / 4;
  }

  let sentiment: SentimentType = 'neutral';
  if (sentimentScore >= 0.6) sentiment = 'positive';
  else if (sentimentScore <= 0.4) sentiment = 'negative';

  // 2. Detect Themes
  const themes: string[] = [];
  for (const [themeName, rule] of Object.entries(THEME_RULES)) {
    const matched = rule.keywords.some(kw => textLower.includes(kw));
    if (matched) {
      themes.push(themeName);
    }
  }
  if (themes.length === 0) {
    themes.push('General Feedback');
  }

  // 3. Determine Urgency & Churn Risk
  let urgency: UrgencyLevel = 'low';
  let churnRisk = false;

  const isCritical = CRITICAL_KEYWORDS.some(kw => textLower.includes(kw));
  const isHigh = HIGH_KEYWORDS.some(kw => textLower.includes(kw));

  if (isCritical || (sentiment === 'negative' && rating === 1)) {
    urgency = 'critical';
    churnRisk = true;
  } else if (isHigh || (sentiment === 'negative' && rating === 2)) {
    urgency = 'high';
    churnRisk = textLower.includes('cancel') || textLower.includes('leaving') || textLower.includes('switch');
  } else if (sentiment === 'negative') {
    urgency = 'medium';
    churnRisk = textLower.includes('cancel');
  }

  // 4. Generate Summary
  const textClean = feedbackText.trim();
  const firstSentence = textClean.split(/(?<=[.!?])\s+/)[0] || textClean;
  const summary = firstSentence.length > 120 ? `${firstSentence.substring(0, 117)}...` : firstSentence;

  // 5. Generate Actionable Recommendation
  let suggestedAction = 'Review customer feedback and flag for product triage.';
  if (sentiment === 'negative') {
    if (themes.includes('Billing & Pricing')) {
      suggestedAction = 'Route to Billing Support and offer a credit or review invoice discrepancy.';
    } else if (themes.includes('Bugs & Stability') || themes.includes('Application Performance')) {
      suggestedAction = 'Escalate to Engineering as a high-priority stability issue.';
    } else if (themes.includes('User Experience & UI')) {
      suggestedAction = 'Log for UX team to review workflow friction and interface clarity.';
    } else {
      suggestedAction = 'Reach out directly to customer to resolve complaint and mitigate churn.';
    }
  } else if (sentiment === 'positive') {
    suggestedAction = 'Tag as testimonial candidate and consider requesting a review or referral.';
  }

  return {
    sentiment,
    score: Math.round(sentimentScore * 100) / 100,
    urgency,
    churn_risk: churnRisk,
    summary,
    suggested_action: suggestedAction,
    themes,
  };
}
