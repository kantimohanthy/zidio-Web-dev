'use client';

import React, { useState } from 'react';
import { useOrg } from '@/context/org-context';
import { answerFeedbackQuestion, AskLoopResult } from '@/lib/ai/ask-loop';
import { CitationCard } from '@/components/ask/citation-card';
import { FeedbackDrawer } from '@/components/feedback/feedback-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, HelpCircle, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';
import { FeedbackItem } from '@/lib/supabase/types';

const SUGGESTED_QUESTIONS = [
  "What are customers complaining about this month?",
  "Why has negative sentiment increased in billing?",
  "Which product performance issue should we prioritize first?",
  "What do Enterprise customers say about dashboard speed?",
  "Summarize recent checkout and payment errors."
];

export default function AskLoopPage() {
  const { feedbackItems } = useOrg();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<AskLoopResult[]>([]);
  const [activeCitationItem, setActiveCitationItem] = useState<FeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAsk = (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const result = answerFeedbackQuestion(q, feedbackItems);
      setHistory(prev => [result, ...prev]);
      setIsLoading(false);
      if (!queryToAsk) setQuestion('');
    }, 400); // Realistic AI inference pulse
  };

  const handleSelectCitation = (feedbackId: string) => {
    const item = feedbackItems.find(i => i.id === feedbackId);
    if (item) {
      setActiveCitationItem(item);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>Grounded AI Feedback Search</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Ask LOOP Intelligence
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Ask natural language questions grounded strictly in your organization&apos;s stored feedback data. Every answer is backed by verifiable customer evidence citations.
        </p>
      </div>

      {/* Query Bar Box */}
      <Card className="shadow-lg border-sky-200 dark:border-sky-900 bg-white dark:bg-slate-900">
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center space-x-3"
          >
            <Sparkles className="h-5 w-5 text-sky-500 shrink-0 ml-1" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about customer sentiment, complaints, or feature requests..."
              className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            <Button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5"
            >
              {isLoading ? 'Searching Feedback...' : <><Send className="h-4 w-4 mr-1.5" /> Ask LOOP</>}
            </Button>
          </form>

          {/* Suggested Prompts */}
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center">
              <HelpCircle className="h-3.5 w-3.5 mr-1 text-sky-500" /> Suggested Grounded Prompts:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(sq);
                    handleAsk(sq);
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer History & Results Stream */}
      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-800">
            <MessageSquare className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No questions asked yet</h3>
            <p className="text-xs text-slate-400 mt-1">Select one of the suggested prompts above or type your query.</p>
          </div>
        ) : (
          history.map((res, index) => (
            <Card key={index} className="shadow-md border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Question Header Bar */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  <h3 className="text-sm font-bold">{res.question}</h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-sky-300 border-sky-800">
                  {res.totalMatchesEvaluated} Feedback Records Evaluated
                </Badge>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Insufficient Evidence Warning Banner */}
                {!res.hasSufficientEvidence && (
                  <div className="flex items-center space-x-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span><strong>Insufficient Evidence:</strong> No matching customer feedback records were found in your database.</span>
                  </div>
                )}

                {/* Grounded Answer Markdown Text */}
                <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {res.answer}
                </div>

                {/* Citations & Evidence Section */}
                {res.citations.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-1 text-emerald-500" /> Grounded Evidence Citations ({res.citations.length})
                      </h4>
                      <span className="text-[11px] text-slate-400">Click any card to inspect full feedback item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {res.citations.map((cit) => (
                        <CitationCard
                          key={cit.feedbackId}
                          citation={cit}
                          onSelectFeedback={handleSelectCitation}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Feedback Drawer for inspection */}
      <FeedbackDrawer
        item={activeCitationItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveCitationItem(null);
        }}
      />
    </div>
  );
}
