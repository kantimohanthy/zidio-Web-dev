'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function SignupPage() {
  const router = useRouter();
  const { signupUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signupUser(name, email, password, orgName);
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-bold text-white shadow-lg shadow-sky-500/30">
              <Flame className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">PROJECT LOOP</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Create New Workspace Account</h2>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="mt-1 border-slate-800 bg-slate-950 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Work Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@company.com"
                  className="mt-1 border-slate-800 bg-slate-950 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp Intelligence"
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
                {isLoading ? 'Creating Workspace...' : 'Create Organization & Sign Up'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
