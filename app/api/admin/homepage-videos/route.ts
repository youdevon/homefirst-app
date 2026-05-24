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
  createHomepageVideo,
  isValidHomepageVideoInput,
  parseHomepageVideoFormData,
} from "@/lib/homepage-videos-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/homepage/videos/new?error=session");
  }

  const formData = await request.formData();
  const input = parseHomepageVideoFormData(formData);

  if (!isValidHomepageVideoInput(input)) {
    return redirectTo(request, "/admin/homepage/videos/new?error=validation");
  }

  try {
    await createHomepageVideo(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.HOMEPAGE_VIDEO_CREATED,
      entityType: AUDIT_ENTITY_TYPES.HOMEPAGE_VIDEO,
      entityName: input.title,
      description: `${session.name} created homepage video: ${input.title}.`,
    });

    return redirectTo(request, "/admin/homepage?video_saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage/videos/new?error=validation");
  }
}
