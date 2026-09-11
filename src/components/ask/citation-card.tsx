'use client';

import React from 'react';
import { GroundedCitation } from '@/lib/ai/ask-loop';
import { Badge } from '../ui/badge';
import { User, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CitationCardProps {
  citation: GroundedCitation;
  onSelectFeedback?: (feedbackId: string) => void;
}

export function CitationCard({ citation, onSelectFeedback }: CitationCardProps) {
  return (
    <div
      onClick={() => onSelectFeedback && onSelectFeedback(citation.feedbackId)}
      className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="font-mono text-[10px] text-sky-700 bg-sky-50 dark:bg-sky-950 dark:text-sky-300">
            {(citation.customerSegment || 'SMB').toUpperCase()}
          </Badge>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center">
            <User className="h-3 w-3 mr-1 text-slate-400" /> {citation.customerName || 'Customer'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={citation.sentiment === 'negative' ? 'negative' : (citation.sentiment === 'positive' ? 'positive' : 'neutral')} className="text-[10px] py-0">
            {citation.sentiment || 'neutral'}
          </Badge>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-3">
        &quot;{citation.snippet}&quot;
      </p>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
        <span className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" /> {formatDate(citation.createdAt)}
        </span>
        <span className="font-mono text-sky-600 dark:text-sky-400">#Citation-{citation.feedbackId.substring(0, 8)}</span>
      </div>
    </div>
  );
}
