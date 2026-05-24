import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSessionFromRequest,
  redirectTo,
} from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  saveEditableSiteSettings,
  type EditableSiteSettings,
} from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";

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
  const session = await getAdminSessionFromRequest(request);

  return NextResponse.json({
    cookiePresent: Boolean(request.cookies.get("admin_session")?.value),
    sessionValid: Boolean(session),
    savedBy: session?.email ?? null,
  });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

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

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.SITE_SETTINGS_SAVED,
      entityType: AUDIT_ENTITY_TYPES.SITE_SETTINGS,
      entityName: settings.name,
      description: `${session.name} updated Site Settings.`,
      metadata: {
        siteName: settings.name,
        tagline: settings.tagline,
      },
    });

    return redirectTo(request, "/admin/site-settings?saved=1");
  } catch {
    return redirectTo(request, "/admin/site-settings?error=validation");
  }
}
