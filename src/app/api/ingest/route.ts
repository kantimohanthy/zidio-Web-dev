import { NextRequest, NextResponse } from 'next/server';
import { feedbackItemSchema } from '@/lib/validations/feedback';
import { defaultAnalyzer } from '@/lib/ai/analyzer';
import { DEMO_ORG } from '@/lib/utils/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Input Validation with Zod
    const validation = feedbackItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          details: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    const itemInput = validation.data;

    // 2. Perform AI Sentiment Analysis
    const analysis = await defaultAnalyzer.analyze({
      feedbackText: itemInput.feedback_text,
      rating: itemInput.rating,
    });

    const newFeedbackId = `fb_webhook_${Date.now()}`;
    const createdAt = itemInput.created_at || new Date().toISOString();

    const createdRecord = {
      id: newFeedbackId,
      organization_id: DEMO_ORG.id,
      customer_name: itemInput.customer_name || 'Webhook Customer',
      customer_email: itemInput.customer_email || null,
      customer_segment: itemInput.customer_segment || 'smb',
      feedback_text: itemInput.feedback_text,
      rating: itemInput.rating || null,
      product_category: itemInput.product_category || 'Webhook API Ingestion',
      country: itemInput.country || 'United States',
      status: 'new',
      created_at: createdAt,
      sentiment_result: {
        sentiment: analysis.sentiment,
        score: analysis.score,
        urgency: analysis.urgency,
        churn_risk: analysis.churn_risk,
        summary: analysis.summary,
        suggested_action: analysis.suggested_action,
        model_version: analysis.modelVersion,
        processed_at: analysis.processedAt,
      },
      themes: analysis.themes,
    };

    return NextResponse.json({
      success: true,
      message: 'Feedback ingested and analyzed successfully.',
      data: createdRecord,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Webhook ingestion error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
