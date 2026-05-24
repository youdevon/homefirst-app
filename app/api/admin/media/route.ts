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
import { createMediaFileRecord } from "@/lib/media-data";
import { saveUploadedMediaFile } from "@/lib/media-upload";

export const dynamic = "force-dynamic";

function getUploadErrorPath(error: string): string {
  switch (error) {
    case "missing-file":
      return "/admin/media?error=missing-file";
    case "invalid-type":
      return "/admin/media?error=invalid-type";
    case "too-large":
      return "/admin/media?error=too-large";
    default:
      return "/admin/media?error=upload";
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSessionFromRequest(request);

  if (!session) {
    return redirectTo(request, "/admin/media?error=session");
  }

  const formData = await request.formData();
  const fileEntry = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();

  if (!(fileEntry instanceof File)) {
    return redirectTo(request, "/admin/media?error=missing-file");
  }

  try {
    const savedFile = await saveUploadedMediaFile(fileEntry);

    await createMediaFileRecord({
      fileName: savedFile.fileName,
      originalName: savedFile.originalName,
      fileType: savedFile.fileType,
      fileUrl: savedFile.fileUrl,
      altText: savedFile.category === "images" ? altText : undefined,
    });

    await logAuditEvent({
      actor: session,
      request,
      action: AUDIT_ACTIONS.MEDIA_UPLOADED,
      entityType: AUDIT_ENTITY_TYPES.MEDIA,
      entityName: savedFile.originalName,
      description: `${session.name} uploaded media file ${savedFile.originalName}.`,
      metadata: { fileUrl: savedFile.fileUrl },
    });

    return redirectTo(request, "/admin/media?saved=1");
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload";

    if (
      message === "missing-file" ||
      message === "invalid-type" ||
      message === "too-large"
    ) {
      return redirectTo(request, getUploadErrorPath(message));
    }

    return redirectTo(request, "/admin/media?error=upload");
  }
}
