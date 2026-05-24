import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import { updateMediaFileAltText } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/media?error=session");
  }

  const formData = await request.formData();
  const altText = String(formData.get("altText") ?? "").trim();

  try {
    await updateMediaFileAltText(id, altText);
    return redirectTo(request, "/admin/media?saved=1");
  } catch {
    return redirectTo(request, "/admin/media?error=validation");
  }
}
