import NavbarClient from "@/components/NavbarClient";
import type { PublicSiteSettings } from "@/lib/site-settings-data";

type NavbarProps = {
  settings: PublicSiteSettings;
};

export default function Navbar({ settings }: NavbarProps) {
  return <NavbarClient settings={settings} />;
}
