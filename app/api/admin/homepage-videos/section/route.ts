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
import {
  isValidVideoSectionHeader,
  parseVideoSectionHeaderFormData,
  saveVideoSectionHeader,
} from "@/lib/homepage-videos-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/homepage?error=session");
  }

  const formData = await request.formData();
  const input = parseVideoSectionHeaderFormData(formData);

  if (!isValidVideoSectionHeader(input)) {
    return redirectTo(request, "/admin/homepage?error=videos-section");
  }

  try {
    await saveVideoSectionHeader(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_VIDEO_SECTION_SAVED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE_VIDEO,
      entityName: "Real Communities Videos",
      description: `${session.name} updated Real Communities video section header.`,
    });

    return redirectTo(request, "/admin/homepage?videos_section_saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage?error=videos-section");
  }
}
