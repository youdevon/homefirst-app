import { redirect } from "next/navigation";
import { canManageUsers } from "@/lib/auth/roles";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import type { AdminSession } from "@/lib/auth/session";

export async function requireAdminRoleSession(): Promise<AdminSession> {
  const session = await requireAdminSession();

  if (!canManageUsers(session)) {
    redirect("/admin/dashboard?error=access");
  }

  return session;
}
