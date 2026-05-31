import type { Metadata } from "next";
import { getRootSiteMetadata } from "@/lib/site-metadata";
import "./globals.css";
import "./public-polish.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getRootSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
