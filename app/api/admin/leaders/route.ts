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
  createLeader,
  isValidLeaderInput,
  parseLeaderFormData,
} from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/leaders?error=session");
  }

  const formData = await request.formData();
  const input = parseLeaderFormData(formData);

  if (!isValidLeaderInput(input)) {
    return redirectTo(request, "/admin/leaders/new?error=validation");
  }

  try {
    await createLeader(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.LEADER_CREATED,
      entityType: AUDIT_ENTITY_TYPES.LEADER,
      entityName: input.name,
      description: `${session.name} created leader profile: ${input.name}.`,
    });

    return redirectTo(request, "/admin/leaders?saved=1");
  } catch {
    return redirectTo(request, "/admin/leaders/new?error=validation");
  }
}
