import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminRoleFromRequest,
} from "@/lib/admin-api";
import {
  createAdminUser,
  getAdminUserByEmail,
  isValidAdminUserCreateInput,
  parseAdminUserFormData,
} from "@/lib/admin-users-data";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import { formatAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminRoleFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/users/new?error=session");
  }

  const formData = await request.formData();
  const input = parseAdminUserFormData(formData);

  if (!isValidAdminUserCreateInput(input)) {
    return redirectTo(request, "/admin/users/new?error=validation");
  }

  const existing = await getAdminUserByEmail(input.email);

  if (existing) {
    return redirectTo(request, "/admin/users/new?error=validation");
  }

  try {
    const created = await createAdminUser(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.USER_CREATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityName: created.name,
      description: `${session.name} created user account ${created.name} (${formatAdminRole(created.role)}).`,
      metadata: { userEmail: created.email, role: created.role },
    });

    return redirectTo(request, "/admin/users?saved=1");
  } catch {
    return redirectTo(request, "/admin/users/new?error=validation");
  }
}
