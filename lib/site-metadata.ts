import type { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import { site } from "@/content/site";
import { getPublicSiteSettings } from "@/lib/site-settings-data";

function buildFaviconIcons(faviconUrl: string): NonNullable<Metadata["icons"]> {
  return {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  };
}

export async function getRootSiteMetadata(): Promise<Metadata> {
  unstable_noStore();

  const settings = await getPublicSiteSettings();
  const siteName = settings.name || site.name;
  const description = settings.tagline || site.tagline;
  const faviconUrl = settings.faviconUrl?.trim() || null;

  const metadata: Metadata = {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
  };

  if (faviconUrl) {
    metadata.icons = buildFaviconIcons(faviconUrl);
  }

  return metadata;
}
