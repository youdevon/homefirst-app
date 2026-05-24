import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken, type AdminSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const host = request.headers.get("host") ?? "10.1.1.15:3002";
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export function redirectTo(request: NextRequest, path: string, status = 303) {
  return NextResponse.redirect(`${getBaseUrl(request)}${path}`, status);
}

export async function getAdminSessionFromRequest(
  request: NextRequest,
): Promise<AdminSession | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function requireAdminSessionFromRequest(
  request: NextRequest,
): Promise<AdminSession | null> {
  return getAdminSessionFromRequest(request);
}

export async function requireAdminRoleFromRequest(
  request: NextRequest,
): Promise<AdminSession | null> {
  const session = await getAdminSessionFromRequest(request);

  if (!session || !isAdminRole(session.role)) {
    return null;
  }

  return session;
}
