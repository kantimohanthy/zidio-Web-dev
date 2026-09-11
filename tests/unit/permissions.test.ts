import { describe, it, expect } from 'vitest';
import { canManageTeam, canManageSettings, canImportFeedback, canDeleteData } from '@/lib/utils/permissions';

describe('Role-Based Permissions Safeguards', () => {
  it('enforces owner role permissions strictly', () => {
    expect(canManageTeam('owner')).toBe(true);
    expect(canManageSettings('owner')).toBe(true);
    expect(canDeleteData('owner')).toBe(true);
  });

  it('restricts viewer role from administrative actions', () => {
    expect(canManageTeam('viewer')).toBe(false);
    expect(canManageSettings('viewer')).toBe(false);
    expect(canImportFeedback('viewer')).toBe(false);
    expect(canDeleteData('viewer')).toBe(false);
  });
});
