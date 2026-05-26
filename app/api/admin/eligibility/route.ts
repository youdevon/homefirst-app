import { NextRequest } from "next/server";
import { redirectTo, requireAdminSessionFromRequest } from "@/lib/admin-api";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  logAuditEvent,
} from "@/lib/audit-log";
import {
  isValidEligibilityPageContent,
  parseEligibilityPageFormData,
  saveEditableEligibilityPageContent,
} from "@/lib/eligibility-page-content-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/eligibility?error=session");
  }

  const formData = await request.formData();
  const content = parseEligibilityPageFormData(formData);

  if (!isValidEligibilityPageContent(content)) {
    return redirectTo(request, "/admin/eligibility?error=validation");
  }

  try {
    await saveEditableEligibilityPageContent(content);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.ELIGIBILITY_PAGE_SAVED,
      entityType: AUDIT_ENTITY_TYPES.ELIGIBILITY_PAGE,
      entityName: "Eligibility Page",
      description: `${session.name} updated Eligibility page content.`,
    });

    return redirectTo(request, "/admin/eligibility?saved=1");
  } catch {
    return redirectTo(request, "/admin/eligibility?error=validation");
  }
}
