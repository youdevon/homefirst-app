import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
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

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=session`);
  }

  const formData = await request.formData();
  const input = parseHomepageVideoFormData(formData);

  if (!isValidHomepageVideoInput(input)) {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=validation`);
  }

  try {
    await updateHomepageVideo(id, input);
    return redirectTo(request, "/admin/homepage?video_saved=1");
  } catch {
    return redirectTo(request, `/admin/homepage/videos/${id}/edit?error=validation`);
  }
}
