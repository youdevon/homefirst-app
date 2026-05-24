import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  createHomepageVideo,
  isValidHomepageVideoInput,
  parseHomepageVideoFormData,
} from "@/lib/homepage-videos-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/homepage/videos/new?error=session");
  }

  const formData = await request.formData();
  const input = parseHomepageVideoFormData(formData);

  if (!isValidHomepageVideoInput(input)) {
    return redirectTo(request, "/admin/homepage/videos/new?error=validation");
  }

  try {
    await createHomepageVideo(input);
    return redirectTo(request, "/admin/homepage?video_saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage/videos/new?error=validation");
  }
}
