import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  isValidLeaderInput,
  parseLeaderFormData,
  updateLeader,
} from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/leaders?error=session");
  }

  const formData = await request.formData();
  const input = parseLeaderFormData(formData);

  if (!isValidLeaderInput(input)) {
    return redirectTo(request, `/admin/leaders/${id}/edit?error=validation`);
  }

  try {
    await updateLeader(id, input);
    return redirectTo(request, "/admin/leaders?saved=1");
  } catch {
    return redirectTo(request, `/admin/leaders/${id}/edit?error=validation`);
  }
}
