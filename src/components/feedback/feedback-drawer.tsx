'use client';

import React from 'react';
import { Drawer } from '../ui/drawer';
import { FeedbackItem, FeedbackStatus } from '@/lib/supabase/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sparkles, RefreshCw, Calendar, Mail, User, ShieldAlert, Star, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useOrg } from '@/context/org-context';
import { useAuth } from '@/context/auth-context';
import { canReprocessFeedback } from '@/lib/utils/permissions';

interface FeedbackDrawerProps {
  item: FeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDrawer({ item, isOpen, onClose }: FeedbackDrawerProps) {
  const { reprocessItem, updateFeedbackStatus } = useOrg();
  const { role } = useAuth();

  if (!item) return null;

  const sentiment = item.sentiment_result?.sentiment || 'neutral';
  const score = item.sentiment_result?.score || 0.5;
  const urgency = item.sentiment_result?.urgency || 'low';
  const churnRisk = item.sentiment_result?.churn_risk || false;
  const summary = item.sentiment_result?.summary || 'No summary generated.';
  const suggestedAction = item.sentiment_result?.suggested_action || 'No action suggested.';
  const modelVersion = item.sentiment_result?.model_version || 'local/deterministic-v1';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Feedback Detail #${item.id}`}>
      <div className="space-y-6">
        {/* Status & Actions Header */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Current Status</p>
            <div className="mt-1 flex items-center space-x-2">
              <Badge variant={item.status === 'actioned' ? 'positive' : (item.status === 'under_review' ? 'medium' : 'neutral')} className="capitalize">
                {item.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {(['new', 'under_review', 'actioned', 'archived'] as FeedbackStatus[]).map((st) => (
              <Button
                key={st}
                variant={item.status === st ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFeedbackStatus(item.id, st)}
                className="text-xs capitalize"
              >
                {st.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Original Feedback Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Original Customer Feedback</h3>
            <span className="text-xs text-slate-400 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" /> {formatDate(item.created_at)}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
            &quot;{item.feedback_text}&quot;
          </p>

          {/* Customer Metadata Grid */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Customer Name:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center mt-0.5">
                <User className="h-3.5 w-3.5 mr-1 text-slate-400" /> {item.customer_name || 'Anonymous'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Customer Email:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center mt-0.5">
                <Mail className="h-3.5 w-3.5 mr-1 text-slate-400" /> {item.customer_email || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Segment / Plan:</span>
              <p className="font-semibold uppercase text-sky-600 dark:text-sky-400 mt-0.5">
                {item.customer_segment || 'SMB'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Rating:</span>
              <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center mt-0.5">
                {item.rating ? (
                  <>
                    <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {item.rating} / 5.0
                  </>
                ) : 'No Rating'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis Derived Intelligence Box */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 dark:border-sky-900/60 dark:bg-sky-950/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-sky-900 dark:text-sky-200 flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5 text-sky-600" /> AI Derived Intelligence
            </h3>
            <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400">
              Model: {modelVersion}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white p-3 shadow-2xs dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Sentiment</span>
              <div className="mt-1 flex items-center space-x-1.5">
                <Badge variant={sentiment === 'positive' ? 'positive' : (sentiment === 'negative' ? 'negative' : 'neutral')} className="capitalize">
                  {sentiment}
                </Badge>
                <span className="text-xs font-mono text-slate-500">({score})</span>
              </div>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-2xs dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Urgency Level</span>
              <div className="mt-1">
                <Badge variant={urgency === 'critical' ? 'critical' : (urgency === 'high' ? 'high' : 'low')} className="capitalize">
                  {urgency}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-2xs dark:bg-slate-900">
              <span className="text-[11px] text-slate-400 font-medium">Churn Risk</span>
              <div className="mt-1">
                {churnRisk ? (
                  <Badge variant="destructive" className="flex items-center w-fit">
                    <ShieldAlert className="h-3 w-3 mr-1" /> HIGH RISK
                  </Badge>
                ) : (
                  <Badge variant="positive">LOW RISK</Badge>
                )}
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Executive Summary</h4>
            <p className="mt-1 text-xs text-slate-800 dark:text-slate-200">{summary}</p>
          </div>

          {/* Suggested Business Action */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Recommended Action</h4>
            <p className="mt-1 text-xs font-semibold text-sky-800 dark:text-sky-300 flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1 text-sky-600 shrink-0" /> {suggestedAction}
            </p>
          </div>

          {/* Extracted Themes */}
          {item.themes && item.themes.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detected Themes</h4>
              <div className="flex flex-wrap gap-1.5">
                {item.themes.map(t => (
                  <Badge key={t.id} variant="secondary" className="text-[11px]">
                    {t.name} ({t.category})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reprocess Button (Admin/Owner role restricted) */}
          {canReprocessFeedback(role) && (
            <div className="mt-5 pt-3 border-t border-sky-100 dark:border-sky-900 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => reprocessItem(item.id)}
                className="text-xs border-sky-300 text-sky-700 hover:bg-sky-100"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reprocess Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
