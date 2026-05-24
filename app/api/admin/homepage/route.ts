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
  isValidHomepageContent,
  parseHomepageFormData,
  saveEditableHomepageContent,
} from "@/lib/homepage-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/homepage?error=session");
  }

  const formData = await request.formData();
  const content = parseHomepageFormData(formData);

  if (!isValidHomepageContent(content)) {
    return redirectTo(request, "/admin/homepage?error=validation");
  }

  try {
    await saveEditableHomepageContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE,
      entityName: "Homepage Hero and CTA",
      description: `${session.name} updated homepage hero and CTA content.`,
    });

    return redirectTo(request, "/admin/homepage?saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage?error=validation");
  }
}
