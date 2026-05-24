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
  isValidNewsInput,
  parseNewsFormData,
  updateNewsItem,
} from "@/lib/news-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/news?error=session");
  }

  const formData = await request.formData();
  const input = parseNewsFormData(formData);

  if (!isValidNewsInput(input)) {
    return redirectTo(request, `/admin/news/${id}/edit?error=validation`);
  }

  try {
    await updateNewsItem(id, input);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.NEWS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.NEWS,
      entityName: input.title,
      description: `${session.name} updated news item: ${input.title}.`,
    });

    return redirectTo(request, "/admin/news?saved=1");
  } catch {
    return redirectTo(request, `/admin/news/${id}/edit?error=validation`);
  }
}
