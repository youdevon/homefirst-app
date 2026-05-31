import Link from "next/link";
import AdminBrandMark from "@/components/admin/AdminBrandMark";
import AdminNav from "@/components/admin/AdminNav";
import { getAdminSubtitle, type AdminBranding } from "@/lib/admin-branding";
import { formatAdminRole } from "@/lib/auth/roles";
import type { AdminSession } from "@/lib/auth/session";

type AdminShellProps = {
  session: AdminSession;
  branding: AdminBranding;
  isAdmin: boolean;
  children: React.ReactNode;
};

export default function AdminShell({
  session,
  branding,
  isAdmin,
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
              logoDisplayMode={branding.logoDisplayMode}
              variant="header"
            />
            {branding.logoDisplayMode === "icon-text" ? (
              <span>
                <strong>{branding.adminTitle}</strong>
                <small>{getAdminSubtitle(branding.tagline)}</small>
              </span>
            ) : null}
          </Link>

          <div className="admin-header-actions">
            <div className="admin-user-chip">
              <span>{session.name}</span>
              <small>{formatAdminRole(session.role)}</small>
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

      <AdminNav isAdmin={isAdmin} />

      <main className="admin-main">{children}</main>
    </div>
  );
}
