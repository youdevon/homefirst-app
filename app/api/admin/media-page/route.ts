import { NextRequest } from "next/server";
import { redirectTo, requireAdminSessionFromRequest } from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  isValidMediaPageContent,
  parseMediaPageFormData,
  saveEditableMediaPageContent,
} from "@/lib/media-page-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/media-page?error=session");
  }

  const formData = await request.formData();
  const content = parseMediaPageFormData(formData);

  if (!isValidMediaPageContent(content)) {
    return redirectTo(request, "/admin/media-page?error=validation");
  }

  try {
    await saveEditableMediaPageContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.MEDIA_PAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.MEDIA_PAGE,
      entityName: "Media Page",
      description: `${session.name} updated Media page content.`,
    });

    return redirectTo(request, "/admin/media-page?saved=1");
  } catch {
    return redirectTo(request, "/admin/media-page?error=validation");
  }
}
