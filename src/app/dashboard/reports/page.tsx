'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Calendar, Printer, Download, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ReportBuilder } from '@/components/reports/report-builder';
import { canGenerateReports } from '@/lib/utils/permissions';

export default function ReportsPage() {
  const { reports } = useOrg();
  const { role } = useAuth();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Voice of Customer Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate executive summaries, product opportunities, and printable VoC intelligence reports.
          </p>
        </div>

        {canGenerateReports(role) && (
          <Button
            onClick={() => setIsBuilderOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold size-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Generate VoC Report
          </Button>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((rep) => (
          <Card key={rep.id} className="flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-mono text-sky-700 bg-sky-50 dark:bg-sky-950">
                  {rep.segment_filter === 'all' ? 'ALL SEGMENTS' : rep.segment_filter?.toUpperCase()}
                </Badge>
                <span className="text-[11px] text-slate-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> {formatDate(rep.created_at)}
                </span>
              </div>
              <CardTitle className="text-base mt-2">{rep.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">{rep.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <FileText className="h-4 w-4 text-sky-500 mr-1.5" /> {rep.sections?.length || 3} Report Sections
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <Link href={`/dashboard/reports/${rep.id}/print`} target="_blank">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                    <Printer className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/reports/${rep.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Builder Modal */}
      <ReportBuilder isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
    </div>
  );
}
