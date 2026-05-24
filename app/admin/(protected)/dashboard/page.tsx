import Link from "next/link";

const dashboardCards = [
  {
    title: "Website Content",
    description: "Manage homepage sections, about page copy, and page blocks.",
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
    title: "Site Settings",
    description: "Edit contact details, footer links, and global site settings.",
    href: "/admin/site-settings",
    icon: "⚙",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Admin Dashboard</p>
          <h1>Content Management</h1>
          <p className="admin-lead">
            Choose a section below to manage website content. Full editing
            screens will be added in the next phase.
          </p>
        </div>
      </div>

      <div className="admin-card-grid">
        {dashboardCards.map((card) => (
          <Link href={card.href} className="admin-card" key={card.href}>
            <div className="admin-card-icon">{card.icon}</div>
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
