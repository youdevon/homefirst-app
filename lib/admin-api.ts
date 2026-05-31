import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken, type AdminSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

function configuredAppUrl(): string | null {
  const url =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  return url ? url.replace(/\/$/, "") : null;
}

export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host =
    forwardedHost?.split(",")[0]?.trim() ?? request.headers.get("host")?.trim();

  if (host) {
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";

    return `${protocol}://${host}`;
  }

  try {
    const origin = new URL(request.url).origin;
    if (origin && origin !== "null") {
      return origin;
    }
  } catch {
    // Fall through to configured URL.
  }

  return configuredAppUrl() ?? "http://localhost:3000";
}

export function getBaseUrl(request: NextRequest) {
  return getRequestOrigin(request);
}

export function redirectTo(request: NextRequest, path: string, status = 303) {
  return NextResponse.redirect(new URL(path, getRequestOrigin(request)), {
    status,
  });
}

export function resolveSafeAdminRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = "/admin/dashboard",
): string {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const trimmed = raw.trim();

  if (!trimmed.startsWith("/admin")) {
    return fallback;
  }

  if (trimmed.startsWith("//") || trimmed.includes("://")) {
    return fallback;
  }

  if (
    trimmed === "/admin/login" ||
    trimmed.startsWith("/admin/login?") ||
    trimmed === "/api/admin/login" ||
    trimmed.startsWith("/api/admin/login")
  ) {
    return fallback;
  }

  return trimmed;
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
