import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken } from "@/lib/auth/session";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";
import { getBaseUrl } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  const baseUrl = getBaseUrl(request);

  if (!email || !password) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=missing`, 303);
  }

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user || !user.active) {
    await logAuditEvent({
      actor: { name: "Unknown", email, role: "Unknown" },
      request,
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      entityType: AUDIT_ENTITY_TYPES.SESSION,
      entityName: email,
      description: `Failed login attempt for ${email}.`,
    });

    return NextResponse.redirect(`${baseUrl}/admin/login?error=invalid`, 303);
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    await logAuditEvent({
      actor: { name: "Unknown", email, role: "Unknown" },
      request,
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      entityType: AUDIT_ENTITY_TYPES.SESSION,
      entityName: email,
      description: `Failed login attempt for ${email}.`,
    });

    return NextResponse.redirect(`${baseUrl}/admin/login?error=invalid`, 303);
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await logAuditEvent({
    actor: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    request,
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    entityType: AUDIT_ENTITY_TYPES.SESSION,
    entityName: user.name,
    description: `${user.name} logged in successfully.`,
  });

  const response = NextResponse.redirect(`${baseUrl}/admin/dashboard`, 303);

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
