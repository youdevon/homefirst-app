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
import { deleteMediaFile, getMediaFileById } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/media?error=session");
  }

  const mediaFile = await getMediaFileById(id);

  if (!mediaFile) {
    return redirectTo(request, "/admin/media?error=delete");
  }

  try {
    await deleteMediaFile(id);

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.MEDIA_DELETED,
      entityType: AUDIT_ENTITY_TYPES.MEDIA,
      entityName: mediaFile.originalName,
      description: `${session.name} deleted media file ${mediaFile.originalName}.`,
      metadata: { fileUrl: mediaFile.fileUrl },
    });

    return redirectTo(request, "/admin/media?deleted=1");
  } catch {
    return redirectTo(request, "/admin/media?error=delete");
  }
}
