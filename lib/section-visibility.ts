import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SectionVisibilityMap = Record<string, boolean>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function defaultSectionVisibility(
  keys: readonly string[],
): SectionVisibilityMap {
  return Object.fromEntries(keys.map((key) => [key, true]));
}

export function parseVisibilityMetadata(
  metadata: unknown,
  keys: readonly string[],
): SectionVisibilityMap {
  const record = asRecord(metadata);
  const sections = asRecord(record.sections);
  const result = defaultSectionVisibility(keys);

  for (const key of keys) {
    const section = asRecord(sections[key]);
    if (typeof section.enabled === "boolean") {
      result[key] = section.enabled;
    } else if (typeof record[`show${key}`] === "boolean") {
      result[key] = record[`show${key}`] as boolean;
    }
  }

  return result;
}

export function buildVisibilityMetadata(
  visibility: SectionVisibilityMap,
): Prisma.InputJsonObject {
  const sections: Record<string, { enabled: boolean }> = {};

  for (const [key, enabled] of Object.entries(visibility)) {
    sections[key] = { enabled: Boolean(enabled) };
  }

  return { sections };
}

export function isSectionVisible(
  visibility: SectionVisibilityMap,
  key: string,
): boolean {
  return visibility[key] !== false;
}

export function readVisibilityCheckbox(
  formData: FormData,
  key: string,
): boolean {
  return formData.get(`visibility_${key}`) === "1";
}

export function parsePartialVisibilityFromFormData(
  formData: FormData,
  keys: readonly string[],
): Partial<SectionVisibilityMap> {
  const partial: Partial<SectionVisibilityMap> = {};

  for (const key of keys) {
    partial[key] = readVisibilityCheckbox(formData, key);
  }

  return partial;
}

export async function getPageVisibility(
  sectionKey: string,
  keys: readonly string[],
): Promise<SectionVisibilityMap> {
  try {
    const row = await prisma.pageContent.findUnique({
      where: { sectionKey },
    });

    return parseVisibilityMetadata(row?.metadata ?? null, keys);
  } catch {
    return defaultSectionVisibility(keys);
  }
}

export async function savePartialPageVisibility(
  sectionKey: string,
  allKeys: readonly string[],
  partial: Partial<SectionVisibilityMap>,
): Promise<SectionVisibilityMap> {
  const current = await getPageVisibility(sectionKey, allKeys);
  const merged: SectionVisibilityMap = { ...current };

  for (const [key, enabled] of Object.entries(partial)) {
    if (typeof enabled === "boolean") {
      merged[key] = enabled;
    }
  }

  await prisma.pageContent.upsert({
    where: { sectionKey },
    update: {
      metadata: buildVisibilityMetadata(merged),
    },
    create: {
      sectionKey,
      metadata: buildVisibilityMetadata(merged),
    },
  });

  return merged;
}

export function describeVisibilityChanges(
  previous: SectionVisibilityMap,
  next: SectionVisibilityMap,
  labels: Record<string, string>,
): string[] {
  const changes: string[] = [];

  for (const [key, label] of Object.entries(labels)) {
    const wasVisible = isSectionVisible(previous, key);
    const nowVisible = isSectionVisible(next, key);

    if (wasVisible === nowVisible) {
      continue;
    }

    changes.push(
      nowVisible ? `showed the ${label} section` : `hid the ${label} section`,
    );
  }

  return changes;
}

export const HOME_VISIBILITY_KEY = "home.visibility";

export const HOME_SECTION_KEYS = [
  "hero",
  "schemesPreview",
  "applicationSteps",
  "servicesPreview",
  "videoSection",
  "testimonials",
  "newsPreview",
  "cta",
  "contactStrip",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];
export type HomeSectionVisibility = Record<HomeSectionKey, boolean>;

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "Homepage Hero",
  schemesPreview: "Homepage Housing Schemes preview",
  applicationSteps: "Homepage Application Process",
  servicesPreview: "Homepage Services preview",
  videoSection: "Homepage Real Communities video",
  testimonials: "Homepage Testimonials",
  newsPreview: "Homepage Latest Updates",
  cta: "Homepage CTA / enquiry",
  contactStrip: "Homepage Contact strip",
};

export const HOME_VISIBILITY_FORM_KEYS = [
  "hero",
  "schemesPreview",
  "applicationSteps",
  "servicesPreview",
  "testimonials",
  "newsPreview",
  "cta",
  "contactStrip",
] as const satisfies readonly HomeSectionKey[];

export const ABOUT_VISIBILITY_KEY = "about.visibility";

export const ABOUT_SECTION_KEYS = [
  "hero",
  "intro",
  "visionMission",
  "highlights",
  "images",
  "leadership",
  "board",
] as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEYS)[number];
export type AboutSectionVisibility = Record<AboutSectionKey, boolean>;

export const ABOUT_SECTION_LABELS: Record<AboutSectionKey, string> = {
  hero: "About Hero",
  intro: "About Who We Are",
  visionMission: "About Vision and Mission",
  highlights: "About Highlights",
  images: "About Images",
  leadership: "About Our Leaders",
  board: "About Board of Directors",
};

export const SCHEMES_PAGE_VISIBILITY_KEY = "schemes.page.visibility";

export const SCHEMES_PAGE_SECTION_KEYS = [
  "hero",
  "listIntro",
  "schemeListing",
  "chooseSection",
  "cta",
] as const;

export type SchemesPageSectionKey = (typeof SCHEMES_PAGE_SECTION_KEYS)[number];
export type SchemesPageSectionVisibility = Record<SchemesPageSectionKey, boolean>;

export const SCHEMES_PAGE_SECTION_LABELS: Record<SchemesPageSectionKey, string> =
  {
    hero: "Housing Schemes page Hero",
    listIntro: "Housing Schemes page intro",
    schemeListing: "Housing Schemes listing",
    chooseSection: "Housing Schemes choosing guide",
    cta: "Housing Schemes page CTA",
  };

export const MEDIA_PAGE_VISIBILITY_KEY = "media.page.visibility";

export const MEDIA_PAGE_SECTION_KEYS = [
  "hero",
  "sectionIntro",
  "categoryFilter",
  "featuredArticle",
  "articleGrid",
] as const;

export type MediaPageSectionKey = (typeof MEDIA_PAGE_SECTION_KEYS)[number];
export type MediaPageSectionVisibility = Record<MediaPageSectionKey, boolean>;

export const MEDIA_PAGE_SECTION_LABELS: Record<MediaPageSectionKey, string> = {
  hero: "Media page Hero",
  sectionIntro: "Media page intro",
  categoryFilter: "Media page category filter",
  featuredArticle: "Media page featured article",
  articleGrid: "Media page article grid",
};

export const CONTACT_VISIBILITY_KEY = "contact.visibility";

export const CONTACT_SECTION_KEYS = [
  "hero",
  "contactDetails",
  "enquiryForm",
  "map",
  "contactCards",
] as const;

export type ContactSectionKey = (typeof CONTACT_SECTION_KEYS)[number];
export type ContactSectionVisibility = Record<ContactSectionKey, boolean>;

export const CONTACT_SECTION_LABELS: Record<ContactSectionKey, string> = {
  hero: "Contact Hero",
  contactDetails: "Contact details and instructions",
  enquiryForm: "Contact enquiry form",
  map: "Contact map / location",
  contactCards: "Contact quick cards",
};
