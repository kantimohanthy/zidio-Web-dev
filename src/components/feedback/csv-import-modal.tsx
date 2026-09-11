'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { EXPECTED_CSV_FIELDS, parseCSVFile, CSVParseResult } from '@/lib/utils/csv-parser';
import { useOrg } from '@/context/org-context';
import { UploadCloud, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVImportModal({ isOpen, onClose }: CSVImportModalProps) {
  const { importCSVRows } = useOrg();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Upload, 2: Map Headers, 3: Validate & Preview, 4: Summary
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string>>({});
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    // Initial auto parse to detect headers
    parseCSVFile(file, {}).then(res => {
      setCsvHeaders(res.headers);

      // Auto-map matching headers
      const initialMap: Record<string, string> = {};
      EXPECTED_CSV_FIELDS.forEach(field => {
        const match = res.headers.find(h => h.toLowerCase().includes(field.key.replace('_', '')) || h.toLowerCase().includes(field.key));
        if (match) initialMap[field.key] = match;
      });
      setHeaderMapping(initialMap);
      setStep(2);
    }).catch((err: any) => {
      alert(`Error reading CSV file: ${err.message}`);
    });
  };

  const handleRunValidation = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const result = await parseCSVFile(selectedFile, headerMapping);
      setParseResult(result);
      setStep(3);
    } catch (err: any) {
      alert(`CSV parsing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await importCSVRows(parseResult.validRows, selectedFile?.name || 'CSV Upload');
      setImportedCount(res.importedCount);
      setStep(4);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedFile(null);
    setParseResult(null);
    setHeaderMapping({});
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={resetAndClose}
      title="CSV Feedback Ingestion Wizard"
      description="Upload and map customer feedback CSV files for automated AI analysis."
      maxWidth="2xl"
    >
      {/* Wizard Progress Indicator */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        {[
          { num: 1, title: 'Upload File' },
          { num: 2, title: 'Map Headers' },
          { num: 3, title: 'Validate & Preview' },
          { num: 4, title: 'Import Summary' },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step === s.num
                  ? 'bg-sky-600 text-white'
                  : (step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold ${step === s.num ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Upload File */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-sky-500 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <UploadCloud className="h-10 w-10 text-sky-500 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Drag and drop your CSV file here
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Supported format: .csv (up to 10MB)
            </p>
            <div className="mt-4">
              <label className="cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700">
                Browse CSV File
                <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className="font-bold">Expected Columns:</span> Feedback Text (Required), Customer Name, Customer Email, Rating (1-5), Customer Segment (enterprise, pro, smb, free), Product Category, Country.
          </div>
        </div>
      )}

      {/* STEP 2: Header Mapping */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg dark:bg-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              File: {selectedFile?.name} ({csvHeaders.length} columns detected)
            </span>
            <Button size="sm" variant="ghost" onClick={() => setStep(1)} className="text-xs">
              Change File
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {EXPECTED_CSV_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{field.label}</span>
                </div>
                <select
                  value={headerMapping[field.key] || ''}
                  onChange={(e) => setHeaderMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">-- Do Not Map --</option>
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleRunValidation} disabled={!headerMapping.feedback_text}>
              Validate & Preview <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Invalid Row Reporting */}
      {step === 3 && parseResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
              <span className="text-xs text-slate-500">Total Rows</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{parseResult.totalRows}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="text-xs">Valid Rows</span>
              <p className="text-lg font-bold">{parseResult.validRows.length}</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              <span className="text-xs">Invalid Rows</span>
              <p className="text-lg font-bold">{parseResult.invalidRows.length}</p>
            </div>
          </div>

          {/* Invalid Rows Report */}
          {parseResult.invalidRows.length > 0 && (
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-900 dark:bg-rose-950/20">
              <div className="flex items-center text-rose-700 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 mr-1" /> Invalid Row Reporting ({parseResult.invalidRows.length} items ignored)
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1 text-slate-700 dark:text-slate-300">
                {parseResult.invalidRows.map((inv, idx) => (
                  <p key={idx}>Line {inv.rowNumber}: {inv.errors.join(', ')}</p>
                ))}
              </div>
            </div>
          )}

          {/* Sample Preview */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Valid Data Preview (First 3 items)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {parseResult.validRows.slice(0, 3).map((item, idx) => (
                <div key={idx} className="rounded-md bg-slate-50 p-2.5 text-xs dark:bg-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{item.customer_name || 'Customer'}: </span>
                  <span className="italic text-slate-700 dark:text-slate-300">&quot;{item.feedback_text}&quot;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button
              onClick={handleExecuteImport}
              disabled={isProcessing || parseResult.validRows.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isProcessing ? 'Processing AI Pipeline...' : `Import ${parseResult.validRows.length} Valid Records`}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Summary & Done */}
      {step === 4 && (
        <div className="py-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              CSV Ingestion & AI Analysis Complete!
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Successfully processed and stored <strong>{importedCount} customer feedback records</strong>. Sentiment, urgency, themes, and recommended actions have been computed and appended to your organization dashboard.
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={resetAndClose} className="bg-sky-600 hover:bg-sky-700 text-white">
              View Ingested Feedback
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
