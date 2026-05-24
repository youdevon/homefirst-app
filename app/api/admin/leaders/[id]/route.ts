import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  getLeaderById,
  isValidLeaderInput,
  parseLeaderFormData,
  updateLeader,
} from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/leaders?error=session");
  }

  const formData = await request.formData();
  const input = parseLeaderFormData(formData);

  if (!isValidLeaderInput(input)) {
    return redirectTo(request, `/admin/leaders/${id}/edit?error=validation`);
  }

  try {
    await updateLeader(id, input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.LEADER_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.LEADER,
      entityName: input.name,
      description: `${session.name} updated leader profile: ${input.name}.`,
    });

    return redirectTo(request, "/admin/leaders?saved=1");
  } catch {
    return redirectTo(request, `/admin/leaders/${id}/edit?error=validation`);
  }
}
