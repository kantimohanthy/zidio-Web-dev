'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useOrg } from '@/context/org-context';
import { useAuth } from '@/context/auth-context';
import { Report } from '@/lib/supabase/types';
import { FileText, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportBuilder({ isOpen, onClose }: ReportBuilderProps) {
  const { feedbackItems, addReport } = useOrg();
  const { user } = useAuth();
  const [title, setTitle] = useState('Voice of Customer Executive Report');
  const [description, setDescription] = useState('Executive summary of customer sentiment, emerging issues, and recommended roadmap priorities.');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const filtered = feedbackItems.filter(i => segmentFilter === 'all' || i.customer_segment === segmentFilter);
      const total = filtered.length;
      const negCount = filtered.filter(i => i.sentiment_result?.sentiment === 'negative').length;
      const posCount = filtered.filter(i => i.sentiment_result?.sentiment === 'positive').length;

      const newReport: Report = {
        id: `rep_${Date.now()}`,
        organization_id: 'org_acme_123',
        created_by: user?.id || 'user_owner_1',
        title,
        description,
        date_range_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        date_range_end: new Date().toISOString(),
        segment_filter: segmentFilter,
        created_at: new Date().toISOString(),
        sections: [
          {
            id: `sec_1_${Date.now()}`,
            report_id: `rep_${Date.now()}`,
            organization_id: 'org_acme_123',
            section_type: 'executive_summary',
            title: 'Executive Summary',
            content: {
              text: `This VoC Report aggregates ${total} customer feedback submissions. Overall customer satisfaction shows ${Math.round((posCount / (total || 1)) * 100)}% positive sentiment vs ${Math.round((negCount / (total || 1)) * 100)}% negative sentiment.`
            },
            sort_order: 1,
          },
          {
            id: `sec_2_${Date.now()}`,
            report_id: `rep_${Date.now()}`,
            organization_id: 'org_acme_123',
            section_type: 'emerging_risks',
            title: 'Emerging Risks & Friction Points',
            content: {
              risks: [
                'Billing overcharge discrepancies on Enterprise plan upgrades',
                'Dashboard page latency spike during peak analytics query windows',
                'Mobile app login authentication timeouts'
              ]
            },
            sort_order: 2,
          },
          {
            id: `sec_3_${Date.now()}`,
            report_id: `rep_${Date.now()}`,
            organization_id: 'org_acme_123',
            section_type: 'recommendations',
            title: 'Strategic Business Recommendations',
            content: {
              actions: [
                'Prioritize database indexing sprint to eliminate dashboard latency',
                'Implement pre-billing credit card check validation',
                'Conduct proactive customer success reviews for enterprise accounts'
              ]
            },
            sort_order: 3,
          }
        ]
      };

      addReport(newReport);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Voice of Customer Report"
      description="Create a comprehensive, printable executive VoC intelligence report."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Report Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Customer Segment Scope</label>
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Customer Segments</option>
            <option value="enterprise">Enterprise Only</option>
            <option value="pro">Pro Only</option>
            <option value="smb">SMB Only</option>
            <option value="free">Free Only</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
            {isGenerating ? 'Synthesizing Report...' : <><Sparkles className="h-4 w-4 mr-1.5" /> Generate Report</>}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
