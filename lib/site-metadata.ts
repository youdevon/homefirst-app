import type { Metadata } from "next";
import { site } from "@/content/site";
import { getPublicSiteSettings } from "@/lib/site-settings-data";

export async function getRootSiteMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteName = settings.name || site.name;
  const description = settings.tagline || site.tagline;

  const metadata: Metadata = {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
  };

  if (settings.faviconUrl) {
    metadata.icons = {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
    };
  }

  return metadata;
}
