import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, MessageSquare, BarChart3, ShieldCheck, ArrowRight, CheckCircle2, FileText, Database, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-400">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 font-bold text-white shadow-lg shadow-sky-500/30">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PROJECT LOOP</span>
          </div>

          <div className="hidden items-center space-x-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white transition-colors">Evaluator Demo</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold">
                Launch Live Demo <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-24 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400">
            <Sparkles className="h-4 w-4" />
            <span>AI Customer Feedback Intelligence Platform</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Turn Raw Feedback into <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Actionable Revenue Decisions</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            LOOP automatically ingests, classifies, and analyzes customer feedback across NPS, live chat, reviews, and CSV uploads. Discover emerging churn risks, track sentiment velocity, and ask grounded AI questions with exact customer citations.
          </p>

          <div id="demo" className="pt-6 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 text-base shadow-xl shadow-sky-500/25">
                Explore Demo Dashboard
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 px-8 text-base">
                1-Click Evaluator Logins
              </Button>
            </Link>
          </div>
        </div>

        {/* 1-Click Role Login Quick Launcher Card */}
        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
            Quick Demo Login Launcher (Evaluator Instant Access)
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { role: 'owner', title: 'Sarah Connor (Owner)', desc: 'Full org & billing control' },
              { role: 'admin', title: 'Alex Rivera (Admin)', desc: 'Team & sources manager' },
              { role: 'analyst', title: 'Priya Sharma (Analyst)', desc: 'Imports & report builder' },
              { role: 'viewer', title: 'David Chen (Viewer)', desc: 'Read-only dashboard view' },
            ].map(m => (
              <Link key={m.role} href={`/login?role=${m.role}`}>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left transition-all hover:border-sky-500 hover:bg-slate-900 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-sky-400 capitalize">{m.role}</span>
                    <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400">DEMO</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 truncate">{m.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="border-t border-slate-900 bg-slate-950 px-8 py-20">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">Core Capabilities</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Everything your product, success, and executive team needs to listen to customers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Dual-Mode AI Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly operates with an OpenAI API key or completely offline using deterministic keyword lexicons and NLP heuristics.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Emerging Trend Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explainable window-over-window comparison algorithms detecting volume velocity spikes, share changes, and negative sentiment concentration.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask LOOP — Grounded Q&A</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Natural language query answering grounded strictly in PostgreSQL full-text search with direct verbatim feedback citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-8 py-8 text-center text-xs text-slate-600">
        <p>PROJECT LOOP — AI Customer Feedback Intelligence Platform • Zidio Web Development Project 2026</p>
      </footer>
    </div>
  );
}
