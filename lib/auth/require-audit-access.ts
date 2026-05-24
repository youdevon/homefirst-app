import { redirect } from "next/navigation";
import { canViewAuditLogs } from "@/lib/auth/roles";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import type { AdminSession } from "@/lib/auth/session";

export async function requireAuditAccessSession(): Promise<AdminSession> {
  const session = await requireAdminSession();

  if (!canViewAuditLogs(session)) {
    redirect("/admin/dashboard?error=access");
  }

  return session;
}
