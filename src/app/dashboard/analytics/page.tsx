'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { computeEmergingTrends } from '@/lib/ai/trend-engine';
import { TrendList } from '@/components/analytics/trend-list';
import { SentimentChart } from '@/components/analytics/sentiment-chart';
import { ThemeChart } from '@/components/analytics/theme-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Sliders, Info, ShieldAlert } from 'lucide-react';

export default function AnalyticsPage() {
  const { feedbackItems } = useOrg();
  const [windowDays, setWindowDays] = useState<number>(30);

  // Divide feedback into current window vs previous window based on created_at
  const now = new Date().getTime();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  const currentPeriodItems = feedbackItems.filter(item => {
    const time = new Date(item.created_at).getTime();
    return now - time <= windowMs;
  });

  const previousPeriodItems = feedbackItems.filter(item => {
    const time = new Date(item.created_at).getTime();
    return now - time > windowMs && now - time <= windowMs * 2;
  });

  // Compute explainable trends
  const trends = computeEmergingTrends(currentPeriodItems, previousPeriodItems, 3);

  const emergingCount = trends.filter(t => t.status === 'emerging').length;
  const criticalEmergingCount = trends.filter(t => t.status === 'emerging' && t.negativeConcentration >= 40).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center">
            <Flame className="h-6 w-6 text-sky-500 mr-2" /> Advanced Intelligence & Emerging Trends
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Window-over-window period comparison, growth velocity algorithms, and negative sentiment concentration.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold">
          <Calendar className="h-4 w-4 text-slate-400 ml-1" />
          <span>Comparison Window:</span>
          {[14, 30, 60].map(days => (
            <button
              key={days}
              onClick={() => setWindowDays(days)}
              className={`rounded px-2.5 py-1 transition-colors ${
                windowDays === days
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Emerging Trends Detected</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{emergingCount}</h3>
              <p className="text-[11px] text-slate-500">Theme volume growth &gt; +25%</p>
            </div>
            <Badge variant="critical">{emergingCount} Emerging</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Critical Risk Trends</p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{criticalEmergingCount}</h3>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">Negative concentration &gt; 40%</p>
            </div>
            <ShieldAlert className="h-8 w-8 text-rose-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Items Evaluated</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {currentPeriodItems.length} vs {previousPeriodItems.length}
              </h3>
              <p className="text-[11px] text-slate-500">Current vs previous {windowDays}-day window</p>
            </div>
            <Badge variant="outline">Min Threshold: 3</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Emerging Trends Section */}
      <Card className="shadow-2xs">
        <CardHeader>
          <CardTitle>Emerging, Stable & Declining Themes</CardTitle>
          <CardDescription>
            Explainable comparative analysis derived from {currentPeriodItems.length} recent vs {previousPeriodItems.length} prior feedback submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendList trends={trends} />
        </CardContent>
      </Card>

      {/* Deep-Dive Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-2xs">
          <CardHeader>
            <CardTitle>Sentiment Velocity Curve</CardTitle>
            <CardDescription>Temporal distribution of positive vs negative sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentChart items={currentPeriodItems} />
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardHeader>
            <CardTitle>Theme Volume Breakdown</CardTitle>
            <CardDescription>Category distribution of active customer complaints & praise</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeChart items={currentPeriodItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
