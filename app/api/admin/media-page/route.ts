import { NextRequest } from "next/server";
import { redirectTo, requireAdminSessionFromRequest } from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  MEDIA_PAGE_SECTION_KEYS,
  MEDIA_PAGE_SECTION_LABELS,
  MEDIA_PAGE_VISIBILITY_KEY,
  describeVisibilityChanges,
  getPageVisibility,
} from "@/lib/section-visibility";
import {
  isValidMediaPageContent,
  parseMediaPageFormData,
  parseMediaPageVisibilityFromFormData,
  saveEditableMediaPageContent,
} from "@/lib/media-page-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/media-page?error=session");
  }

  const formData = await request.formData();
  const previousVisibility = await getPageVisibility(
    MEDIA_PAGE_VISIBILITY_KEY,
    MEDIA_PAGE_SECTION_KEYS,
  );
  const content = parseMediaPageFormData(formData);
  const visibilityPartial = parseMediaPageVisibilityFromFormData(formData);

  if (!isValidMediaPageContent(content)) {
    return redirectTo(request, "/admin/media-page?error=validation");
  }

  try {
    const nextVisibility = await saveEditableMediaPageContent(
      content,
      visibilityPartial,
    );

    const visibilityChanges = describeVisibilityChanges(
      previousVisibility,
      nextVisibility,
      MEDIA_PAGE_SECTION_LABELS,
    );

    const description =
      visibilityChanges.length > 0
        ? `${session.name} ${visibilityChanges.join(" and ")}.`
        : `${session.name} updated Media page content.`;

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.MEDIA_PAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.MEDIA_PAGE,
      entityName: "Media Page",
      description,
    });

    return redirectTo(request, "/admin/media-page?saved=1");
  } catch {
    return redirectTo(request, "/admin/media-page?error=validation");
  }
}
