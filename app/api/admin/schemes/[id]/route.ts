import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  isValidSchemeInput,
  parseSchemeFormData,
  updateScheme,
} from "@/lib/schemes-data";

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
  const input = parseSchemeFormData(formData);

  if (!isValidSchemeInput(input)) {
    return redirectTo(request, `/admin/schemes/${id}/edit?error=validation`);
  }

  try {
    await updateScheme(id, input);
    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, `/admin/schemes/${id}/edit?error=validation`);
  }
}
