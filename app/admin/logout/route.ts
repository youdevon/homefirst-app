import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function GET() {
  return NextResponse.redirect(new URL("/admin/dashboard", process.env.APP_URL));
}

export async function POST() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/admin/login", process.env.APP_URL), 303);
}
