import type { AdminSession } from "@/lib/auth/session";

export const ADMIN_ROLE = "ADMIN";
export const CONTRIBUTOR_ROLE = "CONTRIBUTOR";

export const ADMIN_USER_ROLES = [ADMIN_ROLE, CONTRIBUTOR_ROLE] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export function isAdminRole(role: string): role is typeof ADMIN_ROLE {
  return role === ADMIN_ROLE;
}

export function isContributorRole(role: string): role is typeof CONTRIBUTOR_ROLE {
  return role === CONTRIBUTOR_ROLE;
}

export function formatAdminRole(role: string): string {
  if (role === ADMIN_ROLE) {
    return "Admin";
  }

  if (role === CONTRIBUTOR_ROLE) {
    return "Contributor";
  }

  return role;
}

export function canManageUsers(session: AdminSession): boolean {
  return isAdminRole(session.role);
}

export function canViewAuditLogs(session: AdminSession): boolean {
  return isAdminRole(session.role);
}

export function isValidAdminUserRole(role: string): role is AdminUserRole {
  return ADMIN_USER_ROLES.includes(role as AdminUserRole);
}
