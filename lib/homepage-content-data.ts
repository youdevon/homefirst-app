import { hero, ctaBanner } from "@/content/home";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const HERO_SECTION_KEY = "home.hero";
export const CTA_SECTION_KEY = "home.cta";

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
};

export type EditableCtaBanner = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  formTitle: string;
  submitLabel: string;
};

export type EditableHomepageContent = {
  hero: EditableHomeHero;
  ctaBanner: EditableCtaBanner;
};

export type PublicCtaBanner = EditableCtaBanner & {
  submitHref: string;
  placeholders: {
    name: string;
    email: string;
    phone: string;
  };
  assurances: string[];
};

export type PublicHomepageContent = {
  hero: EditableHomeHero;
  ctaBanner: PublicCtaBanner;
};

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
  };
}

export function getDefaultHomepageContent(): EditableHomepageContent {
  return {
    hero: getDefaultHomeHero(),
    ctaBanner: getDefaultCtaBanner(),
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
    backgroundImageUrl: asString(row.imageUrl, defaults.backgroundImageUrl),
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
  };
}

export async function getEditableHomepageContent(): Promise<EditableHomepageContent> {
  const defaults = getDefaultHomepageContent();

  const rows = await prisma.pageContent.findMany({
    where: {
      sectionKey: {
        in: [HERO_SECTION_KEY, CTA_SECTION_KEY],
      },
    },
  });

  const heroRow = rows.find((row) => row.sectionKey === HERO_SECTION_KEY) ?? null;
  const ctaRow = rows.find((row) => row.sectionKey === CTA_SECTION_KEY) ?? null;

  return {
    hero: parseHeroFromPageContent(heroRow, defaults.hero),
    ctaBanner: parseCtaFromPageContent(ctaRow, defaults.ctaBanner),
  };
}

export async function getPublicHomepageContent(): Promise<PublicHomepageContent> {
  try {
    const content = await getEditableHomepageContent();

    return {
      hero: content.hero,
      ctaBanner: {
        ...content.ctaBanner,
        submitHref: ctaBanner.submitHref,
        placeholders: ctaBanner.placeholders,
        assurances: ctaBanner.assurances,
      },
    };
  } catch {
    const defaults = getDefaultHomepageContent();

    return {
      hero: defaults.hero,
      ctaBanner: {
        ...defaults.ctaBanner,
        submitHref: ctaBanner.submitHref,
        placeholders: ctaBanner.placeholders,
        assurances: ctaBanner.assurances,
      },
    };
  }
}

export async function saveEditableHomepageContent(
  input: EditableHomepageContent,
): Promise<void> {
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
        },
      },
    }),
  ]);
}

export function parseHomepageFormData(formData: FormData): EditableHomepageContent {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

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
    },
    ctaBanner: {
      eyebrow: read("cta_eyebrow"),
      title: read("cta_title"),
      highlightedTitle: read("cta_highlightedTitle"),
      description: read("cta_description"),
      formTitle: read("cta_formTitle"),
      submitLabel: read("cta_submitLabel"),
    },
  };
}

export function isValidHomepageContent(content: EditableHomepageContent): boolean {
  const heroValues = Object.values(content.hero);
  const ctaValues = Object.values(content.ctaBanner);

  return (
    heroValues.every(Boolean) &&
    ctaValues.every(Boolean) &&
    content.hero.primaryCtaHref.startsWith("/") &&
    content.hero.secondaryCtaHref.startsWith("/")
  );
}
