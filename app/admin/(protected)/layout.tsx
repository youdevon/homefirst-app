import AdminShell from "@/components/admin/AdminShell";
import { getAdminBranding } from "@/lib/admin-branding";
import { canManageUsers } from "@/lib/auth/roles";
import { requireAdminSession } from "@/lib/auth/require-admin-session";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, branding] = await Promise.all([
    requireAdminSession(),
    getAdminBranding(),
  ]);

  return (
    <AdminShell
      session={session}
      branding={branding}
      isAdmin={canManageUsers(session)}
    >
      {children}
    </AdminShell>
  );
}
