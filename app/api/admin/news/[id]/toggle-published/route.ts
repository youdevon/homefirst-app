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
import { getNewsItemById, setNewsItemPublished } from "@/lib/news-data";

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
  const published = String(formData.get("published") ?? "") === "true";
  const item = await getNewsItemById(id);

  if (!item) {
    return redirectTo(request, "/admin/news?error=validation");
  }

  try {
    await setNewsItemPublished(id, published);

    await logAuditEvent({
      actor: session,
      request,
      action: published ? AUDIT_ACTIONS.NEWS_PUBLISHED : AUDIT_ACTIONS.NEWS_UNPUBLISHED,
      entityType: AUDIT_ENTITY_TYPES.NEWS,
      entityName: item.title,
      description: `${session.name} ${published ? "published" : "unpublished"} news item: ${item.title}.`,
    });

    return redirectTo(request, "/admin/news?saved=1");
  } catch {
    return redirectTo(request, "/admin/news?error=validation");
  }
}
