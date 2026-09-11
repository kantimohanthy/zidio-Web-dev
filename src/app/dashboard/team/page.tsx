'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/supabase/types';
import { DEMO_USERS } from '@/lib/utils/mock-db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Users, UserPlus, Shield, Trash2, Mail, Copy, Check } from 'lucide-react';
import { canManageTeam, canChangeMemberRole, canRemoveMember } from '@/lib/utils/permissions';

export default function TeamPage() {
  const { role: currentRole, user: currentUser } = useAuth();
  const [members, setMembers] = useState(DEMO_USERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('analyst');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    const target = members.find(m => m.profile.id === memberId);
    if (!target) return;
    if (!canChangeMemberRole(currentRole, target.role, newRole, members)) {
      alert('Protection Safeguard: Cannot demote or modify role.');
      return;
    }
    setMembers(prev => prev.map(m => m.profile.id === memberId ? { ...m, role: newRole } : m));
  };

  const handleRemoveMember = (memberId: string) => {
    const target = members.find(m => m.profile.id === memberId);
    if (!target) return;
    if (!canRemoveMember(currentRole, target.role, members)) {
      alert('Protection Safeguard: Cannot remove the final organization Owner.');
      return;
    }
    setMembers(prev => prev.filter(m => m.profile.id !== memberId));
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      profile: {
        id: `user_invited_${Date.now()}`,
        email: inviteEmail,
        full_name: inviteEmail.split('@')[0],
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      role: inviteRole,
      password: 'password123',
    };

    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://loop.app'}/signup?org=acme-corp`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center">
            <Users className="h-6 w-6 text-sky-500 mr-2" /> Team & Role Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage organization members, assign access permissions, and generate shareable invitations.
          </p>
        </div>

        {canManageTeam(currentRole) && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
          >
            <UserPlus className="h-4 w-4 mr-1.5" /> Invite Team Member
          </Button>
        )}
      </div>

      {/* Roster Table Card */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Organization Roster ({members.length} members)</CardTitle>
          <CardDescription>Server-side Role Based Access Control (RBAC) active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.profile.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={member.profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={member.profile.full_name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{member.profile.full_name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {canManageTeam(currentRole) ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.profile.id, e.target.value as UserRole)}
                      className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="analyst">Analyst</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <Badge variant="outline" className="capitalize text-xs font-semibold">
                      {member.role}
                    </Badge>
                  )}

                  {canManageTeam(currentRole) && (
                    <button
                      onClick={() => handleRemoveMember(member.profile.id)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shareable Invite Link Card */}
      <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Shareable Workspace Invitation Link</h4>
            <p className="text-xs text-slate-500 mt-0.5">Teammates joining through this link will automatically be assigned to Acme Corp Intelligence.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="text-xs bg-white"
          >
            {copiedLink ? <><Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Link Copied</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy Invite Link</>}
          </Button>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Teammate to Organization"
        maxWidth="sm"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. colleague@acme.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assign Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="admin">Admin (Manage team, sources, reports)</option>
              <option value="analyst">Analyst (Import feedback, run analytics, generate reports)</option>
              <option value="viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">Send Invitation</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
