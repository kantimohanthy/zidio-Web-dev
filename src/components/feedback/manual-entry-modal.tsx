'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useOrg } from '@/context/org-context';
import { feedbackItemSchema } from '@/lib/validations/feedback';
import { Sparkles } from 'lucide-react';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualEntryModal({ isOpen, onClose }: ManualEntryModalProps) {
  const { addManualFeedback } = useOrg();
  const [feedbackText, setFeedbackText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerSegment, setCustomerSegment] = useState<'enterprise' | 'pro' | 'smb' | 'free'>('smb');
  const [rating, setRating] = useState<number>(4);
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = feedbackItemSchema.safeParse({
      feedback_text: feedbackText,
      customer_name: customerName,
      customer_email: customerEmail || undefined,
      customer_segment: customerSegment,
      rating,
      product_category: category,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await addManualFeedback(validation.data);
      setFeedbackText('');
      setCustomerName('');
      setCustomerEmail('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Customer Feedback Entry"
      description="Add an individual customer feedback item for instant AI sentiment and theme classification."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Customer Feedback Text *
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={4}
            placeholder="Paste raw customer comment, email, chat snippet, or review text here..."
            className="mt-1 w-full rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer Name</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer Email</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. john@company.com"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Segment</label>
            <select
              value={customerSegment}
              onChange={(e) => setCustomerSegment(e.target.value as any)}
              className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="enterprise">Enterprise</option>
              <option value="pro">Pro</option>
              <option value="smb">SMB</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Billing, UI"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
            {isSubmitting ? 'Analyzing...' : <><Sparkles className="h-4 w-4 mr-1.5" /> Submit & Analyze</>}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
