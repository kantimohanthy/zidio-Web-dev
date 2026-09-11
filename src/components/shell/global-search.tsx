'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MessageSquare, FileText, Sparkles, X } from 'lucide-react';
import { useOrg } from '@/context/org-context';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const { feedbackItems, reports } = useOrg();
  const router = useRouter();

  // Keyboard shortcut Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          const searchBtn = document.querySelector('button[onClick*="setIsSearchOpen"]');
          if (searchBtn) (searchBtn as HTMLButtonElement).click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedFeedback = query.trim()
    ? feedbackItems.filter(item =>
        item.feedback_text.toLowerCase().includes(query.toLowerCase()) ||
        item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
        item.customer_email?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchedReports = query.trim()
    ? reports.filter(rep =>
        rep.title.toLowerCase().includes(query.toLowerCase()) ||
        rep.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 pt-20 backdrop-blur-xs animate-in fade-in-0">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search feedback, topics, customers, reports... (e.g. 'billing')"
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Sparkles className="mx-auto h-6 w-6 text-sky-500 mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Quick Global Search</p>
              <p className="mt-1">Type keywords to search across 100+ customer feedback items and VoC reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Feedback Items Section */}
              {matchedFeedback.length > 0 && (
                <div>
                  <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Feedback Items ({matchedFeedback.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedFeedback.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(`/dashboard/feedback?id=${item.id}`);
                          onClose();
                        }}
                        className="flex w-full items-start space-x-3 rounded-lg p-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <MessageSquare className="h-4 w-4 text-sky-500 mt-0.5" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {item.customer_name || 'Customer'}: &quot;{item.feedback_text}&quot;
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.customer_segment} • {item.sentiment_result?.sentiment}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Section */}
              {matchedReports.length > 0 && (
                <div>
                  <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Voice-of-Customer Reports ({matchedReports.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedReports.map(rep => (
                      <button
                        key={rep.id}
                        onClick={() => {
                          router.push(`/dashboard/reports/${rep.id}`);
                          onClose();
                        }}
                        className="flex w-full items-start space-x-3 rounded-lg p-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <FileText className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {rep.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {rep.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedFeedback.length === 0 && matchedReports.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching items found for &quot;{query}&quot;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
