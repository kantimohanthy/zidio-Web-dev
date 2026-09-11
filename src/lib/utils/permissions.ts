import { UserRole } from '../supabase/types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  analyst: 2,
  viewer: 1,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageTeam(userRole: UserRole): boolean {
  return hasPermission(userRole, 'admin');
}

export function canManageSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, 'admin');
}

export function canImportFeedback(userRole: UserRole): boolean {
  return hasPermission(userRole, 'analyst');
}

export function canManageSources(userRole: UserRole): boolean {
  return hasPermission(userRole, 'admin');
}

export function canReprocessFeedback(userRole: UserRole): boolean {
  return hasPermission(userRole, 'admin');
}

export function canGenerateReports(userRole: UserRole): boolean {
  return hasPermission(userRole, 'analyst');
}

export function canDeleteData(userRole: UserRole): boolean {
  return userRole === 'owner';
}

export function canRemoveMember(
  actorRole: UserRole,
  target: UserRole | { role: UserRole },
  allMembers?: ({ role: UserRole } | UserRole)[]
): boolean {
  if (!canManageTeam(actorRole)) return false;
  const targetRole = typeof target === 'string' ? target : target.role;
  if (targetRole === 'owner') {
    if (actorRole !== 'owner') return false;
    if (allMembers) {
      const ownerCount = allMembers.filter(m => (typeof m === 'string' ? m : m.role) === 'owner').length;
      if (ownerCount <= 1) return false;
    }
  }
  return true;
}

export function canChangeMemberRole(
  actorRole: UserRole,
  target: UserRole | { role: UserRole },
  newRole: UserRole,
  allMembers?: ({ role: UserRole } | UserRole)[]
): boolean {
  if (!canManageTeam(actorRole)) return false;
  const targetRole = typeof target === 'string' ? target : target.role;
  if (targetRole === 'owner') {
    if (actorRole !== 'owner') return false;
    if (newRole !== 'owner' && allMembers) {
      const ownerCount = allMembers.filter(m => (typeof m === 'string' ? m : m.role) === 'owner').length;
      if (ownerCount <= 1) return false;
    }
  }
  return true;
}
