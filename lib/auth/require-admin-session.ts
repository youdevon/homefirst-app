import { redirect } from "next/navigation";
import { getSession, type AdminSession } from "@/lib/auth/session";

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
