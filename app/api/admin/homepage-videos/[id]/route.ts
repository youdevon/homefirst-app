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
  isValidHomepageVideoInput,
  parseHomepageVideoFormData,
  updateHomepageVideo,
} from "@/lib/homepage-videos-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=session`);
  }

  const formData = await request.formData();
  const input = parseHomepageVideoFormData(formData);

  if (!isValidHomepageVideoInput(input)) {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=validation`);
  }

  try {
    await updateHomepageVideo(id, input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_VIDEO_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE_VIDEO,
      entityName: input.title,
      description: `${session.name} updated homepage video: ${input.title}.`,
    });

    return redirectTo(request, "/admin/homepage?video_saved=1");
  } catch {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=validation`);
  }
}
