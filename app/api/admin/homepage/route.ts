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
  HOME_SECTION_KEYS,
  HOME_SECTION_LABELS,
  HOME_VISIBILITY_KEY,
  describeVisibilityChanges,
  getPageVisibility,
} from "@/lib/section-visibility";
import {
  isValidHomepageContent,
  parseHomepageFormData,
  parseHomepageVisibilityFromFormData,
  saveEditableHomepageContent,
  getEditableHomepageContent,
} from "@/lib/homepage-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/homepage?error=session");
  }

  const formData = await request.formData();
  const previousVisibility = await getPageVisibility(
    HOME_VISIBILITY_KEY,
    HOME_SECTION_KEYS,
  );
  const content = parseHomepageFormData(formData);
  const visibilityPartial = parseHomepageVisibilityFromFormData(formData);

  if (!isValidHomepageContent(content)) {
    return redirectTo(request, "/admin/homepage?error=validation");
  }

  try {
    const previousContent = await getEditableHomepageContent();
    const nextVisibility = await saveEditableHomepageContent(
      content,
      visibilityPartial,
    );

    const visibilityChanges = describeVisibilityChanges(
      previousVisibility,
      nextVisibility,
      HOME_SECTION_LABELS,
    );

    const previousVideoCount = previousContent.hero.heroMedia.filter(
      (item) => item.active && item.type === "video" && item.url,
    ).length;
    const nextVideoCount = content.hero.heroMedia.filter(
      (item) => item.active && item.type === "video" && item.url,
    ).length;

    let description =
      visibilityChanges.length > 0
        ? `${session.name} ${visibilityChanges.join(" and ")}.`
        : `${session.name} updated homepage content.`;

    if (nextVideoCount > previousVideoCount) {
      description = `${session.name} added a video to the Homepage hero.`;
    } else if (
      JSON.stringify(previousContent.hero.heroMedia) !==
      JSON.stringify(content.hero.heroMedia)
    ) {
      description = `${session.name} updated Homepage hero media.`;
    }

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE,
      entityName: "Homepage",
      description,
    });

    return redirectTo(request, "/admin/homepage?saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage?error=validation");
  }
}
