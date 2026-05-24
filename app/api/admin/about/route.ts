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
  isValidAboutContent,
  parseAboutFormData,
  saveEditableAboutContent,
} from "@/lib/about-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/about?error=session");
  }

  const formData = await request.formData();
  const content = parseAboutFormData(formData);

  if (!isValidAboutContent(content)) {
    return redirectTo(request, "/admin/about?error=validation");
  }

  try {
    await saveEditableAboutContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.ABOUT_SAVED,
      entityType: AUDIT_ENTITY_TYPES.ABOUT_PAGE,
      entityName: "About Page",
      description: `${session.name} updated About page content.`,
    });

    return redirectTo(request, "/admin/about?saved=1");
  } catch {
    return redirectTo(request, "/admin/about?error=validation");
  }
}
