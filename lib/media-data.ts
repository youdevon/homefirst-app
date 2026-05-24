import { unlink } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import type { MediaCategory } from "@/lib/media-upload";
import { resolveSafeUploadFilePath } from "@/lib/media-upload";

export type EditableMediaFile = {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileUrl: string;
  altText: string;
  createdAt: Date;
  updatedAt: Date;
};

function mapDbMediaFile(file: {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileUrl: string;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
}): EditableMediaFile {
  return {
    id: file.id,
    fileName: file.fileName,
    originalName: file.originalName,
    fileType: file.fileType,
    fileUrl: file.fileUrl,
    altText: file.altText ?? "",
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

export async function getAllMediaFilesForAdmin(): Promise<EditableMediaFile[]> {
  const rows = await prisma.mediaFile.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map(mapDbMediaFile);
}

export async function createMediaFileRecord(input: {
  fileName: string;
  originalName: string;
  fileType: string;
  fileUrl: string;
  altText?: string;
}): Promise<void> {
  await prisma.mediaFile.create({
    data: {
      fileName: input.fileName,
      originalName: input.originalName,
      fileType: input.fileType,
      fileUrl: input.fileUrl,
      altText: input.altText || null,
    },
  });
}

export async function updateMediaFileAltText(
  id: string,
  altText: string,
): Promise<void> {
  const existing = await prisma.mediaFile.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Media file not found");
  }

  if (!existing.fileType.startsWith("image/")) {
    throw new Error("Alt text is only supported for images");
  }

  await prisma.mediaFile.update({
    where: { id },
    data: { altText: altText.trim() || null },
  });
}

export async function deleteMediaFile(id: string): Promise<void> {
  const existing = await prisma.mediaFile.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Media file not found");
  }

  const absolutePath = resolveSafeUploadFilePath(existing.fileUrl);

  if (absolutePath) {
    try {
      await unlink(absolutePath);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;

      if (code !== "ENOENT") {
        throw error;
      }
    }
  }

  await prisma.mediaFile.delete({ where: { id } });
}

export function isImageMediaFile(fileType: string): boolean {
  return fileType.startsWith("image/");
}

export function formatMediaDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type MediaSelectorOption = {
  fileUrl: string;
  label: string;
};

export type AdminMediaSelectorAssets = {
  imageFiles: MediaSelectorOption[];
  videoFiles: MediaSelectorOption[];
  documentFiles: MediaSelectorOption[];
};

export function toMediaSelectorOption(file: EditableMediaFile): MediaSelectorOption {
  return {
    fileUrl: file.fileUrl,
    label: file.originalName.trim() || file.fileName,
  };
}

export function getMediaFileCategory(file: EditableMediaFile): MediaCategory | null {
  if (file.fileType.startsWith("video/") || file.fileUrl.includes("/uploads/videos/")) {
    return "videos";
  }

  if (
    file.fileType.startsWith("application/") ||
    file.fileUrl.includes("/uploads/docs/")
  ) {
    return "docs";
  }

  if (isImageMediaFile(file.fileType) || file.fileUrl.includes("/uploads/images/")) {
    return "images";
  }

  return null;
}

export async function getAdminMediaSelectorAssets(): Promise<AdminMediaSelectorAssets> {
  const files = await getAllMediaFilesForAdmin();

  const imageFiles: MediaSelectorOption[] = [];
  const videoFiles: MediaSelectorOption[] = [];
  const documentFiles: MediaSelectorOption[] = [];

  for (const file of files) {
    const category = getMediaFileCategory(file);
    const option = toMediaSelectorOption(file);

    if (category === "images") {
      imageFiles.push(option);
    } else if (category === "videos") {
      videoFiles.push(option);
    } else if (category === "docs") {
      documentFiles.push(option);
    }
  }

  return { imageFiles, videoFiles, documentFiles };
}
