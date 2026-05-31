import { mediaPage } from "@/content/news";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  MEDIA_PAGE_SECTION_KEYS,
  MEDIA_PAGE_VISIBILITY_KEY,
  getPageVisibility,
  parsePartialVisibilityFromFormData,
  savePartialPageVisibility,
  type MediaPageSectionVisibility,
} from "@/lib/section-visibility";

export const MEDIA_PAGE_SECTION_KEY = "media.page";

export type EditableMediaPageContent = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  backgroundImageUrl: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionHighlightedTitle: string;
  sectionLead: string;
};

export type MediaPageContentFields = EditableMediaPageContent;

export type PublicMediaPageContent = EditableMediaPageContent & {
  visibility: MediaPageSectionVisibility;
};

export {
  MEDIA_PAGE_VISIBILITY_KEY,
  MEDIA_PAGE_SECTION_KEYS,
  MEDIA_PAGE_SECTION_LABELS,
} from "@/lib/section-visibility";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function getDefaultMediaPageContent(): EditableMediaPageContent {
  return {
    eyebrow: mediaPage.eyebrow,
    title: mediaPage.title,
    highlightedTitle: mediaPage.titleEmphasis,
    description: mediaPage.description,
    backgroundImageUrl: mediaPage.heroBackground,
    sectionEyebrow: "Latest Updates",
    sectionTitle: "Browse",
    sectionHighlightedTitle: "Articles",
    sectionLead:
      "Filter by category to find notices, news, events, and press releases.",
  };
}

function parseMediaPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableMediaPageContent,
): EditableMediaPageContent {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const section = asRecord(metadata.section);

  return {
    eyebrow: asString(metadata.eyebrow, defaults.eyebrow),
    title: asString(row.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle,
      defaults.highlightedTitle,
    ),
    description: asString(row.subtitle, defaults.description),
    backgroundImageUrl: asString(row.imageUrl, defaults.backgroundImageUrl),
    sectionEyebrow: asString(section.eyebrow, defaults.sectionEyebrow),
    sectionTitle: asString(section.title, defaults.sectionTitle),
    sectionHighlightedTitle: asString(
      section.highlightedTitle,
      defaults.sectionHighlightedTitle,
    ),
    sectionLead: asString(section.lead, defaults.sectionLead),
  };
}

export async function getEditableMediaPageContent(): Promise<EditableMediaPageContent> {
  const defaults = getDefaultMediaPageContent();
  const row = await prisma.pageContent.findUnique({
    where: { sectionKey: MEDIA_PAGE_SECTION_KEY },
  });

  return parseMediaPageContent(row, defaults);
}

export async function getPublicMediaPageContent(): Promise<PublicMediaPageContent> {
  try {
    const [content, visibility] = await Promise.all([
      getEditableMediaPageContent(),
      getPageVisibility(MEDIA_PAGE_VISIBILITY_KEY, MEDIA_PAGE_SECTION_KEYS),
    ]);

    return {
      ...content,
      visibility: visibility as MediaPageSectionVisibility,
    };
  } catch {
    return {
      ...getDefaultMediaPageContent(),
      visibility: Object.fromEntries(
        MEDIA_PAGE_SECTION_KEYS.map((key) => [key, true]),
      ) as MediaPageSectionVisibility,
    };
  }
}

export async function saveEditableMediaPageContent(
  input: MediaPageContentFields,
  visibilityPartial: Partial<MediaPageSectionVisibility>,
): Promise<MediaPageSectionVisibility> {
  await prisma.pageContent.upsert({
    where: { sectionKey: MEDIA_PAGE_SECTION_KEY },
    update: {
      title: input.title.trim(),
      subtitle: input.description.trim(),
      imageUrl: input.backgroundImageUrl.trim(),
      metadata: {
        eyebrow: input.eyebrow.trim(),
        highlightedTitle: input.highlightedTitle.trim(),
        section: {
          eyebrow: input.sectionEyebrow.trim(),
          title: input.sectionTitle.trim(),
          highlightedTitle: input.sectionHighlightedTitle.trim(),
          lead: input.sectionLead.trim(),
        },
      },
    },
    create: {
      sectionKey: MEDIA_PAGE_SECTION_KEY,
      title: input.title.trim(),
      subtitle: input.description.trim(),
      imageUrl: input.backgroundImageUrl.trim(),
      metadata: {
        eyebrow: input.eyebrow.trim(),
        highlightedTitle: input.highlightedTitle.trim(),
        section: {
          eyebrow: input.sectionEyebrow.trim(),
          title: input.sectionTitle.trim(),
          highlightedTitle: input.sectionHighlightedTitle.trim(),
          lead: input.sectionLead.trim(),
        },
      },
    },
  });

  return savePartialPageVisibility(
    MEDIA_PAGE_VISIBILITY_KEY,
    MEDIA_PAGE_SECTION_KEYS,
    visibilityPartial,
  ) as Promise<MediaPageSectionVisibility>;
}

export function parseMediaPageVisibilityFromFormData(
  formData: FormData,
): Partial<MediaPageSectionVisibility> {
  return parsePartialVisibilityFromFormData(
    formData,
    MEDIA_PAGE_SECTION_KEYS,
  ) as Partial<MediaPageSectionVisibility>;
}

export function parseMediaPageFormData(formData: FormData): MediaPageContentFields {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    eyebrow: read("eyebrow"),
    title: read("title"),
    highlightedTitle: read("highlightedTitle"),
    description: read("description"),
    backgroundImageUrl: read("backgroundImageUrl"),
    sectionEyebrow: read("section_eyebrow"),
    sectionTitle: read("section_title"),
    sectionHighlightedTitle: read("section_highlightedTitle"),
    sectionLead: read("section_lead"),
  };
}

export function isValidMediaPageContent(content: MediaPageContentFields): boolean {
  return (
    Boolean(content.title) &&
    Boolean(content.description) &&
    Boolean(content.backgroundImageUrl) &&
    Boolean(content.sectionTitle)
  );
}
