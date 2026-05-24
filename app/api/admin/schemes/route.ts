import { NextRequest } from "next/server";
import {
  redirectTo,
  requireAdminSessionFromRequest,
} from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  createScheme,
  isValidSchemeInput,
  parseSchemeFormData,
} from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/schemes?error=session");
  }

  const formData = await request.formData();
  const input = parseSchemeFormData(formData);

  if (!isValidSchemeInput(input)) {
    return redirectTo(request, "/admin/schemes/new?error=validation");
  }

  try {
    await createScheme(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.SCHEME_CREATED,
      entityType: AUDIT_ENTITY_TYPES.SCHEME,
      entityName: input.name,
      description: `${session.name} created housing scheme: ${input.name}.`,
    });

    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes/new?error=validation");
  }
}
