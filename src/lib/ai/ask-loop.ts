import { FeedbackItem } from '../supabase/types';

export interface GroundedCitation {
  feedbackId: string;
  customerName?: string;
  customerSegment?: string;
  sentiment?: string;
  rating?: number;
  snippet: string;
  createdAt: string;
}

export interface AskLoopResult {
  question: string;
  answer: string;
  hasSufficientEvidence: boolean;
  citations: GroundedCitation[];
  totalMatchesEvaluated: number;
  suggestedFollowUps: string[];
}

const INTENT_WORDS = ['complain', 'complaints', 'issue', 'issues', 'negative', 'problem', 'problems', 'bad', 'bug', 'bugs', 'feedback', 'say', 'saying', 'what', 'why', 'which'];

export function answerFeedbackQuestion(
  question: string,
  feedbackItems: FeedbackItem[],
  apiKey?: string
): AskLoopResult {
  const queryLower = question.toLowerCase();
  const rawWords = queryLower.split(/\W+/).filter(w => w.length > 2);
  // Separate topic keywords from generic query intent words
  const topicKeywords = rawWords.filter(w => !INTENT_WORDS.includes(w));

  // 1. Score & Rank matching feedback items
  const scoredItems = feedbackItems.map(item => {
    const textLower = item.feedback_text.toLowerCase();
    let topicScore = 0;

    for (const kw of topicKeywords) {
      if (textLower.includes(kw)) topicScore += 5;
    }

    // Boost based on themes
    if (item.themes) {
      for (const t of item.themes) {
        if (queryLower.includes(t.name.toLowerCase())) topicScore += 5;
      }
    }

    // Only apply intent boost if topic keywords matched or query was specifically about general themes
    let score = topicScore;
    if (topicScore > 0 || topicKeywords.length === 0) {
      if ((queryLower.includes('complain') || queryLower.includes('issue') || queryLower.includes('negative')) && item.sentiment_result?.sentiment === 'negative') {
        score += 3;
      }
    }

    return { item, score };
  });

  const matchingItems = scoredItems
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Check for insufficient evidence
  if (matchingItems.length === 0 || (topicKeywords.length > 0 && matchingItems.every(x => x.score < 5))) {
    return {
      question,
      answer: "I searched all stored customer feedback for your organization, but could not find sufficient matching records to answer this query. Try broadening your question or ingesting more feedback from additional channels.",
      hasSufficientEvidence: false,
      citations: [],
      totalMatchesEvaluated: 0,
      suggestedFollowUps: [
        "What are top customer complaints overall?",
        "What do enterprise customers say about performance?",
        "Summarize recent billing feedback."
      ]
    };
  }

  // 2. Select top supporting citations (up to 5)
  const topMatches = matchingItems.slice(0, 5);
  const citations: GroundedCitation[] = topMatches.map(({ item }) => {
    const text = item.feedback_text;
    const snippet = text.length > 180 ? `${text.substring(0, 177)}...` : text;
    return {
      feedbackId: item.id,
      customerName: item.customer_name || 'Anonymous Customer',
      customerSegment: item.customer_segment || 'SMB',
      sentiment: item.sentiment_result?.sentiment || 'neutral',
      rating: item.rating,
      snippet,
      createdAt: item.created_at,
    };
  });

  // 3. Synthesize grounded answer
  const negativeCount = topMatches.filter(m => m.item.sentiment_result?.sentiment === 'negative').length;
  const positiveCount = topMatches.filter(m => m.item.sentiment_result?.sentiment === 'positive').length;

  const topThemes = Array.from(new Set(
    topMatches.flatMap(m => (m.item.themes || []).map(t => t.name))
  ));

  let answerHeader = `Based on an analysis of **${matchingItems.length} matching feedback records** across your organization:\n\n`;

  let keyFindings = `### Key Findings\n`;
  if (negativeCount > positiveCount) {
    keyFindings += `- **Sentiment Trend**: The majority of related feedback (${negativeCount} out of ${topMatches.length} top cited items) expresses negative sentiment.\n`;
  } else if (positiveCount > negativeCount) {
    keyFindings += `- **Sentiment Trend**: The majority of related feedback (${positiveCount} out of ${topMatches.length} top cited items) expresses positive sentiment.\n`;
  } else {
    keyFindings += `- **Sentiment Trend**: Related feedback displays a mixed distribution of positive and negative sentiment.\n`;
  }

  if (topThemes.length > 0) {
    keyFindings += `- **Primary Topics**: Common themes identified include **${topThemes.join(', ')}**.\n`;
  }

  keyFindings += `\n### Synthesized Executive Summary\n`;

  const summaryBullets = topMatches.map(m => {
    const seg = m.item.customer_segment ? `[${m.item.customer_segment.toUpperCase()}] ` : '';
    const ratingStr = m.item.rating ? ` (${m.item.rating}/5 stars)` : '';
    return `- ${seg}*${m.item.customer_name || 'Customer'}*: "${m.item.feedback_text}"${ratingStr}`;
  }).join('\n');

  keyFindings += `${summaryBullets}\n\n`;
  keyFindings += `> *Note: Every statement above is grounded in verified customer feedback records linked in the citations below.*`;

  return {
    question,
    answer: `${answerHeader}${keyFindings}`,
    hasSufficientEvidence: true,
    citations,
    totalMatchesEvaluated: matchingItems.length,
    suggestedFollowUps: [
      "Which specific product issue should we prioritize first?",
      "What solutions do customers request for these complaints?",
      "How does enterprise sentiment compare to SMB customers?"
    ]
  };
}
