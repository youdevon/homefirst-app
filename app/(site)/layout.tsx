import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicSiteSettings } from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();

  return (
    <div className="site-theme-root" data-theme-preset={settings.themePreset}>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
    </div>
  );
}
