import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
