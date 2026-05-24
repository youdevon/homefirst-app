import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminRoleFromRequest,
} from "@/lib/admin-api";
import {
  canChangeAdminUserAccess,
  getAdminUserById,
  isValidAdminUserUpdateInput,
  parseAdminUserFormData,
  updateAdminUser,
} from "@/lib/admin-users-data";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import { formatAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminRoleFromRequest(request);

  if (!session) {
    return redirectTo(request, `/admin/users/${id}/edit?error=session`);
  }

  const existing = await getAdminUserById(id);

  if (!existing) {
    return redirectTo(request, "/admin/users?error=validation");
  }

  const formData = await request.formData();
  const input = parseAdminUserFormData(formData);
  const passwordChanged = input.password.trim().length > 0;

  if (!isValidAdminUserUpdateInput(input, false)) {
    return redirectTo(request, `/admin/users/${id}/edit?error=validation`);
  }

  const canChangeAccess = await canChangeAdminUserAccess(id, input.role, input.active);

  if (!canChangeAccess) {
    return redirectTo(request, `/admin/users/${id}/edit?error=last-admin`);
  }

  try {
    const updated = await updateAdminUser(id, input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.USER_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityName: updated.name,
      description: `${session.name} updated user account ${updated.name}.`,
      metadata: {
        userEmail: updated.email,
        role: updated.role,
        active: updated.active,
      },
    });

    if (existing.active !== updated.active) {
      await logAuditEvent({
        actor: session,
        request,
        action: updated.active
          ? AUDIT_ACTIONS.USER_ACTIVATED
          : AUDIT_ACTIONS.USER_DEACTIVATED,
        entityType: AUDIT_ENTITY_TYPES.USER,
        entityName: updated.name,
        description: `${session.name} ${updated.active ? "activated" : "deactivated"} user account ${updated.name}.`,
      });
    }

    if (passwordChanged) {
      await logAuditEvent({
        actor: session,
        request,
        action: AUDIT_ACTIONS.PASSWORD_RESET,
        entityType: AUDIT_ENTITY_TYPES.USER,
        entityName: updated.name,
        description: `${session.name} reset the password for ${updated.name}.`,
      });
    }

    return redirectTo(request, "/admin/users?saved=1");
  } catch {
    return redirectTo(request, `/admin/users/${id}/edit?error=validation`);
  }
}
