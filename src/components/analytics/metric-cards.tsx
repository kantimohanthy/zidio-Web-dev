'use client';

import React from 'react';
import { MessageSquare, Star, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { FeedbackItem } from '@/lib/supabase/types';

interface MetricCardsProps {
  items: FeedbackItem[];
}

export function MetricCards({ items }: MetricCardsProps) {
  const total = items.length;

  // Rating average
  const itemsWithRating = items.filter(i => i.rating !== undefined && i.rating > 0);
  const avgRating = itemsWithRating.length > 0
    ? (itemsWithRating.reduce((sum, i) => sum + (i.rating || 0), 0) / itemsWithRating.length).toFixed(1)
    : 'N/A';

  // Sentiment counts
  const posCount = items.filter(i => i.sentiment_result?.sentiment === 'positive').length;
  const neuCount = items.filter(i => i.sentiment_result?.sentiment === 'neutral').length;
  const negCount = items.filter(i => i.sentiment_result?.sentiment === 'negative').length;

  const posPct = total > 0 ? Math.round((posCount / total) * 100) : 0;

  // Urgent count
  const urgentCount = items.filter(
    i => i.sentiment_result?.urgency === 'critical' || i.sentiment_result?.urgency === 'high'
  ).length;

  // Churn risk count
  const churnRiskCount = items.filter(i => i.sentiment_result?.churn_risk).length;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Feedback Card */}
      <Card className="border-l-4 border-l-sky-500 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Feedback
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{total}</h3>
              <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +14% vs previous period
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSAT / Average Rating Card */}
      <Card className="border-l-4 border-l-amber-500 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Average Rating
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                {avgRating} <span className="text-sm text-slate-400 font-normal ml-1">/ 5.0</span>
              </h3>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Based on {itemsWithRating.length} rating responses
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positive Sentiment Share Card */}
      <Card className="border-l-4 border-l-emerald-500 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Positive Sentiment
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{posPct}%</h3>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {posCount} Pos / {neuCount} Neu / {negCount} Neg
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Issues & Churn Risk Card */}
      <Card className="border-l-4 border-l-rose-500 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Urgent & Churn Risks
              </p>
              <h3 className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{urgentCount}</h3>
              <p className="mt-1 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center">
                <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                {churnRiskCount} accounts flagged churn risk
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
