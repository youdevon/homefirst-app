import { NextRequest, NextResponse } from "next/server";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import { getBaseUrl } from "@/lib/admin-api";
import { clearSessionCookie, getSessionFromRequest } from "@/lib/auth/session";

export async function GET() {
  return NextResponse.redirect(new URL("/admin/dashboard", process.env.APP_URL));
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
  return NextResponse.redirect(`${getBaseUrl(request)}/admin/login`, 303);
}
