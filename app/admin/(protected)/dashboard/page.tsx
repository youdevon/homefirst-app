import Link from "next/link";
import { getAdminBranding } from "@/lib/admin-branding";
import { canManageUsers } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/session";

const contentDashboardCards = [
  {
    title: "Homepage Content",
    description: "Edit the homepage hero and CTA banner content.",
    href: "/admin/homepage",
    icon: "🏠",
  },
  {
    title: "Website Content",
    description: "Manage other homepage sections, about page copy, and page blocks.",
    href: "/admin/content",
    icon: "📄",
  },
  {
    title: "Media Library",
    description: "Upload and organize images, videos, and downloadable files.",
    href: "/admin/media",
    icon: "🖼",
  },
  {
    title: "Leaders",
    description: "Update leadership profiles shown on the about page.",
    href: "/admin/leaders",
    icon: "👥",
  },
  {
    title: "Housing Schemes",
    description: "Maintain scheme listings, status labels, and descriptions.",
    href: "/admin/schemes",
    icon: "🏠",
  },
  {
    title: "News & Notices",
    description: "Publish announcements, updates, and public notices.",
    href: "/admin/news",
    icon: "📰",
  },
  {
    title: "About Page",
    description: "Edit About page copy, images, highlights, and leadership header.",
    href: "/admin/about",
    icon: "ℹ️",
  },
  {
    title: "Contact Page",
    description: "Edit the public contact page hero, details, and quick-action cards.",
    href: "/admin/contact",
    icon: "📞",
  },
  {
    title: "Site Settings",
    description: "Edit contact details, footer links, and global site settings.",
    href: "/admin/site-settings",
    icon: "⚙",
  },
];

const adminOnlyDashboardCards = [
  {
    title: "User Management",
    description: "Create and manage admin and contributor backend accounts.",
    href: "/admin/users",
    icon: "👤",
    adminOnly: true,
  },
  {
    title: "Audit Logs",
    description: "Review who changed site content, media, and backend settings.",
    href: "/admin/audit",
    icon: "🧾",
    adminOnly: true,
  },
];

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

  const dashboardCards = [
    ...contentDashboardCards,
    ...(isAdmin ? adminOnlyDashboardCards : []),
  ];

  return (
    <div className="admin-page">
      <div className="admin-dashboard-welcome">
        <p className="admin-eyebrow">Welcome back</p>
        <h2 className="admin-dashboard-welcome-title">
          Hello, {firstName}
        </h2>
        <p className="admin-dashboard-welcome-text">
          Choose a section below to update public website content.
        </p>
      </div>

      {params.error === "access" ? (
        <div className="admin-alert admin-alert-error" role="alert">
          You do not have permission to access that admin area.
        </div>
      ) : null}

      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Admin Dashboard</p>
          <h1>Content Management</h1>
          <p className="admin-lead">
            Manage {branding.name} pages, media, schemes, news, and global site
            settings from one place.
          </p>
        </div>
      </div>

      <div className="admin-card-grid">
        {dashboardCards.map((card) => (
          <Link href={card.href} className="admin-card" key={card.href}>
            <div className="admin-card-icon-wrap">
              <span className="admin-card-icon">{card.icon}</span>
            </div>
            <div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span className="admin-card-link">Open section →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
