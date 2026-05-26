export type AdminNavItem = {
  label: string;
  href: string;
  description: string;
  icon: string;
  adminOnly?: boolean;
};

export type AdminNavGroup = {
  id: string;
  title: string;
  description: string;
  items: AdminNavItem[];
};

const globalSettings: AdminNavGroup = {
  id: "global",
  title: "Global Settings",
  description:
    "Header, footer, logo, contact details, and other settings that appear across the whole website.",
  items: [
    {
      label: "Site Settings",
      href: "/admin/site-settings",
      icon: "⚙",
      description:
        "Site name, logo, favicon, phone, email, office hours, social links, and footer copyright.",
    },
  ],
};

const pageContent: AdminNavGroup = {
  id: "pages",
  title: "Page Content",
  description:
    "Edit the main content shown on each public page. These editors do not change shared cards or records.",
  items: [
    {
      label: "Home Page",
      href: "/admin/homepage",
      icon: "🏠",
      description:
        "Homepage hero, slideshow images, quick actions area, video section, and homepage call-to-action.",
    },
    {
      label: "About Us Page",
      href: "/admin/about",
      icon: "ℹ️",
      description:
        "About page hero, who we are, vision, mission, highlights, images, and leadership section heading.",
    },
    {
      label: "Housing Schemes Page",
      href: "/admin/schemes-page",
      icon: "🏘",
      description:
        "Public /schemes page hero, intro text, supporting sections, and page call-to-action.",
    },
    {
      label: "Contact Page",
      href: "/admin/contact",
      icon: "📞",
      description:
        "Contact page hero, contact details section, cards, and instructions.",
    },
    {
      label: "Media Page",
      href: "/admin/media-page",
      icon: "📰",
      description:
        "Public /media page hero, intro text, and section wording.",
    },
    {
      label: "Eligibility Page",
      href: "/admin/eligibility",
      icon: "✅",
      description:
        "Eligibility page hero, who qualifies, requirements, documents, and call-to-action wording.",
    },
  ],
};

const sharedContent: AdminNavGroup = {
  id: "shared",
  title: "Shared Content",
  description:
    "Manage records used in more than one place. Changes here update cards and listings everywhere they appear.",
  items: [
    {
      label: "Leaders",
      href: "/admin/leaders",
      icon: "👥",
      description:
        "Leader profiles shown on the About page and anywhere else leaders are listed.",
    },
    {
      label: "Housing Schemes",
      href: "/admin/schemes",
      icon: "🏗",
      description:
        "Individual housing scheme cards used on the homepage preview, /schemes page, and related links.",
    },
    {
      label: "News & Notices",
      href: "/admin/news",
      icon: "📢",
      description:
        "News articles used on the homepage, /media page, article pages, and recent updates.",
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: "🖼",
      description:
        "Upload and manage images, videos, and documents for use across the website.",
    },
  ],
};

const administration: AdminNavGroup = {
  id: "administration",
  title: "Administration",
  description: "Backend account and activity management for administrators only.",
  items: [
    {
      label: "Users",
      href: "/admin/users",
      icon: "👤",
      description: "Create and manage admin and contributor accounts.",
      adminOnly: true,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit",
      icon: "🧾",
      description: "Review who changed site content, media, and settings.",
      adminOnly: true,
    },
  ],
};

export function getAdminNavGroups(isAdmin: boolean): AdminNavGroup[] {
  const groups = [globalSettings, pageContent, sharedContent];

  if (isAdmin) {
    groups.push(administration);
  }

  return groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || isAdmin),
  }));
}

export function getAdminDashboardGroups(isAdmin: boolean): AdminNavGroup[] {
  return getAdminNavGroups(isAdmin);
}
