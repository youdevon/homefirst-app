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
  createNewsItem,
  isValidNewsInput,
  parseNewsFormData,
} from "@/lib/news-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/news?error=session");
  }

  const formData = await request.formData();
  const input = parseNewsFormData(formData);

  if (!isValidNewsInput(input)) {
    return redirectTo(request, "/admin/news/new?error=validation");
  }

  try {
    await createNewsItem(input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.NEWS_CREATED,
      entityType: AUDIT_ENTITY_TYPES.NEWS,
      entityName: input.title,
      description: `${session.name} created news item: ${input.title}.`,
    });

    return redirectTo(request, "/admin/news?saved=1");
  } catch {
    return redirectTo(request, "/admin/news/new?error=validation");
  }
}
