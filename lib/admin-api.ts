import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";

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

export async function requireAdminSessionFromRequest(
  request: NextRequest,
): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return Boolean(session);
}
