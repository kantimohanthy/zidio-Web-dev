'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { FeedbackItem } from '@/lib/supabase/types';

interface ThemeChartProps {
  items: FeedbackItem[];
}

export function ThemeChart({ items }: ThemeChartProps) {
  const themeMap = new Map<string, { theme: string; positive: number; neutral: number; negative: number }>();

  items.forEach(item => {
    const themes = item.themes && item.themes.length > 0
      ? item.themes.map(t => t.name)
      : ['General'];

    const sentiment = item.sentiment_result?.sentiment || 'neutral';

    themes.forEach(tName => {
      if (!themeMap.has(tName)) {
        themeMap.set(tName, { theme: tName, positive: 0, neutral: 0, negative: 0 });
      }
      const entry = themeMap.get(tName)!;
      if (sentiment === 'positive') entry.positive += 1;
      else if (sentiment === 'negative') entry.negative += 1;
      else entry.neutral += 1;
    });
  });

  const chartData = Array.from(themeMap.values())
    .sort((a, b) => (b.positive + b.neutral + b.negative) - (a.positive + a.neutral + a.negative))
    .slice(0, 7); // Top 7 themes

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No theme breakdown available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="theme" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Bar dataKey="positive" name="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} />
          <Bar dataKey="negative" name="Negative" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
