import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  isValidNewsInput,
  parseNewsFormData,
  updateNewsItem,
} from "@/lib/news-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/news?error=session");
  }

  const formData = await request.formData();
  const input = parseNewsFormData(formData);

  if (!isValidNewsInput(input)) {
    return redirectTo(request, `/admin/news/${id}/edit?error=validation`);
  }

  try {
    await updateNewsItem(id, input);
    return redirectTo(request, "/admin/news?saved=1");
  } catch {
    return redirectTo(request, `/admin/news/${id}/edit?error=validation`);
  }
}
