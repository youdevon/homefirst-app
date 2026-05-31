import { NextRequest } from "next/server";
import { redirectTo, requireAdminSessionFromRequest } from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  SCHEMES_PAGE_SECTION_KEYS,
  SCHEMES_PAGE_SECTION_LABELS,
  SCHEMES_PAGE_VISIBILITY_KEY,
  describeVisibilityChanges,
  getPageVisibility,
} from "@/lib/section-visibility";
import {
  isValidSchemesPageContent,
  parseSchemesPageFormData,
  parseSchemesPageVisibilityFromFormData,
  saveEditableSchemesPageContent,
} from "@/lib/schemes-page-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/schemes-page?error=session");
  }

  const formData = await request.formData();
  const previousVisibility = await getPageVisibility(
    SCHEMES_PAGE_VISIBILITY_KEY,
    SCHEMES_PAGE_SECTION_KEYS,
  );
  const content = parseSchemesPageFormData(formData);
  const visibilityPartial = parseSchemesPageVisibilityFromFormData(formData);

  if (!isValidSchemesPageContent(content)) {
    return redirectTo(request, "/admin/schemes-page?error=validation");
  }

  try {
    const nextVisibility = await saveEditableSchemesPageContent(
      content,
      visibilityPartial,
    );

    const visibilityChanges = describeVisibilityChanges(
      previousVisibility,
      nextVisibility,
      SCHEMES_PAGE_SECTION_LABELS,
    );

    const description =
      visibilityChanges.length > 0
        ? `${session.name} ${visibilityChanges.join(" and ")}.`
        : `${session.name} updated Housing Schemes page content.`;

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.SCHEMES_PAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.SCHEMES_PAGE,
      entityName: "Housing Schemes Page",
      description,
    });

    return redirectTo(request, "/admin/schemes-page?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes-page?error=validation");
  }
}
