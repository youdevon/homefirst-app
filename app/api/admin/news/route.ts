import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  createNewsItem,
  isValidNewsInput,
  parseNewsFormData,
} from "@/lib/news-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/news?error=session");
  }

  const formData = await request.formData();
  const input = parseNewsFormData(formData);

  if (!isValidNewsInput(input)) {
    return redirectTo(request, "/admin/news/new?error=validation");
  }

  try {
    await createNewsItem(input);
    return redirectTo(request, "/admin/news?saved=1");
  } catch {
    return redirectTo(request, "/admin/news/new?error=validation");
  }
}
