import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import { deleteMediaFile } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/media?error=session");
  }

  try {
    await deleteMediaFile(id);
    return redirectTo(request, "/admin/media?deleted=1");
  } catch {
    return redirectTo(request, "/admin/media?error=delete");
  }
}
