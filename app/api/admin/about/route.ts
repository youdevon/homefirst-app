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
  ABOUT_SECTION_KEYS,
  ABOUT_SECTION_LABELS,
  ABOUT_VISIBILITY_KEY,
  describeVisibilityChanges,
  getPageVisibility,
} from "@/lib/section-visibility";
import {
  isValidAboutContent,
  parseAboutFormData,
  parseAboutVisibilityFromFormData,
  saveEditableAboutContent,
} from "@/lib/about-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/about?error=session");
  }

  const formData = await request.formData();
  const previousVisibility = await getPageVisibility(
    ABOUT_VISIBILITY_KEY,
    ABOUT_SECTION_KEYS,
  );
  const content = parseAboutFormData(formData);
  const visibilityPartial = parseAboutVisibilityFromFormData(formData);

  if (!isValidAboutContent(content)) {
    return redirectTo(request, "/admin/about?error=validation");
  }

  try {
    const nextVisibility = await saveEditableAboutContent(
      content,
      visibilityPartial,
    );

    const visibilityChanges = describeVisibilityChanges(
      previousVisibility,
      nextVisibility,
      ABOUT_SECTION_LABELS,
    );

    const description =
      visibilityChanges.length > 0
        ? `${session.name} ${visibilityChanges.join(" and ")}.`
        : `${session.name} updated About page content.`;

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.ABOUT_SAVED,
      entityType: AUDIT_ENTITY_TYPES.ABOUT_PAGE,
      entityName: "About Page",
      description,
    });

    return redirectTo(request, "/admin/about?saved=1");
  } catch {
    return redirectTo(request, "/admin/about?error=validation");
  }
}
