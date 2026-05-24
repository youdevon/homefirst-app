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
  getHomepageVideoById,
  setHomepageVideoFeatured,
} from "@/lib/homepage-videos-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/homepage?error=session");
  }

  const video = await getHomepageVideoById(id);

  if (!video) {
    return redirectTo(request, "/admin/homepage?error=validation");
  }

  try {
    await setHomepageVideoFeatured(id);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_VIDEO_FEATURED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE_VIDEO,
      entityName: video.title,
      description: `${session.name} set ${video.title} as the featured homepage video.`,
    });

    return redirectTo(request, "/admin/homepage?video_saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage?error=validation");
  }
}
