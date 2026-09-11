'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { MetricCards } from '@/components/analytics/metric-cards';
import { SentimentChart } from '@/components/analytics/sentiment-chart';
import { SourceChart } from '@/components/analytics/source-chart';
import { ThemeChart } from '@/components/analytics/theme-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Filter, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OverviewDashboardPage() {
  const { feedbackItems, sources } = useOrg();
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sourceFilter] = useState<string>('all');

  // Filter items based on selected filters
  const filteredItems = feedbackItems.filter(item => {
    if (segmentFilter !== 'all' && item.customer_segment !== segmentFilter) return false;
    if (sourceFilter !== 'all' && item.source_id !== sourceFilter) return false;
    return true;
  });

  const urgentItems = filteredItems.filter(
    i => i.sentiment_result?.urgency === 'critical' || i.sentiment_result?.urgency === 'high'
  ).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Executive Feedback Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time Voice of Customer intelligence, sentiment velocity, and high-priority issue tracking.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <Filter className="h-4 w-4 text-slate-400 ml-1" />
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-300"
            >
              <option value="all">All Customer Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="pro">Pro</option>
              <option value="smb">SMB</option>
              <option value="free">Free</option>
            </select>
          </div>

          <Link href="/dashboard/ask">
            <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold">
              <Sparkles className="h-4 w-4 mr-1.5" /> Ask LOOP AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <MetricCards items={filteredItems} />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sentiment Volume Trend (2 columns) */}
        <Card className="lg:col-span-2 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Sentiment Velocity Over Time</CardTitle>
              <CardDescription>Daily positive, neutral, and negative customer sentiment trends</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">Last 90 Days</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <SentimentChart items={filteredItems} />
          </CardContent>
        </Card>

        {/* Source Breakdown (1 column) */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle>Feedback Channels</CardTitle>
            <CardDescription>Volume breakdown by ingestion channel</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SourceChart items={filteredItems} sources={sources} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Top Themes & Recent Urgent Escalations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Customer Themes */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top Recurring Themes</CardTitle>
              <CardDescription>Most frequent topics extracted by AI analysis</CardDescription>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="text-xs text-sky-600">
                View Trends <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <ThemeChart items={filteredItems} />
          </CardContent>
        </Card>

        {/* High Priority Urgent Escalations */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5 mr-2" /> Urgent Escalations & Churn Risks
              </CardTitle>
              <CardDescription>Feedback items flagged with critical/high urgency</CardDescription>
            </div>
            <Link href="/dashboard/feedback?urgency=critical">
              <Button variant="ghost" size="sm" className="text-xs text-rose-600">
                View All ({urgentItems.length})
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {urgentItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No critical or high-urgency items detected in current filter.
              </div>
            ) : (
              <div className="space-y-3">
                {urgentItems.map(item => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-rose-100 bg-rose-50/40 p-3.5 transition-colors dark:border-rose-900/50 dark:bg-rose-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.customer_name || 'Anonymous Customer'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="critical" className="text-[10px]">
                          {item.sentiment_result?.urgency.toUpperCase()}
                        </Badge>
                        {item.sentiment_result?.churn_risk && (
                          <Badge variant="destructive" className="text-[10px]">
                            CHURN RISK
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                      &quot;{item.feedback_text}&quot;
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Segment: <strong className="uppercase">{item.customer_segment}</strong></span>
                      <span className="italic">{item.sentiment_result?.suggested_action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
