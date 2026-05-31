import { NextRequest } from "next/server";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import { redirectTo } from "@/lib/admin-api";
import { clearSessionCookie, getSessionFromRequest } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  return redirectTo(request, "/admin/dashboard");
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (session) {
    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.LOGOUT,
      entityType: AUDIT_ENTITY_TYPES.SESSION,
      entityName: session.name,
      description: `${session.name} logged out.`,
    });
  }

  await clearSessionCookie();
  return redirectTo(request, "/admin/login");
}
