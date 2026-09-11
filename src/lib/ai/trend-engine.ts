import { FeedbackItem } from '../supabase/types';

export interface TrendAnalysisResult {
  themeName: string;
  category: string;
  currentCount: number;
  previousCount: number;
  currentShare: number; // 0 to 100%
  previousShare: number; // 0 to 100%
  growthRate: number; // percentage change
  negativeSentimentCount: number;
  negativeConcentration: number; // 0 to 100%
  status: 'emerging' | 'declining' | 'stable';
  isStatisticallySignificant: boolean;
  explanation: string;
  supportingFeedback: Array<{
    id: string;
    text: string;
    rating?: number;
    sentiment?: string;
    customerName?: string;
    customerSegment?: string;
    createdAt: string;
  }>;
}

export function computeEmergingTrends(
  currentPeriodItems: FeedbackItem[],
  previousPeriodItems: FeedbackItem[],
  minSampleThreshold: number = 3
): TrendAnalysisResult[] {
  const currentTotal = currentPeriodItems.length;
  const previousTotal = previousPeriodItems.length;

  if (currentTotal === 0) {
    return [];
  }

  // 1. Group items by theme in current and previous periods
  const currentThemeMap = new Map<string, FeedbackItem[]>();
  const previousThemeMap = new Map<string, FeedbackItem[]>();

  for (const item of currentPeriodItems) {
    const themes = item.themes && item.themes.length > 0
      ? item.themes.map(t => t.name)
      : ['General Feedback'];

    for (const theme of themes) {
      if (!currentThemeMap.has(theme)) currentThemeMap.set(theme, []);
      currentThemeMap.get(theme)!.push(item);
    }
  }

  for (const item of previousPeriodItems) {
    const themes = item.themes && item.themes.length > 0
      ? item.themes.map(t => t.name)
      : ['General Feedback'];

    for (const theme of themes) {
      if (!previousThemeMap.has(theme)) previousThemeMap.set(theme, []);
      previousThemeMap.get(theme)!.push(item);
    }
  }

  // Get all unique theme names
  const allThemes = Array.from(new Set([...currentThemeMap.keys(), ...previousThemeMap.keys()]));
  const results: TrendAnalysisResult[] = [];

  for (const themeName of allThemes) {
    const currentItems = currentThemeMap.get(themeName) || [];
    const previousItems = previousThemeMap.get(themeName) || [];

    const currentCount = currentItems.length;
    const previousCount = previousItems.length;

    const currentShare = currentTotal > 0 ? (currentCount / currentTotal) * 100 : 0;
    const previousShare = previousTotal > 0 ? (previousCount / previousTotal) * 100 : 0;

    // Calculate growth rate
    let growthRate = 0;
    if (previousCount === 0) {
      growthRate = currentCount > 0 ? 100 : 0;
    } else {
      growthRate = ((currentCount - previousCount) / previousCount) * 100;
    }

    // Negative sentiment concentration in current period
    const negItems = currentItems.filter(
      item => item.sentiment_result?.sentiment === 'negative'
    );
    const negativeSentimentCount = negItems.length;
    const negativeConcentration = currentCount > 0 ? (negativeSentimentCount / currentCount) * 100 : 0;

    // Minimum sample check for statistical confidence
    const isStatisticallySignificant = currentCount >= minSampleThreshold || previousCount >= minSampleThreshold;

    let status: 'emerging' | 'declining' | 'stable' = 'stable';
    if (isStatisticallySignificant) {
      if (growthRate >= 25 || (previousCount === 0 && currentCount >= minSampleThreshold)) {
        status = 'emerging';
      } else if (growthRate <= -25) {
        status = 'declining';
      }
    }

    let category = 'General';
    if (currentItems[0]?.themes?.[0]?.category) {
      category = currentItems[0].themes[0].category;
    }

    // Prepare evidence citations (up to 3 representative items)
    const sortedEvidence = [...currentItems].sort((a, b) => {
      // Prioritize negative & critical items for evidence
      const scoreA = a.sentiment_result?.sentiment === 'negative' ? 2 : 1;
      const scoreB = b.sentiment_result?.sentiment === 'negative' ? 2 : 1;
      return scoreB - scoreA;
    });

    const supportingFeedback = sortedEvidence.slice(0, 3).map(item => ({
      id: item.id,
      text: item.feedback_text,
      rating: item.rating,
      sentiment: item.sentiment_result?.sentiment,
      customerName: item.customer_name || 'Anonymous Customer',
      customerSegment: item.customer_segment,
      createdAt: item.created_at,
    }));

    let explanation = '';
    if (!isStatisticallySignificant) {
      explanation = `Sample size (${currentCount} current, ${previousCount} previous) is below the statistical confidence threshold of ${minSampleThreshold} items. Trend direction is preliminary.`;
    } else if (status === 'emerging') {
      explanation = `Theme volume grew by +${growthRate.toFixed(1)}% (${previousCount} -> ${currentCount} items). Negative sentiment concentration is ${negativeConcentration.toFixed(1)}%.`;
    } else if (status === 'declining') {
      explanation = `Theme volume decreased by ${growthRate.toFixed(1)}% (${previousCount} -> ${currentCount} items). Share of feedback fell from ${previousShare.toFixed(1)}% to ${currentShare.toFixed(1)}%.`;
    } else {
      explanation = `Theme volume remained stable (${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}% change). Share of feedback is ${currentShare.toFixed(1)}%.`;
    }

    results.push({
      themeName,
      category,
      currentCount,
      previousCount,
      currentShare: Math.round(currentShare * 10) / 10,
      previousShare: Math.round(previousShare * 10) / 10,
      growthRate: Math.round(growthRate * 10) / 10,
      negativeSentimentCount,
      negativeConcentration: Math.round(negativeConcentration * 10) / 10,
      status,
      isStatisticallySignificant,
      explanation,
      supportingFeedback,
    });
  }

  // Sort: Emerging high-negative trends first
  return results.sort((a, b) => {
    if (a.status === 'emerging' && b.status !== 'emerging') return -1;
    if (b.status === 'emerging' && a.status !== 'emerging') return 1;
    return b.negativeConcentration - a.negativeConcentration;
  });
}
