'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FeedbackItem,
  FeedbackSource,
  FeedbackTag,
  DetectedTheme,
  Report,
  ProcessingJob,
  AuditLog,
  FeedbackStatus
} from '../lib/supabase/types';
import {
  DEMO_FEEDBACK_ITEMS,
  DEMO_SOURCES,
  DEMO_TAGS,
  DEMO_THEMES,
  DEMO_REPORTS,
  DEMO_AUDIT_LOGS,
  DEMO_ORG
} from '../lib/utils/mock-db';
import { defaultAnalyzer } from '../lib/ai/analyzer';
import { FeedbackItemInput } from '../lib/validations/feedback';

interface OrgContextType {
  feedbackItems: FeedbackItem[];
  sources: FeedbackSource[];
  tags: FeedbackTag[];
  themes: DetectedTheme[];
  reports: Report[];
  auditLogs: AuditLog[];
  processingJobs: ProcessingJob[];
  isProcessing: boolean;
  addManualFeedback: (input: FeedbackItemInput) => Promise<FeedbackItem>;
  importCSVRows: (rows: FeedbackItemInput[], sourceName?: string) => Promise<{ importedCount: number }>;
  reprocessItem: (id: string) => Promise<void>;
  reprocessAll: () => Promise<void>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  bulkUpdateStatus: (ids: string[], status: FeedbackStatus) => void;
  addTagToItems: (itemIds: string[], tagId: string) => void;
  addSource: (name: string, type: 'csv_import' | 'manual_entry' | 'api_webhook' | 'zendesk' | 'intercom') => FeedbackSource;
  addReport: (report: Report) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [sources, setSources] = useState<FeedbackSource[]>([]);
  const [tags, setTags] = useState<FeedbackTag[]>([]);
  const [themes, setThemes] = useState<DetectedTheme[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    // Initialize state with demo seed data
    setFeedbackItems(DEMO_FEEDBACK_ITEMS);
    setSources(DEMO_SOURCES);
    setTags(DEMO_TAGS);
    setThemes(DEMO_THEMES);
    setReports(DEMO_REPORTS);
    setAuditLogs(DEMO_AUDIT_LOGS);
  }, []);

  const addManualFeedback = async (input: FeedbackItemInput): Promise<FeedbackItem> => {
    setIsProcessing(true);
    const newId = `fb_manual_${Date.now()}`;

    // Perform AI analysis
    const analysis = await defaultAnalyzer.analyze({
      feedbackText: input.feedback_text,
      rating: input.rating,
    });

    const matchedThemes = themes.filter(t => analysis.themes.includes(t.name));

    const newItem: FeedbackItem = {
      id: newId,
      organization_id: DEMO_ORG.id,
      source_id: input.source_id || sources[0]?.id || 'src_1',
      customer_name: input.customer_name || 'Anonymous Customer',
      customer_email: input.customer_email,
      customer_segment: input.customer_segment || 'smb',
      feedback_text: input.feedback_text,
      rating: input.rating,
      product_category: input.product_category || 'General',
      country: input.country || 'United States',
      status: 'new',
      created_at: input.created_at || new Date().toISOString(),
      imported_at: new Date().toISOString(),
      sentiment_result: {
        id: `sent_${Date.now()}`,
        organization_id: DEMO_ORG.id,
        feedback_id: newId,
        sentiment: analysis.sentiment,
        score: analysis.score,
        urgency: analysis.urgency,
        churn_risk: analysis.churn_risk,
        summary: analysis.summary,
        suggested_action: analysis.suggested_action,
        model_version: analysis.modelVersion,
        processed_at: analysis.processedAt,
      },
      themes: matchedThemes.length > 0 ? matchedThemes : [themes[0]],
      tags: [],
    };

    setFeedbackItems(prev => [newItem, ...prev]);

    // Record Audit Log
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      organization_id: DEMO_ORG.id,
      user_id: 'current_user',
      action: 'FEEDBACK_ADDED_MANUAL',
      entity_type: 'feedback_item',
      entity_id: newId,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);

    setIsProcessing(false);
    return newItem;
  };

  const importCSVRows = async (rows: FeedbackItemInput[], sourceName = 'CSV Batch Import') => {
    setIsProcessing(true);

    const newSource: FeedbackSource = {
      id: `src_csv_${Date.now()}`,
      organization_id: DEMO_ORG.id,
      name: sourceName,
      type: 'csv_import',
      status: 'active',
      feedback_count: rows.length,
      last_sync_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setSources(prev => [newSource, ...prev]);

    const newItems: FeedbackItem[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const newId = `fb_csv_${Date.now()}_${index}`;
      const analysis = await defaultAnalyzer.analyze({
        feedbackText: row.feedback_text,
        rating: row.rating,
      });

      const matchedThemes = themes.filter(t => analysis.themes.includes(t.name));

      const item: FeedbackItem = {
        id: newId,
        organization_id: DEMO_ORG.id,
        source_id: newSource.id,
        customer_name: row.customer_name || `CSV Customer ${index + 1}`,
        customer_email: row.customer_email,
        customer_segment: row.customer_segment || 'smb',
        feedback_text: row.feedback_text,
        rating: row.rating,
        product_category: row.product_category || 'Imported CSV',
        country: row.country || 'United States',
        status: 'new',
        created_at: row.created_at || new Date().toISOString(),
        imported_at: new Date().toISOString(),
        sentiment_result: {
          id: `sent_${newId}`,
          organization_id: DEMO_ORG.id,
          feedback_id: newId,
          sentiment: analysis.sentiment,
          score: analysis.score,
          urgency: analysis.urgency,
          churn_risk: analysis.churn_risk,
          summary: analysis.summary,
          suggested_action: analysis.suggested_action,
          model_version: analysis.modelVersion,
          processed_at: analysis.processedAt,
        },
        themes: matchedThemes.length > 0 ? matchedThemes : [themes[0]],
        tags: [],
        source: newSource,
      };
      newItems.push(item);
    }

    setFeedbackItems(prev => [...newItems, ...prev]);
    setIsProcessing(false);
    return { importedCount: newItems.length };
  };

  const reprocessItem = async (id: string) => {
    setIsProcessing(true);
    setFeedbackItems(prev => prev.map(item => {
      if (item.id === id) {
        const analysis = defaultAnalyzer.analyze({ feedbackText: item.feedback_text, rating: item.rating });
        // Synchronously resolve local analyzer for fast UI response
        const asyncAnalysis = analyzeSync(item.feedback_text, item.rating);
        return {
          ...item,
          sentiment_result: {
            id: item.sentiment_result?.id || `sent_${Date.now()}`,
            organization_id: DEMO_ORG.id,
            feedback_id: id,
            sentiment: asyncAnalysis.sentiment,
            score: asyncAnalysis.score,
            urgency: asyncAnalysis.urgency,
            churn_risk: asyncAnalysis.churn_risk,
            summary: asyncAnalysis.summary,
            suggested_action: asyncAnalysis.suggested_action,
            model_version: 'local/reprocessed-v1',
            processed_at: new Date().toISOString(),
          }
        };
      }
      return item;
    }));
    setIsProcessing(false);
  };

  const reprocessAll = async () => {
    setIsProcessing(true);
    // Reprocess all items in memory
    setFeedbackItems(prev => prev.map(item => {
      const asyncAnalysis = analyzeSync(item.feedback_text, item.rating);
      return {
        ...item,
        sentiment_result: {
          id: item.sentiment_result?.id || `sent_${Date.now()}`,
          organization_id: DEMO_ORG.id,
          feedback_id: item.id,
          sentiment: asyncAnalysis.sentiment,
          score: asyncAnalysis.score,
          urgency: asyncAnalysis.urgency,
          churn_risk: asyncAnalysis.churn_risk,
          summary: asyncAnalysis.summary,
          suggested_action: asyncAnalysis.suggested_action,
          model_version: 'local/reprocessed-v1',
          processed_at: new Date().toISOString(),
        }
      };
    }));
    setIsProcessing(false);
  };

  const updateFeedbackStatus = (id: string, status: FeedbackStatus) => {
    setFeedbackItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const bulkUpdateStatus = (ids: string[], status: FeedbackStatus) => {
    setFeedbackItems(prev => prev.map(i => ids.includes(i.id) ? { ...i, status } : i));
  };

  const addTagToItems = (itemIds: string[], tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;
    setFeedbackItems(prev => prev.map(i => {
      if (itemIds.includes(i.id)) {
        const existingTags = i.tags || [];
        if (!existingTags.some(t => t.id === tagId)) {
          return { ...i, tags: [...existingTags, tag] };
        }
      }
      return i;
    }));
  };

  const addSource = (name: string, type: 'csv_import' | 'manual_entry' | 'api_webhook' | 'zendesk' | 'intercom') => {
    const newSrc: FeedbackSource = {
      id: `src_${Date.now()}`,
      organization_id: DEMO_ORG.id,
      name,
      type,
      status: 'active',
      feedback_count: 0,
      last_sync_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setSources(prev => [newSrc, ...prev]);
    return newSrc;
  };

  const addReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <OrgContext.Provider
      value={{
        feedbackItems,
        sources,
        tags,
        themes,
        reports,
        auditLogs,
        processingJobs,
        isProcessing,
        addManualFeedback,
        importCSVRows,
        reprocessItem,
        reprocessAll,
        updateFeedbackStatus,
        bulkUpdateStatus,
        addTagToItems,
        addSource,
        addReport,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

// Helper sync fallback for immediate state updates
function analyzeSync(text: string, rating?: number) {
  const textLower = text.toLowerCase();
  const isNeg = textLower.includes('slow') || textLower.includes('bug') || textLower.includes('error') || textLower.includes('refund') || textLower.includes('fail') || textLower.includes('cancel') || textLower.includes('broken');
  const isPos = textLower.includes('great') || textLower.includes('love') || textLower.includes('excellent') || textLower.includes('awesome') || textLower.includes('superb');

  const sentiment = isNeg ? 'negative' : (isPos ? 'positive' : 'neutral');
  const score = isNeg ? 0.2 : (isPos ? 0.9 : 0.5);
  const urgency = isNeg ? (textLower.includes('cancel') || textLower.includes('refund') ? 'critical' : 'high') : 'low';
  const churn_risk = textLower.includes('cancel') || textLower.includes('refund');

  return {
    sentiment: sentiment as 'positive' | 'neutral' | 'negative',
    score,
    urgency: urgency as 'low' | 'medium' | 'high' | 'critical',
    churn_risk,
    summary: text.length > 100 ? `${text.substring(0, 97)}...` : text,
    suggested_action: isNeg ? 'Escalate to Support & Engineering' : 'Mark for customer testimonial',
  };
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}
