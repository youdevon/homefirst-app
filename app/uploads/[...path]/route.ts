import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: requestedPath } = await context.params;

  if (!requestedPath?.length) {
    return new NextResponse("File not found", { status: 404 });
  }

  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  const filePath = path.normalize(path.join(uploadsRoot, ...requestedPath));

  if (!filePath.startsWith(uploadsRoot)) {
    return new NextResponse("Invalid file path", { status: 400 });
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
