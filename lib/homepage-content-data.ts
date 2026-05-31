import { hero, ctaBanner } from "@/content/home";
import { schemesSection } from "@/content/schemes";
import {
  HERO_MEDIA_SLOTS,
  type HeroMediaItem,
  type PublicHeroMediaItem,
  heroMediaToMetadata,
  parseHeroMediaFromMetadata,
  resolvePublicHeroMedia,
  syncHeroImagesFromMedia,
} from "@/lib/hero-media";
import {
  HOME_SECTION_KEYS,
  HOME_VISIBILITY_FORM_KEYS,
  HOME_VISIBILITY_KEY,
  getPageVisibility,
  parsePartialVisibilityFromFormData,
  savePartialPageVisibility,
  type HomeSectionVisibility,
} from "@/lib/section-visibility";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const HERO_SECTION_KEY = "home.hero";
export const CTA_SECTION_KEY = "home.cta";
export const SCHEMES_PREVIEW_SECTION_KEY = "home.schemesPreview";
export const HERO_BACKGROUND_IMAGE_SLOTS = 10;

export const DEFAULT_HERO_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=85";

export type EditableHomeHero = {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundImageUrl: string;
  heroImages: string[];
  heroMedia: HeroMediaItem[];
};

export type EditableCtaBanner = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  formTitle: string;
  submitLabel: string;
  submitHref: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderPhone: string;
  assurancesText: string;
};

export type EditableSchemesPreviewSection = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  viewAllLabel: string;
  viewAllHref: string;
  cardCtaLabel: string;
};

export type HomepageContentFields = Omit<EditableHomepageContent, "visibility">;

export type EditableHomepageContent = {
  hero: EditableHomeHero;
  schemesPreview: EditableSchemesPreviewSection;
  ctaBanner: EditableCtaBanner;
  visibility: HomeSectionVisibility;
};

export type PublicCtaBanner = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  formTitle: string;
  submitLabel: string;
  submitHref: string;
  placeholders: {
    name: string;
    email: string;
    phone: string;
  };
  assurances: string[];
};

export type PublicHomeHero = Omit<EditableHomeHero, "heroMedia"> & {
  backgroundImages: string[];
  heroMedia: PublicHeroMediaItem[];
};

export type PublicHomepageContent = {
  hero: PublicHomeHero;
  schemesPreview: EditableSchemesPreviewSection;
  ctaBanner: PublicCtaBanner;
  visibility: HomeSectionVisibility;
};

export { HOME_VISIBILITY_KEY, HOME_SECTION_KEYS, HOME_SECTION_LABELS } from "@/lib/section-visibility";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asCtaObject(value: unknown): { label?: string; href?: string } {
  const record = asRecord(value);
  return {
    label: typeof record.label === "string" ? record.label : undefined,
    href: typeof record.href === "string" ? record.href : undefined,
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHeroImageSlots(values: string[]): string[] {
  const slots = Array.from({ length: HERO_BACKGROUND_IMAGE_SLOTS }, (_, index) =>
    (values[index] ?? "").trim(),
  );

  return slots;
}

export function resolvePublicHeroBackgroundImages(hero: EditableHomeHero): string[] {
  const fromMedia = syncHeroImagesFromMedia(hero.heroMedia);
  if (fromMedia.length > 0) {
    return fromMedia;
  }

  const fromList = hero.heroImages.filter(Boolean);

  if (fromList.length > 0) {
    return fromList;
  }

  if (hero.backgroundImageUrl.trim()) {
    return [hero.backgroundImageUrl.trim()];
  }

  return [DEFAULT_HERO_BACKGROUND_URL];
}

export function getDefaultHomeHero(): EditableHomeHero {
  return {
    badge: hero.badge,
    title: hero.title,
    highlightedTitle: hero.titleEmphasis,
    description: hero.subtitle,
    primaryCtaLabel: hero.primaryCta.label,
    primaryCtaHref: hero.primaryCta.href,
    secondaryCtaLabel: hero.secondaryCta.label,
    secondaryCtaHref: hero.secondaryCta.href,
    backgroundImageUrl: DEFAULT_HERO_BACKGROUND_URL,
    heroImages: [],
    heroMedia: [],
  };
}

export function getDefaultCtaBanner(): EditableCtaBanner {
  return {
    eyebrow: ctaBanner.eyebrow,
    title: ctaBanner.title,
    highlightedTitle: ctaBanner.titleEmphasis,
    description: ctaBanner.lead,
    formTitle: ctaBanner.formTitle,
    submitLabel: ctaBanner.submitLabel,
    submitHref: ctaBanner.submitHref,
    placeholderName: ctaBanner.placeholders.name,
    placeholderEmail: ctaBanner.placeholders.email,
    placeholderPhone: ctaBanner.placeholders.phone,
    assurancesText: ctaBanner.assurances.join("\n"),
  };
}

export function getDefaultSchemesPreviewSection(): EditableSchemesPreviewSection {
  return {
    eyebrow: schemesSection.eyebrow,
    title: schemesSection.title,
    highlightedTitle: schemesSection.titleEmphasis,
    viewAllLabel: schemesSection.viewAllLabel,
    viewAllHref: schemesSection.viewAllHref,
    cardCtaLabel: schemesSection.cardCtaLabel,
  };
}

export function getDefaultHomepageContent(): EditableHomepageContent {
  return {
    hero: getDefaultHomeHero(),
    schemesPreview: getDefaultSchemesPreviewSection(),
    ctaBanner: getDefaultCtaBanner(),
    visibility: Object.fromEntries(
      HOME_SECTION_KEYS.map((key) => [key, true]),
    ) as HomeSectionVisibility,
  };
}

function parseHeroFromPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableHomeHero,
): EditableHomeHero {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const primaryCta = asCtaObject(metadata.primaryCta);
  const secondaryCta = asCtaObject(metadata.secondaryCta);
  const backgroundImageUrl = asString(row.imageUrl, defaults.backgroundImageUrl);
  const heroImages = normalizeHeroImageSlots(asStringArray(metadata.heroImages));
  const heroMedia = parseHeroMediaFromMetadata(
    metadata,
    heroImages,
    backgroundImageUrl,
  );

  return {
    badge: asString(metadata.badge, defaults.badge),
    title: asString(row.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle ?? metadata.titleEmphasis,
      defaults.highlightedTitle,
    ),
    description: asString(row.subtitle, defaults.description),
    primaryCtaLabel: asString(
      metadata.primaryCtaLabel ?? primaryCta.label,
      defaults.primaryCtaLabel,
    ),
    primaryCtaHref: asString(
      metadata.primaryCtaHref ?? primaryCta.href,
      defaults.primaryCtaHref,
    ),
    secondaryCtaLabel: asString(
      metadata.secondaryCtaLabel ?? secondaryCta.label,
      defaults.secondaryCtaLabel,
    ),
    secondaryCtaHref: asString(
      metadata.secondaryCtaHref ?? secondaryCta.href,
      defaults.secondaryCtaHref,
    ),
    backgroundImageUrl,
    heroImages,
    heroMedia,
  };
}

function parseCtaFromPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableCtaBanner,
): EditableCtaBanner {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const placeholders = asRecord(metadata.placeholders);
  const assurances = asStringArray(metadata.assurances);

  return {
    eyebrow: asString(metadata.eyebrow, defaults.eyebrow),
    title: asString(row.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle ?? metadata.titleEmphasis,
      defaults.highlightedTitle,
    ),
    description: asString(row.subtitle, defaults.description),
    formTitle: asString(metadata.formTitle, defaults.formTitle),
    submitLabel: asString(metadata.submitLabel, defaults.submitLabel),
    submitHref: asString(metadata.submitHref, defaults.submitHref),
    placeholderName: asString(
      metadata.placeholderName ?? placeholders.name,
      defaults.placeholderName,
    ),
    placeholderEmail: asString(
      metadata.placeholderEmail ?? placeholders.email,
      defaults.placeholderEmail,
    ),
    placeholderPhone: asString(
      metadata.placeholderPhone ?? placeholders.phone,
      defaults.placeholderPhone,
    ),
    assurancesText:
      assurances.length > 0
        ? assurances.join("\n")
        : asString(metadata.assurancesText, defaults.assurancesText),
  };
}

function parseSchemesPreviewFromPageContent(
  row: {
    title: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableSchemesPreviewSection,
): EditableSchemesPreviewSection {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    eyebrow: asString(metadata.eyebrow, defaults.eyebrow),
    title: asString(row.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle ?? metadata.titleEmphasis,
      defaults.highlightedTitle,
    ),
    viewAllLabel: asString(metadata.viewAllLabel, defaults.viewAllLabel),
    viewAllHref: asString(metadata.viewAllHref, defaults.viewAllHref),
    cardCtaLabel: asString(metadata.cardCtaLabel, defaults.cardCtaLabel),
  };
}

function toPublicCtaBanner(content: EditableCtaBanner): PublicCtaBanner {
  const assurances = content.assurancesText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    eyebrow: content.eyebrow,
    title: content.title,
    highlightedTitle: content.highlightedTitle,
    description: content.description,
    formTitle: content.formTitle,
    submitLabel: content.submitLabel,
    submitHref: content.submitHref,
    placeholders: {
      name: content.placeholderName,
      email: content.placeholderEmail,
      phone: content.placeholderPhone,
    },
    assurances:
      assurances.length > 0 ? assurances : ctaBanner.assurances,
  };
}

export async function getEditableHomepageContent(): Promise<EditableHomepageContent> {
  const defaults = getDefaultHomepageContent();
  const visibility = await getPageVisibility(HOME_VISIBILITY_KEY, HOME_SECTION_KEYS);

  const rows = await prisma.pageContent.findMany({
    where: {
      sectionKey: {
        in: [HERO_SECTION_KEY, CTA_SECTION_KEY, SCHEMES_PREVIEW_SECTION_KEY],
      },
    },
  });

  const heroRow = rows.find((row) => row.sectionKey === HERO_SECTION_KEY) ?? null;
  const ctaRow = rows.find((row) => row.sectionKey === CTA_SECTION_KEY) ?? null;
  const schemesPreviewRow =
    rows.find((row) => row.sectionKey === SCHEMES_PREVIEW_SECTION_KEY) ?? null;

  return {
    hero: parseHeroFromPageContent(heroRow, defaults.hero),
    schemesPreview: parseSchemesPreviewFromPageContent(
      schemesPreviewRow,
      defaults.schemesPreview,
    ),
    ctaBanner: parseCtaFromPageContent(ctaRow, defaults.ctaBanner),
    visibility: visibility as HomeSectionVisibility,
  };
}

export async function getPublicHomepageContent(): Promise<PublicHomepageContent> {
  try {
    const content = await getEditableHomepageContent();

    return {
      hero: {
        ...content.hero,
        backgroundImages: resolvePublicHeroBackgroundImages(content.hero),
        heroMedia: resolvePublicHeroMedia(
          content.hero.heroMedia,
          content.hero.backgroundImageUrl,
        ),
      },
      schemesPreview: content.schemesPreview,
      ctaBanner: toPublicCtaBanner(content.ctaBanner),
      visibility: content.visibility,
    };
  } catch {
    const defaults = getDefaultHomepageContent();

    return {
      hero: {
        ...defaults.hero,
        backgroundImages: resolvePublicHeroBackgroundImages(defaults.hero),
        heroMedia: resolvePublicHeroMedia(
          defaults.hero.heroMedia,
          defaults.hero.backgroundImageUrl,
        ),
      },
      schemesPreview: defaults.schemesPreview,
      ctaBanner: toPublicCtaBanner(defaults.ctaBanner),
      visibility: defaults.visibility,
    };
  }
}

export async function saveEditableHomepageContent(
  input: HomepageContentFields,
  visibilityPartial: Partial<HomeSectionVisibility>,
): Promise<HomeSectionVisibility> {
  const heroMediaMetadata = heroMediaToMetadata(input.hero.heroMedia);
  const syncedHeroImages = syncHeroImagesFromMedia(input.hero.heroMedia);

  await prisma.$transaction([
    prisma.pageContent.upsert({
      where: { sectionKey: HERO_SECTION_KEY },
      update: {
        title: input.hero.title.trim(),
        subtitle: input.hero.description.trim(),
        imageUrl: input.hero.backgroundImageUrl.trim(),
        metadata: {
          badge: input.hero.badge.trim(),
          highlightedTitle: input.hero.highlightedTitle.trim(),
          primaryCtaLabel: input.hero.primaryCtaLabel.trim(),
          primaryCtaHref: input.hero.primaryCtaHref.trim(),
          secondaryCtaLabel: input.hero.secondaryCtaLabel.trim(),
          secondaryCtaHref: input.hero.secondaryCtaHref.trim(),
          heroImages: syncedHeroImages,
          heroMedia: heroMediaMetadata,
        },
      },
      create: {
        sectionKey: HERO_SECTION_KEY,
        title: input.hero.title.trim(),
        subtitle: input.hero.description.trim(),
        imageUrl: input.hero.backgroundImageUrl.trim(),
        metadata: {
          badge: input.hero.badge.trim(),
          highlightedTitle: input.hero.highlightedTitle.trim(),
          primaryCtaLabel: input.hero.primaryCtaLabel.trim(),
          primaryCtaHref: input.hero.primaryCtaHref.trim(),
          secondaryCtaLabel: input.hero.secondaryCtaLabel.trim(),
          secondaryCtaHref: input.hero.secondaryCtaHref.trim(),
          heroImages: syncedHeroImages,
          heroMedia: heroMediaMetadata,
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: SCHEMES_PREVIEW_SECTION_KEY },
      update: {
        title: input.schemesPreview.title.trim(),
        metadata: {
          eyebrow: input.schemesPreview.eyebrow.trim(),
          highlightedTitle: input.schemesPreview.highlightedTitle.trim(),
          viewAllLabel: input.schemesPreview.viewAllLabel.trim(),
          viewAllHref: input.schemesPreview.viewAllHref.trim(),
          cardCtaLabel: input.schemesPreview.cardCtaLabel.trim(),
        },
      },
      create: {
        sectionKey: SCHEMES_PREVIEW_SECTION_KEY,
        title: input.schemesPreview.title.trim(),
        metadata: {
          eyebrow: input.schemesPreview.eyebrow.trim(),
          highlightedTitle: input.schemesPreview.highlightedTitle.trim(),
          viewAllLabel: input.schemesPreview.viewAllLabel.trim(),
          viewAllHref: input.schemesPreview.viewAllHref.trim(),
          cardCtaLabel: input.schemesPreview.cardCtaLabel.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: CTA_SECTION_KEY },
      update: {
        title: input.ctaBanner.title.trim(),
        subtitle: input.ctaBanner.description.trim(),
        metadata: {
          eyebrow: input.ctaBanner.eyebrow.trim(),
          highlightedTitle: input.ctaBanner.highlightedTitle.trim(),
          formTitle: input.ctaBanner.formTitle.trim(),
          submitLabel: input.ctaBanner.submitLabel.trim(),
          submitHref: input.ctaBanner.submitHref.trim(),
          placeholderName: input.ctaBanner.placeholderName.trim(),
          placeholderEmail: input.ctaBanner.placeholderEmail.trim(),
          placeholderPhone: input.ctaBanner.placeholderPhone.trim(),
          assurancesText: input.ctaBanner.assurancesText.trim(),
          assurances: input.ctaBanner.assurancesText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      },
      create: {
        sectionKey: CTA_SECTION_KEY,
        title: input.ctaBanner.title.trim(),
        subtitle: input.ctaBanner.description.trim(),
        metadata: {
          eyebrow: input.ctaBanner.eyebrow.trim(),
          highlightedTitle: input.ctaBanner.highlightedTitle.trim(),
          formTitle: input.ctaBanner.formTitle.trim(),
          submitLabel: input.ctaBanner.submitLabel.trim(),
          submitHref: input.ctaBanner.submitHref.trim(),
          placeholderName: input.ctaBanner.placeholderName.trim(),
          placeholderEmail: input.ctaBanner.placeholderEmail.trim(),
          placeholderPhone: input.ctaBanner.placeholderPhone.trim(),
          assurancesText: input.ctaBanner.assurancesText.trim(),
          assurances: input.ctaBanner.assurancesText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      },
    }),
  ]);

  return savePartialPageVisibility(
    HOME_VISIBILITY_KEY,
    HOME_SECTION_KEYS,
    visibilityPartial,
  ) as Promise<HomeSectionVisibility>;
}

export async function mergeHomepageVisibilityFromFormData(
  formData: FormData,
  keys: readonly (typeof HOME_SECTION_KEYS)[number][] = HOME_VISIBILITY_FORM_KEYS,
): Promise<HomeSectionVisibility> {
  const partial = parsePartialVisibilityFromFormData(formData, keys);
  return savePartialPageVisibility(
    HOME_VISIBILITY_KEY,
    HOME_SECTION_KEYS,
    partial,
  ) as Promise<HomeSectionVisibility>;
}

export function parseHomepageFormData(formData: FormData): HomepageContentFields {
  const read = (name: string) => String(formData.get(name) ?? "").trim();
  const readActive = (name: string) => formData.get(name) === "1";

  const heroMedia = Array.from({ length: HERO_MEDIA_SLOTS }, (_, index) => {
    const slot = index + 1;
    const url = read(`hero_media${slot}_url`);
    return {
      type: read(`hero_media${slot}_type`) === "video" ? ("video" as const) : ("image" as const),
      url,
      posterUrl: read(`hero_media${slot}_posterUrl`),
      displayOrder: slot,
      active: readActive(`hero_media${slot}_active`) || Boolean(url),
    };
  });

  return {
    hero: {
      badge: read("hero_badge"),
      title: read("hero_title"),
      highlightedTitle: read("hero_highlightedTitle"),
      description: read("hero_description"),
      primaryCtaLabel: read("hero_primaryCtaLabel"),
      primaryCtaHref: read("hero_primaryCtaHref"),
      secondaryCtaLabel: read("hero_secondaryCtaLabel"),
      secondaryCtaHref: read("hero_secondaryCtaHref"),
      backgroundImageUrl: read("hero_backgroundImageUrl"),
      heroImages: syncHeroImagesFromMedia(heroMedia),
      heroMedia,
    },
    ctaBanner: {
      eyebrow: read("cta_eyebrow"),
      title: read("cta_title"),
      highlightedTitle: read("cta_highlightedTitle"),
      description: read("cta_description"),
      formTitle: read("cta_formTitle"),
      submitLabel: read("cta_submitLabel"),
      submitHref: read("cta_submitHref"),
      placeholderName: read("cta_placeholderName"),
      placeholderEmail: read("cta_placeholderEmail"),
      placeholderPhone: read("cta_placeholderPhone"),
      assurancesText: read("cta_assurancesText"),
    },
    schemesPreview: {
      eyebrow: read("schemes_eyebrow"),
      title: read("schemes_title"),
      highlightedTitle: read("schemes_highlightedTitle"),
      viewAllLabel: read("schemes_viewAllLabel"),
      viewAllHref: read("schemes_viewAllHref"),
      cardCtaLabel: read("schemes_cardCtaLabel"),
    },
  };
}

export function parseHomepageVisibilityFromFormData(
  formData: FormData,
): Partial<HomeSectionVisibility> {
  return parsePartialVisibilityFromFormData(
    formData,
    HOME_VISIBILITY_FORM_KEYS,
  ) as Partial<HomeSectionVisibility>;
}

export function isValidHomepageContent(content: HomepageContentFields): boolean {
  const { heroImages: _heroImages, heroMedia: _heroMedia, ...heroScalars } = content.hero;
  const heroValues = Object.values(heroScalars);
  const ctaValues = Object.values(content.ctaBanner);
  const schemesValues = Object.values(content.schemesPreview);

  return (
    heroValues.every(Boolean) &&
    ctaValues.every(Boolean) &&
    schemesValues.every(Boolean) &&
    content.hero.primaryCtaHref.startsWith("/") &&
    content.hero.secondaryCtaHref.startsWith("/") &&
    content.ctaBanner.submitHref.startsWith("/") &&
    content.schemesPreview.viewAllHref.startsWith("/")
  );
}
