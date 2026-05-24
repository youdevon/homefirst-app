import AdminShell from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth/require-admin-session";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
