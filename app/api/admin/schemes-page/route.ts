import { NextRequest } from "next/server";
import { redirectTo, requireAdminSessionFromRequest } from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  isValidSchemesPageContent,
  parseSchemesPageFormData,
  saveEditableSchemesPageContent,
} from "@/lib/schemes-page-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/schemes-page?error=session");
  }

  const formData = await request.formData();
  const content = parseSchemesPageFormData(formData);

  if (!isValidSchemesPageContent(content)) {
    return redirectTo(request, "/admin/schemes-page?error=validation");
  }

  try {
    await saveEditableSchemesPageContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.SCHEMES_PAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.SCHEMES_PAGE,
      entityName: "Housing Schemes Page",
      description: `${session.name} updated Housing Schemes page content.`,
    });

    return redirectTo(request, "/admin/schemes-page?saved=1");
  } catch {
    return redirectTo(request, "/admin/schemes-page?error=validation");
  }
}
