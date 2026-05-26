"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminNavGroups } from "@/lib/admin-navigation";

type AdminNavProps = {
  isAdmin: boolean;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ isAdmin }: AdminNavProps) {
  const pathname = usePathname();
  const groups = getAdminNavGroups(isAdmin);

  return (
    <nav className="admin-nav" aria-label="Admin sections">
      <div className="admin-nav-inner">
        <Link
          href="/admin/dashboard"
          className={
            pathname === "/admin/dashboard"
              ? "admin-nav-dashboard active"
              : "admin-nav-dashboard"
          }
        >
          Dashboard
        </Link>

        {groups.map((group) => (
          <div className="admin-nav-group" key={group.id}>
            <span className="admin-nav-group-label">{group.title}</span>
            <div className="admin-nav-links">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActivePath(pathname, item.href)
                      ? "admin-nav-link active"
                      : "admin-nav-link"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
