import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import { setSchemeActive } from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/schemes?error=session");
  }

  const formData = await request.formData();
  const active = String(formData.get("active") ?? "") === "true";

  try {
    await setSchemeActive(id, active);
    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes?error=validation");
  }
}
