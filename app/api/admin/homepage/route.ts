import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import {
  isValidHomepageContent,
  parseHomepageFormData,
  saveEditableHomepageContent,
} from "@/lib/homepage-content-data";

export const dynamic = "force-dynamic";

function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const host = request.headers.get("host") ?? "10.1.1.15:3002";
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

function redirectTo(request: NextRequest, path: string, status = 303) {
  return NextResponse.redirect(`${getBaseUrl(request)}${path}`, status);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return redirectTo(request, "/admin/homepage?error=session");
  }

  const formData = await request.formData();
  const content = parseHomepageFormData(formData);

  if (!isValidHomepageContent(content)) {
    return redirectTo(request, "/admin/homepage?error=validation");
  }

  try {
    await saveEditableHomepageContent(content);
    return redirectTo(request, "/admin/homepage?saved=1");
  } catch {
    return redirectTo(request, "/admin/homepage?error=validation");
  }
}
