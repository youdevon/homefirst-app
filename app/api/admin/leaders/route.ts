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
  createLeader,
  isValidLeaderInput,
  parseLeaderFormData,
} from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

function getLeaderEntityType(personType: "LEADER" | "BOARD") {
  return personType === "BOARD"
    ? AUDIT_ENTITY_TYPES.BOARD_MEMBER
    : AUDIT_ENTITY_TYPES.LEADER;
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/leaders?error=session");
  }

  const formData = await request.formData();
  const input = parseLeaderFormData(formData);

  if (!isValidLeaderInput(input)) {
    return redirectTo(
      request,
      `/admin/leaders/new?error=validation&type=${input.personType}`,
    );
  }

  try {
    await createLeader(input);

    const personLabel = getLeaderPersonTypeAuditLabel(input.personType);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.LEADER_CREATED,
      entityType: getLeaderEntityType(input.personType),
      entityName: input.name,
      description: `${session.name} added ${personLabel}: ${input.name}.`,
    });

    return redirectTo(
      request,
      `/admin/leaders?saved=1&type=${input.personType}`,
    );
  } catch {
    return redirectTo(
      request,
      `/admin/leaders/new?error=validation&type=${input.personType}`,
    );
  }
}
