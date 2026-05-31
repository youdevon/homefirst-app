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
import { getLeaderPersonTypeAuditLabel } from "@/lib/leader-person-type";
import {
  isValidLeaderInput,
  parseLeaderFormData,
  updateLeader,
} from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getLeaderEntityType(personType: "LEADER" | "BOARD") {
  return personType === "BOARD"
    ? AUDIT_ENTITY_TYPES.BOARD_MEMBER
    : AUDIT_ENTITY_TYPES.LEADER;
}

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

    const personLabel = getLeaderPersonTypeAuditLabel(input.personType);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.LEADER_UPDATED,
      entityType: getLeaderEntityType(input.personType),
      entityName: input.name,
      description: `${session.name} updated ${personLabel}: ${input.name}.`,
    });

    return redirectTo(
      request,
      `/admin/leaders?saved=1&type=${input.personType}`,
    );
  } catch {
    return redirectTo(request, `/admin/leaders/${id}/edit?error=validation`);
  }
}
