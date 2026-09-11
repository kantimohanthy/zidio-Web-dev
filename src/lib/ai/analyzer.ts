import { FeedbackAnalysisResultInput } from '../validations/feedback';
import { analyzeLocally } from './providers/local-fallback';
import { analyzeWithOpenAI } from './providers/openai';

export interface FeedbackAnalysisInput {
  feedbackText: string;
  rating?: number;
  customerSegment?: string;
  sourceType?: string;
}

export interface FeedbackAnalysisOutput extends FeedbackAnalysisResultInput {
  modelVersion: string;
  processedAt: string;
}

export interface FeedbackAnalyzer {
  analyze(input: FeedbackAnalysisInput): Promise<FeedbackAnalysisOutput>;
}

export class ProviderIndependentAnalyzer implements FeedbackAnalyzer {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
  }

  async analyze(input: FeedbackAnalysisInput): Promise<FeedbackAnalysisOutput> {
    const processedAt = new Date().toISOString();

    if (this.apiKey) {
      const result = await analyzeWithOpenAI(input.feedbackText, input.rating, this.apiKey);
      return {
        ...result,
        modelVersion: 'openai/gpt-4o-mini',
        processedAt,
      };
    }

    // Default to local deterministic fallback analyzer
    const localResult = analyzeLocally(input.feedbackText, input.rating);
    return {
      ...localResult,
      modelVersion: 'local/deterministic-v1',
      processedAt,
    };
  }
}

export const defaultAnalyzer = new ProviderIndependentAnalyzer();
