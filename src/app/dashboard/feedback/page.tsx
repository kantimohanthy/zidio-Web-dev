'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { useAuth } from '@/context/auth-context';
import { FeedbackItem, FeedbackStatus } from '@/lib/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { FeedbackDrawer } from '@/components/feedback/feedback-drawer';
import { CSVImportModal } from '@/components/feedback/csv-import-modal';
import { ManualEntryModal } from '@/components/feedback/manual-entry-modal';
import { exportFeedbackToCSV } from '@/lib/utils/csv-exporter';
import { canImportFeedback, canReprocessFeedback } from '@/lib/utils/permissions';
import {
  Search,
  Download,
  Upload,
  Plus,
  RefreshCw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function FeedbackExplorerPage() {
  const { feedbackItems, tags, updateFeedbackStatus, bulkUpdateStatus, addTagToItems, reprocessAll } = useOrg();
  const { role } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Pagination & Selection
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers
  const [activeItem, setActiveItem] = useState<FeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Filter Logic
  const filteredItems = feedbackItems.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = item.feedback_text.toLowerCase().includes(q);
      const matchCust = item.customer_name?.toLowerCase().includes(q) || false;
      const matchEmail = item.customer_email?.toLowerCase().includes(q) || false;
      if (!matchText && !matchCust && !matchEmail) return false;
    }
    if (sentimentFilter !== 'all' && item.sentiment_result?.sentiment !== sentimentFilter) return false;
    if (urgencyFilter !== 'all' && item.sentiment_result?.urgency !== urgencyFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (segmentFilter !== 'all' && item.customer_segment !== segmentFilter) return false;
    if (sourceFilter !== 'all' && item.source_id !== sourceFilter) return false;
    return true;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedItems.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Feedback Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filter, inspect, tag, and export customer feedback across all channels.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canImportFeedback(role) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCSVModalOpen(true)}
                className="text-xs border-slate-300"
              >
                <Upload className="h-4 w-4 mr-1.5" /> CSV Import
              </Button>
              <Button
                size="sm"
                onClick={() => setIsManualModalOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Manual Entry
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportFeedbackToCSV(filteredItems)}
            className="text-xs border-slate-300"
          >
            <Download className="h-4 w-4 mr-1.5" /> Export CSV ({filteredItems.length})
          </Button>

          {canReprocessFeedback(role) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => reprocessAll()}
              className="text-xs"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" /> Reprocess All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback text, customer name, email..."
              className="pl-9 text-xs"
            />
          </div>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="actioned">Actioned</option>
            <option value="archived">Archived</option>
          </select>

          {/* Segment Filter */}
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Segments</option>
            <option value="enterprise">Enterprise</option>
            <option value="pro">Pro</option>
            <option value="smb">SMB</option>
            <option value="free">Free</option>
          </select>
        </div>

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-sky-50 p-2.5 dark:bg-sky-950/60 text-xs animate-in fade-in-0">
            <span className="font-semibold text-sky-900 dark:text-sky-200">
              {selectedIds.length} feedback item(s) selected
            </span>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdateStatus(selectedIds, 'actioned')}
                className="text-xs bg-white"
              >
                Mark Actioned
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdateStatus(selectedIds, 'under_review')}
                className="text-xs bg-white"
              >
                Under Review
              </Button>
              {tags.length > 0 && (
                <select
                  onChange={(e) => {
                    if (e.target.value) addTagToItems(selectedIds, e.target.value);
                  }}
                  className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700"
                >
                  <option value="">Apply Bulk Tag...</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Feedback Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
              </TableHead>
              <TableHead>Customer / Segment</TableHead>
              <TableHead className="w-2/5">Feedback Snippet & Themes</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-xs text-slate-400">
                  No feedback records match current filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => {
                const sentiment = item.sentiment_result?.sentiment || 'neutral';
                const urgency = item.sentiment_result?.urgency || 'low';

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    onClick={() => {
                      setActiveItem(item);
                      setIsDrawerOpen(true);
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.customer_name || 'Anonymous'}
                        </p>
                        <p className="text-[11px] text-sky-600 font-semibold uppercase">
                          {item.customer_segment || 'SMB'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                          &quot;{item.feedback_text}&quot;
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.themes?.map(t => (
                            <Badge key={t.id} variant="secondary" className="text-[9px] py-0 px-1">
                              {t.name}
                            </Badge>
                          ))}
                          {item.tags?.map(tg => (
                            <Badge key={tg.id} style={{ backgroundColor: `${tg.color}20`, color: tg.color }} className="text-[9px] py-0 px-1 border-0">
                              {tg.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sentiment === 'positive' ? 'positive' : (sentiment === 'negative' ? 'negative' : 'neutral')} className="capitalize text-[11px]">
                        {sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Badge variant={urgency === 'critical' ? 'critical' : (urgency === 'high' ? 'high' : 'low')} className="capitalize text-[11px]">
                          {urgency}
                        </Badge>
                        {item.sentiment_result?.churn_risk && (
                          <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'actioned' ? 'positive' : (item.status === 'under_review' ? 'medium' : 'neutral')} className="capitalize text-[11px]">
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredItems.length)}</strong> of <strong>{filteredItems.length}</strong> records
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <FeedbackDrawer
        item={activeItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveItem(null);
        }}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
      />

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
}
