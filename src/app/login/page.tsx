'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/supabase/types';
import { Flame, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsDemoRole, loginWithEmail } = useAuth();

  const [email, setEmail] = useState('owner@loop.demo');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam) {
      loginAsDemoRole(roleParam);
      router.push('/dashboard');
    }
  }, [searchParams, loginAsDemoRole, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await loginWithEmail(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials.');
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-bold text-white shadow-lg shadow-sky-500/30">
            <Flame className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">PROJECT LOOP</span>
        </Link>
        <h2 className="text-xl font-bold text-white">Sign In to your Account</h2>
        <p className="text-xs text-slate-400">Multi-tenant AI Customer Feedback Intelligence Platform</p>
      </div>

      {/* 1-Click Role Logins Card */}
      <Card className="border-sky-500/30 bg-sky-950/20 shadow-xl">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Evaluator 1-Click Demo Login
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            Click any role button below to sign in instantly with seeded demo data:
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2.5">
          {[
            { role: 'owner', label: 'Owner Role', email: 'owner@loop.demo' },
            { role: 'admin', label: 'Admin Role', email: 'admin@loop.demo' },
            { role: 'analyst', label: 'Analyst Role', email: 'analyst@loop.demo' },
            { role: 'viewer', label: 'Viewer Role', email: 'viewer@loop.demo' },
          ].map((m) => (
            <Button
              key={m.role}
              variant="outline"
              size="sm"
              onClick={() => {
                loginAsDemoRole(m.role as UserRole);
                router.push('/dashboard');
              }}
              className="justify-start border-slate-800 bg-slate-900 text-xs text-slate-200 hover:border-sky-500 hover:bg-slate-800"
            >
              <Shield className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
              <span className="capitalize">{m.role} Login</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Standard Form */}
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-rose-950/60 p-3 text-xs text-rose-300 border border-rose-800">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-slate-800 bg-slate-950 text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-slate-800 bg-slate-950 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <Suspense fallback={<div className="text-slate-400 text-xs">Loading login portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
