import Link from "next/link";
import type { AdminSession } from "@/lib/auth/session";

type AdminShellProps = {
  session: AdminSession;
  children: React.ReactNode;
};

export default function AdminShell({ session, children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin/dashboard" className="admin-brand">
            <span className="admin-brand-mark">⌂</span>
            <span>
              <strong>HomeFirst Admin</strong>
              <small>Content Management</small>
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
            <form method="post" action="/admin/logout">
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
