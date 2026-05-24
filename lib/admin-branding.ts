import { site } from "@/content/site";
import { getPublicSiteSettings } from "@/lib/site-settings-data";

export type AdminBranding = {
  name: string;
  adminTitle: string;
  tagline: string;
  logoUrl: string | null;
  crest: string;
};

function buildAdminBranding(input: {
  name: string;
  tagline: string;
  logoUrl: string | null;
  crest: string;
}): AdminBranding {
  return {
    name: input.name,
    adminTitle: `${input.name} Admin`,
    tagline: input.tagline,
    logoUrl: input.logoUrl,
    crest: input.crest,
  };
}

export function getAdminSubtitle(tagline: string): string {
  const trimmed = tagline.trim();
  return trimmed || "Content Management";
}

export async function getAdminBranding(): Promise<AdminBranding> {
  try {
    const settings = await getPublicSiteSettings();

    return buildAdminBranding({
      name: settings.name,
      tagline: settings.tagline,
      logoUrl: settings.logoUrl,
      crest: settings.crest,
    });
  } catch {
    return buildAdminBranding({
      name: site.name,
      tagline: site.tagline,
      logoUrl: null,
      crest: site.crest,
    });
  }
}
