'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrg } from '@/context/org-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, Calendar, FileText, CheckCircle2, AlertTriangle, Quote } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { reports, feedbackItems } = useOrg();

  const report = reports.find(r => r.id === id) || reports[0];

  if (!report) {
    return <div className="p-8 text-center text-slate-500">Report not found.</div>;
  }

  // Representative quotes for report
  const sampleQuotes = feedbackItems.filter(i => i.sentiment_result?.sentiment === 'negative').slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/reports')} className="text-xs">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Reports
        </Button>

        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/reports/${report.id}/print`} target="_blank">
            <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs">
              <Printer className="h-4 w-4 mr-1.5" /> Print / Export PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Report Document Container */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-800">
        <CardContent className="p-8 space-y-8">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono text-sky-700 bg-sky-50 dark:bg-sky-950">
                VOICE OF CUSTOMER REPORT
              </Badge>
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" /> {formatDate(report.created_at)}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {report.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {report.description}
            </p>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-3">
              <FileText className="h-5 w-5 text-sky-500 mr-2" /> Executive Summary
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              {report.sections?.[0]?.content?.text || 'During this reporting window, feedback volume reached 105 submissions across 4 ingestion channels. Overall customer satisfaction stands at 54% positive sentiment, with emerging friction concentrated in invoice billing breakdowns and analytics dashboard load times.'}
            </p>
          </div>

          {/* Section 2: Emerging Risks & Friction Points */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5 mr-2" /> Emerging Risks & Friction Points
            </h3>
            <div className="space-y-2">
              {(report.sections?.[1]?.content?.risks || [
                'Billing overcharge discrepancies on Enterprise plan upgrades',
                'Dashboard page latency spike during peak analytics query windows',
                'Mobile app login authentication timeouts'
              ]).map((risk: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-2 rounded-lg bg-rose-50/60 p-3 text-xs text-rose-900 dark:bg-rose-950/20 dark:text-rose-200">
                  <span className="font-bold">•</span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5 mr-2" /> Actionable Recommendations
            </h3>
            <div className="space-y-2">
              {(report.sections?.[2]?.content?.actions || [
                'Prioritize database indexing sprint to eliminate dashboard latency',
                'Implement pre-billing credit card check validation',
                'Conduct proactive customer success reviews for enterprise accounts'
              ]).map((act: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-2 rounded-lg bg-emerald-50/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
                  <span className="font-bold">✓</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Supporting Customer Quotations */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-3">
              <Quote className="h-5 w-5 text-sky-500 mr-2" /> Supporting Verbatim Customer Quotes
            </h3>
            <div className="space-y-3">
              {sampleQuotes.map((q) => (
                <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900">
                  <p className="italic text-slate-800 dark:text-slate-200 font-serif text-sm">
                    &quot;{q.feedback_text}&quot;
                  </p>
                  <div className="mt-2 flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold">{q.customer_name} ({q.customer_segment?.toUpperCase()})</span>
                    <span>{formatDate(q.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
