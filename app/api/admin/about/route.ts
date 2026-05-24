import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  isValidAboutContent,
  parseAboutFormData,
  saveEditableAboutContent,
} from "@/lib/about-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/about?error=session");
  }

  const formData = await request.formData();
  const content = parseAboutFormData(formData);

  if (!isValidAboutContent(content)) {
    return redirectTo(request, "/admin/about?error=validation");
  }

  try {
    await saveEditableAboutContent(content);
    return redirectTo(request, "/admin/about?saved=1");
  } catch {
    return redirectTo(request, "/admin/about?error=validation");
  }
}
