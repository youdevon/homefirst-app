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
import { getLeaderById, setLeaderActive } from "@/lib/leaders-data";

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
  const active = String(formData.get("active") ?? "") === "true";
  const leader = await getLeaderById(id);

  if (!leader) {
    return redirectTo(request, "/admin/leaders?error=validation");
  }

  try {
    await setLeaderActive(id, active);

    await logAuditEvent({
      actor: session,
      request,
      action: active ? AUDIT_ACTIONS.LEADER_ACTIVATED : AUDIT_ACTIONS.LEADER_DEACTIVATED,
      entityType: AUDIT_ENTITY_TYPES.LEADER,
      entityName: leader.name,
      description: `${session.name} ${active ? "activated" : "deactivated"} leader profile: ${leader.name}.`,
    });

    return redirectTo(request, "/admin/leaders?saved=1");
  } catch {
    return redirectTo(request, "/admin/leaders?error=validation");
  }
}
