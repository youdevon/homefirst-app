import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type MediaCategory = "images" | "videos" | "docs";

type MediaRule = {
  category: MediaCategory;
  extensions: string[];
  mimeTypes: string[];
  maxBytes: number;
};

export const MEDIA_RULES: MediaRule[] = [
  {
    category: "images",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 10 * 1024 * 1024,
  },
  {
    category: "videos",
    extensions: [".mp4", ".webm"],
    mimeTypes: ["video/mp4", "video/webm"],
    maxBytes: 50 * 1024 * 1024,
  },
  {
    category: "docs",
    extensions: [".pdf", ".doc", ".docx"],
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxBytes: 20 * 1024 * 1024,
  },
];

export type SavedMediaFile = {
  fileName: string;
  originalName: string;
  fileType: string;
  fileUrl: string;
  category: MediaCategory;
};

export type MediaUploadValidationError =
  | "missing-file"
  | "invalid-type"
  | "too-large"
  | "save-failed";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function getExtension(fileName: string): string {
  return path.extname(fileName).toLowerCase();
}

const FALLBACK_MIME_TYPES = ["application/octet-stream", "binary/octet-stream"];

function findMediaRule(fileName: string, mimeType: string): MediaRule | null {
  const extension = getExtension(fileName);
  const rule = MEDIA_RULES.find((entry) => entry.extensions.includes(extension));

  if (!rule) {
    return null;
  }

  if (!mimeType || rule.mimeTypes.includes(mimeType)) {
    return rule;
  }

  if (FALLBACK_MIME_TYPES.includes(mimeType)) {
    return rule;
  }

  return null;
}

export function createStoredFileName(originalName: string): string {
  const extension = getExtension(originalName);
  const baseName = path
    .basename(originalName, extension)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

  const safeBase = baseName || "file";
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${safeBase}-${uniqueSuffix}${extension}`;
}

export function validateUploadedFile(
  file: File,
): { ok: true; rule: MediaRule } | { ok: false; error: MediaUploadValidationError } {
  if (!file || file.size === 0) {
    return { ok: false, error: "missing-file" };
  }

  const rule = findMediaRule(file.name, file.type);

  if (!rule) {
    return { ok: false, error: "invalid-type" };
  }

  if (file.size > rule.maxBytes) {
    return { ok: false, error: "too-large" };
  }

  return { ok: true, rule };
}

export async function saveUploadedMediaFile(file: File): Promise<SavedMediaFile> {
  const validation = validateUploadedFile(file);

  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const { rule } = validation;
  const fileName = createStoredFileName(file.name);
  const categoryDir = path.join(UPLOAD_ROOT, rule.category);

  await mkdir(categoryDir, { recursive: true });

  const absolutePath = path.join(categoryDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, buffer);

  return {
    fileName,
    originalName: file.name,
    fileType: file.type || rule.mimeTypes[0],
    fileUrl: `/uploads/${rule.category}/${fileName}`,
    category: rule.category,
  };
}

export function getUploadRootPath(): string {
  return UPLOAD_ROOT;
}

const ALLOWED_UPLOAD_CATEGORIES = new Set<MediaCategory>([
  "images",
  "videos",
  "docs",
]);

export function resolveSafeUploadFilePath(fileUrl: string): string | null {
  if (!fileUrl.startsWith("/uploads/")) {
    return null;
  }

  const relativePath = fileUrl.slice("/uploads/".length);
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.length !== 2) {
    return null;
  }

  const [category, fileName] = segments;

  if (!ALLOWED_UPLOAD_CATEGORIES.has(category as MediaCategory)) {
    return null;
  }

  if (
    fileName === "." ||
    fileName === ".." ||
    fileName.includes("/") ||
    fileName.includes("\\")
  ) {
    return null;
  }

  const absolutePath = path.normalize(path.join(UPLOAD_ROOT, category, fileName));
  const uploadsRootWithSep = `${UPLOAD_ROOT}${path.sep}`;

  if (
    absolutePath !== UPLOAD_ROOT &&
    !absolutePath.startsWith(uploadsRootWithSep)
  ) {
    return null;
  }

  return absolutePath;
}
