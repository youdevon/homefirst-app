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
import { getSchemeById, setSchemeActive } from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/schemes?error=session");
  }

  const formData = await request.formData();
  const active = String(formData.get("active") ?? "") === "true";
  const scheme = await getSchemeById(id);

  if (!scheme) {
    return redirectTo(request, "/admin/schemes?error=validation");
  }

  try {
    await setSchemeActive(id, active);

    await logAuditEvent({
      actor: session,
      request,
      action: active ? AUDIT_ACTIONS.SCHEME_ACTIVATED : AUDIT_ACTIONS.SCHEME_DEACTIVATED,
      entityType: AUDIT_ENTITY_TYPES.SCHEME,
      entityName: scheme.name,
      description: `${session.name} ${active ? "activated" : "deactivated"} housing scheme: ${scheme.name}.`,
    });

    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes?error=validation");
  }
}
