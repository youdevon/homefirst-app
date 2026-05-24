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
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/schemes?error=session");
  }

  const formData = await request.formData();
  const input = parseSchemeFormData(formData);

  if (!isValidSchemeInput(input)) {
    return redirectTo(request, `/admin/schemes/${id}/edit?error=validation`);
  }

  try {
    await updateScheme(id, input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.SCHEME_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.SCHEME,
      entityName: input.name,
      description: `${session.name} updated housing scheme: ${input.name}.`,
    });

    return redirectTo(request, "/admin/schemes?saved=1");
  } catch {
    return redirectTo(request, `/admin/schemes/${id}/edit?error=validation`);
  }
}
