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
  isValidContactContent,
  parseContactFormData,
  saveEditableContactContent,
} from "@/lib/contact-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/contact?error=session");
  }

  const formData = await request.formData();
  const content = parseContactFormData(formData);

  if (!isValidContactContent(content)) {
    return redirectTo(request, "/admin/contact?error=validation");
  }

  try {
    await saveEditableContactContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.CONTACT_SAVED,
      entityType: AUDIT_ENTITY_TYPES.CONTACT_PAGE,
      entityName: "Contact Page",
      description: `${session.name} updated Contact page content.`,
    });

    return redirectTo(request, "/admin/contact?saved=1");
  } catch {
    return redirectTo(request, "/admin/contact?error=validation");
  }
}
