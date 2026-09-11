'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Quote } from 'lucide-react';
import { TrendAnalysisResult } from '@/lib/ai/trend-engine';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface TrendListProps {
  trends: TrendAnalysisResult[];
}

export function TrendList({ trends }: TrendListProps) {
  if (trends.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No trend data available for current window comparison.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trends.map((trend) => {
        const isEmerging = trend.status === 'emerging';
        const isDeclining = trend.status === 'declining';

        return (
          <Card
            key={trend.themeName}
            className={`transition-all ${
              isEmerging && trend.negativeConcentration >= 50
                ? 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/10'
                : (isEmerging ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-slate-300')
            }`}
          >
            <CardContent className="p-5">
              {/* Header Info */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isEmerging ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : (isDeclining ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {isEmerging ? <TrendingUp className="h-5 w-5" /> : (isDeclining ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{trend.themeName}</h4>
                      <Badge variant="secondary" className="text-[10px]">{trend.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Current Share: <span className="font-semibold">{trend.currentShare}%</span> ({trend.currentCount} items) • Previous: <span className="font-semibold">{trend.previousShare}%</span> ({trend.previousCount} items)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={isEmerging ? 'critical' : (isDeclining ? 'positive' : 'neutral')} className="capitalize px-3 py-1">
                    {trend.status} ({trend.growthRate >= 0 ? `+${trend.growthRate}%` : `${trend.growthRate}%`})
                  </Badge>
                </div>
              </div>

              {/* Math Explanation Box */}
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 flex items-start space-x-2">
                <Info className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Explainable Trend Calculation: </span>
                  {trend.explanation}
                </div>
              </div>

              {/* Supporting Feedback Evidence Citations */}
              {trend.supportingFeedback.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                    <Quote className="h-3 w-3 mr-1 text-sky-500" />
                    Representative Customer Evidence ({trend.supportingFeedback.length} items)
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {trend.supportingFeedback.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                          <span>{evidence.customerName}</span>
                          <Badge variant={evidence.sentiment === 'negative' ? 'negative' : 'positive'} className="text-[10px] py-0">
                            {evidence.sentiment}
                          </Badge>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 italic line-clamp-2">
                          &quot;{evidence.text}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
