import Link from "next/link";
import AdminBrandMark from "@/components/admin/AdminBrandMark";
import { getAdminSubtitle, type AdminBranding } from "@/lib/admin-branding";
import type { AdminSession } from "@/lib/auth/session";

type AdminShellProps = {
  session: AdminSession;
  branding: AdminBranding;
  children: React.ReactNode;
};

export default function AdminShell({
  session,
  branding,
  children,
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin/dashboard" className="admin-brand">
            <AdminBrandMark
              logoUrl={branding.logoUrl}
              crest={branding.crest}
              variant="header"
            />
            <span>
              <strong>{branding.adminTitle}</strong>
              <small>{getAdminSubtitle(branding.tagline)}</small>
            </span>
          </Link>

          <div className="admin-header-actions">
            <div className="admin-user-chip">
              <span>{session.name}</span>
              <small>{session.role}</small>
            </div>
            <Link href="/" className="admin-btn admin-btn-ghost">
              View Site
            </Link>
            <form method="post" action="/admin/logout" className="admin-logout-form">
              <button type="submit" className="admin-btn admin-btn-secondary">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="admin-main">{children}</main>
    </div>
  );
}
