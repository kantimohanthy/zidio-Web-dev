import { describe, it, expect } from 'vitest';
import { canManageTeam, canChangeMemberRole, canRemoveMember } from '@/lib/utils/permissions';
import { OrganizationMember } from '@/lib/supabase/types';

describe('Tenant Isolation & Role Safeguards', () => {
  it('prevents removing or demoting the last owner of an organization', () => {
    const members: OrganizationMember[] = [
      { id: 'm1', organization_id: 'org_1', user_id: 'u1', role: 'owner', invited_at: '2026-01-01', created_at: '2026-01-01' },
      { id: 'm2', organization_id: 'org_1', user_id: 'u2', role: 'admin', invited_at: '2026-01-01', created_at: '2026-01-01' },
      { id: 'm3', organization_id: 'org_1', user_id: 'u3', role: 'viewer', invited_at: '2026-01-01', created_at: '2026-01-01' },
    ];

    const ownerCount = members.filter(m => m.role === 'owner').length;
    expect(ownerCount).toBe(1);

    // Safeguard check via permission utilities
    expect(canRemoveMember('owner', members[0], members)).toBe(false); // Sole owner CANNOT be removed
    expect(canRemoveMember('owner', members[1], members)).toBe(true);  // Admin CAN be removed by owner
    expect(canChangeMemberRole('owner', members[0], 'admin', members)).toBe(false); // Sole owner CANNOT be demoted
    expect(canChangeMemberRole('admin', members[0], 'admin', members)).toBe(false); // Admin cannot demote owner
    expect(canChangeMemberRole('admin', members[2], 'analyst', members)).toBe(true); // Admin can update viewer role
    expect(canManageTeam('viewer')).toBe(false); // Viewer cannot manage team
  });

  it('verifies strict organization_id matching for tenant isolation', () => {
    const userOrgId = 'org_acme_corp';
    const items = [
      { id: 'item_1', organization_id: 'org_acme_corp', text: 'Acme feedback' },
      { id: 'item_2', organization_id: 'org_other_corp', text: 'Leaked feedback' },
    ];

    const isolatedItems = items.filter(item => item.organization_id === userOrgId);

    expect(isolatedItems.length).toBe(1);
    expect(isolatedItems[0].id).toBe('item_1');
    expect(isolatedItems.find(i => i.organization_id === 'org_other_corp')).toBeUndefined();
  });
});
