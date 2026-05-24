import type { Metadata } from "next";
import { getAdminBranding } from "@/lib/admin-branding";
import "./admin.css";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getAdminBranding();

  return {
    title: {
      absolute: branding.adminTitle,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-root">{children}</div>;
}
