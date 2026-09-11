'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Organization, UserRole } from '../lib/supabase/types';
import { DEMO_ORG, DEMO_USERS } from '../lib/utils/mock-db';

interface AuthContextType {
  user: Profile | null;
  organization: Organization | null;
  role: UserRole;
  isLoading: boolean;
  loginAsDemoRole: (role: UserRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupUser: (name: string, email: string, pass: string, orgName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Owner role seeded user for initial demo readiness
  const [user, setUser] = useState<Profile | null>(DEMO_USERS[0].profile);
  const [organization, setOrganization] = useState<Organization | null>(DEMO_ORG);
  const [role, setRole] = useState<UserRole>('owner');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for saved session
    const savedUserStr = localStorage.getItem('loop_demo_user');
    const savedRoleStr = localStorage.getItem('loop_demo_role');

    if (savedUserStr && savedRoleStr) {
      try {
        setUser(JSON.parse(savedUserStr));
        setRole(savedRoleStr as UserRole);
      } catch {
        setUser(DEMO_USERS[0].profile);
        setRole('owner');
      }
    } else {
      // Default initial state
      setUser(DEMO_USERS[0].profile);
      setRole('owner');
    }
    setOrganization(DEMO_ORG);
    setIsLoading(false);
  }, []);

  const loginAsDemoRole = (targetRole: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === targetRole) || DEMO_USERS[0];
    setUser(demoUser.profile);
    setRole(demoUser.role);
    setOrganization(DEMO_ORG);
    localStorage.setItem('loop_demo_user', JSON.stringify(demoUser.profile));
    localStorage.setItem('loop_demo_role', demoUser.role);
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const matched = DEMO_USERS.find(u => u.profile.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched.profile);
      setRole(matched.role);
      setOrganization(DEMO_ORG);
      localStorage.setItem('loop_demo_user', JSON.stringify(matched.profile));
      localStorage.setItem('loop_demo_role', matched.role);
      setIsLoading(false);
      return true;
    }

    // Generic fallback login
    const customProfile: Profile = {
      id: `user_custom_${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(customProfile);
    setRole('owner');
    setOrganization(DEMO_ORG);
    localStorage.setItem('loop_demo_user', JSON.stringify(customProfile));
    localStorage.setItem('loop_demo_role', 'owner');
    setIsLoading(false);
    return true;
  };

  const signupUser = async (name: string, email: string, pass: string, orgName: string): Promise<boolean> => {
    setIsLoading(true);
    const customProfile: Profile = {
      id: `user_custom_${Date.now()}`,
      email,
      full_name: name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      plan: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(customProfile);
    setRole('owner');
    setOrganization(newOrg);
    localStorage.setItem('loop_demo_user', JSON.stringify(customProfile));
    localStorage.setItem('loop_demo_role', 'owner');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setRole('viewer');
    localStorage.removeItem('loop_demo_user');
    localStorage.removeItem('loop_demo_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        role,
        isLoading,
        loginAsDemoRole,
        loginWithEmail,
        signupUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
