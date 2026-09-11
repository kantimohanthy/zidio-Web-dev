'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, Shield, LogOut, ChevronDown, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/supabase/types';
import { Button } from '../ui/button';
import { GlobalSearch } from './global-search';

export function Header() {
  const { user, organization, role, loginAsDemoRole, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        {/* Left Section: Org Name & Global Search Trigger */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {organization?.name || 'Acme Corp Intelligence'}
            </h2>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {organization?.plan.toUpperCase() || 'ENTERPRISE'}
            </span>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search feedback, topics, reports...</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Evaluator Quick Role Switcher + User Profile Menu */}
        <div className="flex items-center space-x-3">
          {/* Quick Evaluator Role Switcher */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-1.5 border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
            >
              <Shield className="h-3.5 w-3.5 text-sky-600" />
              <span className="text-xs font-semibold">Demo Role: <span className="capitalize font-bold">{role}</span></span>
              <ChevronDown className="h-3 w-3" />
            </Button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-0">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Role (Evaluator Demo)
                </div>
                {(['owner', 'admin', 'analyst', 'viewer'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      loginAsDemoRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                      role === r
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="capitalize">{r}</span>
                    {role === r && <UserCheck className="h-3.5 w-3.5 text-sky-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 font-semibold text-white">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-0">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
