import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  createScheme,
  isValidSchemeInput,
  parseSchemeFormData,
} from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return redirectTo(request, "/admin/schemes?error=session");
  }

  const formData = await request.formData();
  const input = parseSchemeFormData(formData);

  if (!isValidSchemeInput(input)) {
    return redirectTo(request, "/admin/schemes/new?error=validation");
  }

  try {
    await createScheme(input);
    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes/new?error=validation");
  }
}
