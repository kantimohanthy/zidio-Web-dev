'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Database, Plus, RefreshCw, CheckCircle2, Copy, Code, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { canManageSources } from '@/lib/utils/permissions';
import { CSVImportModal } from '@/components/feedback/csv-import-modal';

export default function SourcesPage() {
  const { sources, addSource } = useOrg();
  const { role } = useAuth();
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<'csv_import' | 'manual_entry' | 'api_webhook' | 'zendesk' | 'intercom'>('api_webhook');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    addSource(newSourceName, newSourceType);
    setNewSourceName('');
    setIsAddModalOpen(false);
  };

  const webhookEndpoint = `${typeof window !== 'undefined' ? window.location.origin : 'https://loop.app'}/api/ingest`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center">
            <Database className="h-6 w-6 text-sky-500 mr-2" /> Data Ingestion Sources
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage active CSV imports, manual entries, and REST API ingestion webhooks.
          </p>
        </div>

        {canManageSources(role) && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCSVModalOpen(true)}
              className="text-xs"
            >
              Upload CSV
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add New Source
            </Button>
          </div>
        )}
      </div>

      {/* Active Ingestion Channels List */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sources.map((src) => (
          <Card key={src.id} className="shadow-2xs border-slate-200 dark:border-slate-800">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="positive" className="text-[10px] uppercase">
                  {src.status}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400">
                  {src.type.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{src.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last sync: {formatDate(src.last_sync_at)}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Feedback Count</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{src.feedback_count} items</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* REST API / Webhook Documentation Section */}
      <Card className="shadow-sm border-sky-200 bg-sky-50/20 dark:border-sky-900 dark:bg-sky-950/10">
        <CardHeader>
          <CardTitle className="flex items-center text-sky-900 dark:text-sky-200">
            <Code className="h-5 w-5 mr-2 text-sky-600" /> Generic REST / Webhook Ingestion API
          </CardTitle>
          <CardDescription>
            Send live customer feedback programmatically from your backend, Intercom, Zendesk, or custom apps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Endpoint URL</label>
            <div className="mt-1 flex items-center space-x-2">
              <Input value={webhookEndpoint} readOnly className="font-mono text-xs bg-white dark:bg-slate-900" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(webhookEndpoint);
                  setCopiedWebhook(true);
                  setTimeout(() => setCopiedWebhook(false), 2000);
                }}
                className="text-xs shrink-0"
              >
                <Copy className="h-3.5 w-3.5 mr-1" /> {copiedWebhook ? 'Copied!' : 'Copy Endpoint'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Example JSON Payload</label>
            <pre className="mt-1 rounded-lg bg-slate-900 p-4 text-xs font-mono text-sky-300 overflow-x-auto">
{`POST /api/ingest
Content-Type: application/json
Authorization: Bearer YOUR_ORG_API_KEY

{
  "feedback_text": "Customer service was fantastic and helped me resolve my billing issue immediately!",
  "customer_name": "Marcus Vance",
  "customer_email": "marcus@starlight.io",
  "customer_segment": "enterprise",
  "rating": 5,
  "product_category": "Support",
  "country": "United States"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Planned Future Integrations (Clearly labeled per rule 14) */}
      <Card className="shadow-2xs border-slate-200 opacity-80">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
            <Lock className="h-4 w-4 mr-2 text-slate-400" /> Native Third-Party Integrations (Future Enterprise Addons)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { name: 'Zendesk Support Tickets', status: 'Requires Enterprise API Key' },
              { name: 'Intercom Inbox Sync', status: 'Requires Intercom OAuth' },
              { name: 'Salesforce Service Cloud', status: 'Enterprise Addon' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h5>
                <Badge variant="secondary" className="mt-2 text-[10px]">{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Source Modal */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Data Ingestion Source"
        maxWidth="sm"
      >
        <form onSubmit={handleAddSource} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Source Name</label>
            <Input
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              placeholder="e.g. Q4 Product Feedback Form"
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Source Type</label>
            <select
              value={newSourceType}
              onChange={(e) => setNewSourceType(e.target.value as any)}
              className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="api_webhook">REST / Webhook Endpoint</option>
              <option value="csv_import">CSV Upload</option>
              <option value="manual_entry">Manual Entry</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">Add Source</Button>
          </div>
        </form>
      </Dialog>

      {/* CSV Upload Modal */}
      <CSVImportModal isOpen={isCSVModalOpen} onClose={() => setIsCSVModalOpen(false)} />
    </div>
  );
}
