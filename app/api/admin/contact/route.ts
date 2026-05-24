import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  isValidContactContent,
  parseContactFormData,
  saveEditableContactContent,
} from "@/lib/contact-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/contact?error=session");
  }

  const formData = await request.formData();
  const content = parseContactFormData(formData);

  if (!isValidContactContent(content)) {
    return redirectTo(request, "/admin/contact?error=validation");
  }

  try {
    await saveEditableContactContent(content);
    return redirectTo(request, "/admin/contact?saved=1");
  } catch {
    return redirectTo(request, "/admin/contact?error=validation");
  }
}
