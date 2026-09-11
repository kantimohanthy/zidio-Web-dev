'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useOrg } from '@/context/org-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Settings, Shield, Sparkles, Database, History, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SettingsPage() {
  const { organization, user, role } = useAuth();
  const { auditLogs } = useOrg();

  const [orgName, setOrgName] = useState(organization?.name || 'Acme Corp Intelligence');
  const [aiMode, setAiMode] = useState<'local' | 'openai'>('local');
  const [retentionDays, setRetentionDays] = useState<number>(365);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center">
          <Settings className="h-6 w-6 text-sky-500 mr-2" /> Settings & Administration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure organization profile, AI pipeline preferences, data retention policies, and audit logs.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Organization Profile Card */}
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>General workspace settings and plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subscription Tier</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input value="Enterprise Tier" readOnly className="bg-slate-50 dark:bg-slate-800" />
                  <Badge variant="positive">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Pipeline Preferences */}
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-sky-500 mr-2" /> AI Analysis Pipeline Engine
            </CardTitle>
            <CardDescription>Select between OpenAI cloud API or local deterministic fallback engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setAiMode('local')}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  aiMode === 'local'
                    ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20 dark:bg-sky-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Local Deterministic Engine</span>
                  <Badge variant="outline">Default (Zero API Key)</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Runs instant, rule-based NLP, keyword lexicons, and churn risk heuristics locally without sending data to external APIs.
                </p>
              </div>

              <div
                onClick={() => setAiMode('openai')}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  aiMode === 'openai'
                    ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20 dark:bg-sky-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">OpenAI API Key Mode</span>
                  <Badge variant="secondary">Cloud LLM</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Sends raw feedback text to server-side OpenAI completions for deep semantic theme extraction and structured output validation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention Controls */}
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 text-sky-500 mr-2" /> Data Retention Controls
            </CardTitle>
            <CardDescription>Automated feedback archiving & retention policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Archive Feedback Older Than:</span>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value={90}>90 Days</option>
                <option value={180}>180 Days</option>
                <option value={365}>365 Days (1 Year)</option>
                <option value={730}>730 Days (2 Years)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
            {savedSuccess ? <><Check className="h-4 w-4 mr-1.5" /> Settings Saved!</> : 'Save Settings'}
          </Button>
        </div>
      </form>

      {/* Audit Log View */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 text-sky-500 mr-2" /> Organization Audit Log History
          </CardTitle>
          <CardDescription>Security activity and mutation log</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Action Performed</TableHead>
                <TableHead>Target Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs font-mono text-slate-500">{formatDate(log.created_at)}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-900 dark:text-slate-100">{log.user_email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{log.entity_type} ({log.entity_id.substring(0, 8)})</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
