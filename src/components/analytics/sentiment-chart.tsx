'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { FeedbackItem } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface SentimentChartProps {
  items: FeedbackItem[];
}

export function SentimentChart({ items }: SentimentChartProps) {
  // Aggregate items by week/month for clear temporal trends
  const aggregatedMap = new Map<string, { date: string; positive: number; neutral: number; negative: number }>();

  // Sort items chronologically
  const sorted = [...items].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  sorted.forEach(item => {
    const dateKey = formatDate(item.created_at);
    if (!aggregatedMap.has(dateKey)) {
      aggregatedMap.set(dateKey, { date: dateKey, positive: 0, neutral: 0, negative: 0 });
    }
    const entry = aggregatedMap.get(dateKey)!;
    const sentiment = item.sentiment_result?.sentiment || 'neutral';
    if (sentiment === 'positive') entry.positive += 1;
    else if (sentiment === 'negative') entry.negative += 1;
    else entry.neutral += 1;
  });

  const chartData = Array.from(aggregatedMap.values()).slice(-14); // Last 14 data points

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No sentiment data available for current date filter.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" stackId="1" />
          <Area type="monotone" dataKey="neutral" name="Neutral" stroke="#64748b" fillOpacity={1} fill="url(#colorNeu)" stackId="1" />
          <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" stackId="1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
