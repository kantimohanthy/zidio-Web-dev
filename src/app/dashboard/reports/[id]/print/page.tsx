'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrg } from '@/context/org-context';
import { formatDate } from '@/lib/utils';
import { Flame } from 'lucide-react';

export default function PrintableReportPage() {
  const { id } = useParams();
  const { reports, feedbackItems } = useOrg();

  const report = reports.find(r => r.id === id) || reports[0];

  useEffect(() => {
    // Auto trigger print dialog after page renders
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!report) return <div className="p-8">Report not found.</div>;

  const sampleQuotes = feedbackItems.filter(i => i.sentiment_result?.sentiment === 'negative').slice(0, 4);

  return (
    <div className="min-h-screen bg-white p-12 text-slate-900 font-sans leading-normal max-w-4xl mx-auto">
      {/* Print Control Bar (Hidden during printing) */}
      <div className="no-print mb-6 flex items-center justify-between rounded-lg bg-sky-50 p-4 border border-sky-200">
        <span className="text-xs text-sky-800 font-bold">
          Printable Voice of Customer Report — Print dialog triggered automatically.
        </span>
        <button
          onClick={() => window.print()}
          className="rounded-md bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          Click to Print / Save as PDF
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
            <Flame className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">LOOP</span>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">| Feedback Intelligence</span>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p className="font-bold text-slate-900">CONFIDENTIAL</p>
          <p>{formatDate(report.created_at)}</p>
        </div>
      </div>

      {/* Title block */}
      <div className="mt-8">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Executive VoC Intelligence Report</span>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">{report.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{report.description}</p>
      </div>

      {/* Section 1 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">1. Executive Summary</h2>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {report.sections?.[0]?.content?.text || 'During this reporting window, feedback volume reached 105 submissions across 4 ingestion channels. Overall customer satisfaction stands at 54% positive sentiment, with emerging friction concentrated in invoice billing breakdowns and analytics dashboard load times.'}
        </p>
      </div>

      {/* Section 2 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-rose-700 border-b border-slate-200 pb-1">2. Priority Risks & Friction Points</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-800">
          {(report.sections?.[1]?.content?.risks || [
            'Billing overcharge discrepancies on Enterprise plan upgrades',
            'Dashboard page latency spike during peak analytics query windows',
            'Mobile app login authentication timeouts'
          ]).map((r: string, idx: number) => (
            <li key={idx} className="flex items-start">
              <span className="font-bold mr-2 text-rose-600">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 3 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-emerald-700 border-b border-slate-200 pb-1">3. Actionable Business Recommendations</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-800">
          {(report.sections?.[2]?.content?.actions || [
            'Prioritize database indexing sprint to eliminate dashboard latency',
            'Implement pre-billing credit card check validation',
            'Conduct proactive customer success reviews for enterprise accounts'
          ]).map((a: string, idx: number) => (
            <li key={idx} className="flex items-start">
              <span className="font-bold mr-2 text-emerald-600">✓</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">4. Supporting Verbatim Customer Evidence</h2>
        <div className="mt-4 space-y-4">
          {sampleQuotes.map((q) => (
            <div key={q.id} className="rounded-lg border border-slate-200 p-4 text-xs bg-slate-50">
              <p className="italic font-serif text-slate-800">&quot;{q.feedback_text}&quot;</p>
              <p className="mt-2 text-right font-bold text-slate-600">— {q.customer_name} ({q.customer_segment?.toUpperCase()})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
        Generated by PROJECT LOOP AI Feedback Intelligence Platform • Page 1 of 1
      </div>
    </div>
  );
}
