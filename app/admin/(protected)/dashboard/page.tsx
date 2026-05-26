import Link from "next/link";
import { getAdminBranding } from "@/lib/admin-branding";
import { getAdminDashboardGroups } from "@/lib/admin-navigation";
import { canManageUsers } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";

type AdminDashboardPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const [session, branding] = await Promise.all([
    getSession(),
    getAdminBranding(),
  ]);
  const firstName = session?.name.split(" ")[0] ?? "Admin";
  const isAdmin = session ? canManageUsers(session) : false;
  const groups = getAdminDashboardGroups(isAdmin);

  return (
    <div className="admin-page">
      <div className="admin-dashboard-welcome">
        <p className="admin-eyebrow">Welcome back</p>
        <h2 className="admin-dashboard-welcome-title">Hello, {firstName}</h2>
        <p className="admin-dashboard-welcome-text">
          Choose a section below to update the {branding.name} website. Global
          settings, page content, and shared records are grouped separately so
          you can find what you need quickly.
        </p>
      </div>

      {params.error === "access" ? (
        <div className="admin-alert admin-alert-error" role="alert">
          You do not have permission to access that admin area.
        </div>
      ) : null}

      {groups.map((group) => (
        <section className="admin-dashboard-group" key={group.id}>
          <div className="admin-dashboard-group-header">
            <h2>{group.title}</h2>
            <p>{group.description}</p>
          </div>

          <div className="admin-card-grid">
            {group.items.map((card) => (
              <Link href={card.href} className="admin-card" key={card.href}>
                <div className="admin-card-icon-wrap">
                  <span className="admin-card-icon">{card.icon}</span>
                </div>
                <div>
                  <h3>{card.label}</h3>
                  <p>{card.description}</p>
                  <span className="admin-card-link">Open section →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
