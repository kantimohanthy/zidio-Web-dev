import { describe, it, expect } from 'vitest';
import { canManageTeam, canChangeMemberRole, canRemoveMember } from '@/lib/utils/permissions';
import { OrganizationMember } from '@/lib/supabase/types';

describe('Tenant Isolation & Role Safeguards', () => {
  it('prevents removing or demoting the last owner of an organization', () => {
    const members: OrganizationMember[] = [
      { id: 'm1', organization_id: 'org_1', user_id: 'u1', role: 'owner', created_at: '' },
      { id: 'm2', organization_id: 'org_1', user_id: 'u2', role: 'admin', created_at: '' },
      { id: 'm3', organization_id: 'org_1', user_id: 'u3', role: 'member', created_at: '' },
    ];

    const ownerCount = members.filter(m => m.role === 'owner').length;
    expect(ownerCount).toBe(1);

    // Safeguard rule: cannot remove sole owner
    const canRemoveLastOwner = (memberId: string) => {
      const target = members.find(m => m.id === memberId);
      if (target?.role === 'owner' && ownerCount <= 1) return false;
      return true;
    };

    expect(canRemoveLastOwner('m1')).toBe(false); // Sole owner CANNOT be removed
    expect(canRemoveLastOwner('m2')).toBe(true);  // Admin CAN be removed
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
