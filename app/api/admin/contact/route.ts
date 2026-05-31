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
  CONTACT_SECTION_KEYS,
  CONTACT_SECTION_LABELS,
  CONTACT_VISIBILITY_KEY,
  describeVisibilityChanges,
  getPageVisibility,
} from "@/lib/section-visibility";
import {
  isValidContactContent,
  parseContactFormData,
  parseContactVisibilityFromFormData,
  saveEditableContactContent,
} from "@/lib/contact-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/contact?error=session");
  }

  const formData = await request.formData();
  const previousVisibility = await getPageVisibility(
    CONTACT_VISIBILITY_KEY,
    CONTACT_SECTION_KEYS,
  );
  const content = parseContactFormData(formData);
  const visibilityPartial = parseContactVisibilityFromFormData(formData);

  if (!isValidContactContent(content)) {
    return redirectTo(request, "/admin/contact?error=validation");
  }

  try {
    const nextVisibility = await saveEditableContactContent(
      content,
      visibilityPartial,
    );

    const visibilityChanges = describeVisibilityChanges(
      previousVisibility,
      nextVisibility,
      CONTACT_SECTION_LABELS,
    );

    const description =
      visibilityChanges.length > 0
        ? `${session.name} ${visibilityChanges.join(" and ")}.`
        : `${session.name} updated Contact page content.`;

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.CONTACT_SAVED,
      entityType: AUDIT_ENTITY_TYPES.CONTACT_PAGE,
      entityName: "Contact Page",
      description,
    });

    return redirectTo(request, "/admin/contact?saved=1");
  } catch {
    return redirectTo(request, "/admin/contact?error=validation");
  }
}
