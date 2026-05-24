import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import {
  saveEditableSiteSettings,
  type EditableSiteSettings,
} from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";

function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const host = request.headers.get("host") ?? "10.1.1.15:3002";
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

function redirectTo(request: NextRequest, path: string, status = 303) {
  return NextResponse.redirect(`${getBaseUrl(request)}${path}`, status);
}

function readFormField(formData: FormData, name: keyof EditableSiteSettings): string {
  return String(formData.get(name) ?? "").trim();
}

function parseSettings(formData: FormData): EditableSiteSettings {
  return {
    name: readFormField(formData, "name"),
    tagline: readFormField(formData, "tagline"),
    phone: readFormField(formData, "phone"),
    email: readFormField(formData, "email"),
    officeHours: readFormField(formData, "officeHours"),
    copyright: readFormField(formData, "copyright"),
    logoUrl: readFormField(formData, "logoUrl"),
  };
}

function isValidLogoUrl(logoUrl: string): boolean {
  if (!logoUrl) {
    return true;
  }

  return (
    logoUrl.startsWith("/") ||
    logoUrl.startsWith("http://") ||
    logoUrl.startsWith("https://")
  );
}

function isValidSettings(settings: EditableSiteSettings): boolean {
  return (
    Boolean(settings.name) &&
    Boolean(settings.tagline) &&
    Boolean(settings.phone) &&
    Boolean(settings.email) &&
    Boolean(settings.officeHours) &&
    Boolean(settings.copyright) &&
    settings.email.includes("@") &&
    isValidLogoUrl(settings.logoUrl)
  );
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  return NextResponse.json({
    cookiePresent: Boolean(token),
    sessionValid: Boolean(session),
    savedBy: session?.email ?? null,
  });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return redirectTo(request, "/admin/site-settings?error=session");
  }

  const formData = await request.formData();
  const settings = parseSettings(formData);

  if (!isValidSettings(settings)) {
    return redirectTo(request, "/admin/site-settings?error=validation");
  }

  try {
    await saveEditableSiteSettings(settings);
    return redirectTo(request, "/admin/site-settings?saved=1");
  } catch {
    return redirectTo(request, "/admin/site-settings?error=validation");
  }
}
