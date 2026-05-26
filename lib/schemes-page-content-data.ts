import {
  schemesChooseSection,
  schemesPageCta,
  schemesPageHero,
} from "@/content/schemes";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const SCHEMES_PAGE_SECTION_KEY = "schemes.page";

export type EditableSchemesPageHero = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  backgroundImageUrl: string;
};

export type EditableSchemesPageListIntro = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  lead: string;
};

export type EditableSchemesChooseItem = {
  title: string;
  text: string;
};

export type EditableSchemesChooseSection = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  lead: string;
  items: EditableSchemesChooseItem[];
};

export type EditableSchemesPageCta = {
  title: string;
  highlightedTitle: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type EditableSchemesPageContent = {
  hero: EditableSchemesPageHero;
  listIntro: EditableSchemesPageListIntro;
  chooseSection: EditableSchemesChooseSection;
  cta: EditableSchemesPageCta;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asChooseItems(
  value: unknown,
  fallback: EditableSchemesChooseItem[],
): EditableSchemesChooseItem[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      const record = asRecord(item);
      const title = asString(record.title, "");
      const text = asString(record.text, "");
      return title && text ? { title, text } : null;
    })
    .filter((item): item is EditableSchemesChooseItem => item !== null);

  return items.length > 0 ? items : fallback;
}

export function getDefaultSchemesPageContent(): EditableSchemesPageContent {
  return {
    hero: {
      eyebrow: schemesPageHero.eyebrow,
      title: schemesPageHero.title,
      highlightedTitle: schemesPageHero.highlightedTitle,
      description: schemesPageHero.description,
      backgroundImageUrl: schemesPageHero.backgroundImageUrl,
    },
    listIntro: {
      eyebrow: "Programmes",
      title: "Current",
      highlightedTitle: "Schemes",
      lead:
        "All active HomeFirst housing programmes currently open to applicants and registrants.",
    },
    chooseSection: {
      eyebrow: schemesChooseSection.eyebrow,
      title: schemesChooseSection.title,
      highlightedTitle: schemesChooseSection.titleEmphasis,
      lead: schemesChooseSection.lead,
      items: schemesChooseSection.items.map((item) => ({
        title: item.title,
        text: item.text,
      })),
    },
    cta: {
      title: schemesPageCta.title,
      highlightedTitle: schemesPageCta.highlightedTitle,
      description: schemesPageCta.description,
      primaryLabel: schemesPageCta.primaryLabel,
      primaryHref: schemesPageCta.primaryHref,
      secondaryLabel: schemesPageCta.secondaryLabel,
      secondaryHref: schemesPageCta.secondaryHref,
    },
  };
}

function parseSchemesPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableSchemesPageContent,
): EditableSchemesPageContent {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const hero = asRecord(metadata.hero);
  const listIntro = asRecord(metadata.listIntro);
  const chooseSection = asRecord(metadata.chooseSection);
  const cta = asRecord(metadata.cta);

  return {
    hero: {
      eyebrow: asString(hero.eyebrow, defaults.hero.eyebrow),
      title: asString(hero.title ?? row.title, defaults.hero.title),
      highlightedTitle: asString(
        hero.highlightedTitle,
        defaults.hero.highlightedTitle,
      ),
      description: asString(
        hero.description ?? row.subtitle,
        defaults.hero.description,
      ),
      backgroundImageUrl: asString(
        hero.backgroundImageUrl ?? row.imageUrl,
        defaults.hero.backgroundImageUrl,
      ),
    },
    listIntro: {
      eyebrow: asString(listIntro.eyebrow, defaults.listIntro.eyebrow),
      title: asString(listIntro.title, defaults.listIntro.title),
      highlightedTitle: asString(
        listIntro.highlightedTitle,
        defaults.listIntro.highlightedTitle,
      ),
      lead: asString(listIntro.lead, defaults.listIntro.lead),
    },
    chooseSection: {
      eyebrow: asString(chooseSection.eyebrow, defaults.chooseSection.eyebrow),
      title: asString(chooseSection.title, defaults.chooseSection.title),
      highlightedTitle: asString(
        chooseSection.highlightedTitle,
        defaults.chooseSection.highlightedTitle,
      ),
      lead: asString(chooseSection.lead, defaults.chooseSection.lead),
      items: asChooseItems(chooseSection.items, defaults.chooseSection.items),
    },
    cta: {
      title: asString(cta.title, defaults.cta.title),
      highlightedTitle: asString(
        cta.highlightedTitle,
        defaults.cta.highlightedTitle,
      ),
      description: asString(cta.description, defaults.cta.description),
      primaryLabel: asString(cta.primaryLabel, defaults.cta.primaryLabel),
      primaryHref: asString(cta.primaryHref, defaults.cta.primaryHref),
      secondaryLabel: asString(
        cta.secondaryLabel,
        defaults.cta.secondaryLabel,
      ),
      secondaryHref: asString(cta.secondaryHref, defaults.cta.secondaryHref),
    },
  };
}

export async function getEditableSchemesPageContent(): Promise<EditableSchemesPageContent> {
  const defaults = getDefaultSchemesPageContent();
  const row = await prisma.pageContent.findUnique({
    where: { sectionKey: SCHEMES_PAGE_SECTION_KEY },
  });

  return parseSchemesPageContent(row, defaults);
}

export async function getPublicSchemesPageContent(): Promise<EditableSchemesPageContent> {
  try {
    return await getEditableSchemesPageContent();
  } catch {
    return getDefaultSchemesPageContent();
  }
}

export async function saveEditableSchemesPageContent(
  input: EditableSchemesPageContent,
): Promise<void> {
  await prisma.pageContent.upsert({
    where: { sectionKey: SCHEMES_PAGE_SECTION_KEY },
    update: {
      title: input.hero.title.trim(),
      subtitle: input.hero.description.trim(),
      imageUrl: input.hero.backgroundImageUrl.trim(),
      metadata: input,
    },
    create: {
      sectionKey: SCHEMES_PAGE_SECTION_KEY,
      title: input.hero.title.trim(),
      subtitle: input.hero.description.trim(),
      imageUrl: input.hero.backgroundImageUrl.trim(),
      metadata: input,
    },
  });
}

export function parseSchemesPageFormData(formData: FormData): EditableSchemesPageContent {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    hero: {
      eyebrow: read("hero_eyebrow"),
      title: read("hero_title"),
      highlightedTitle: read("hero_highlightedTitle"),
      description: read("hero_description"),
      backgroundImageUrl: read("hero_backgroundImageUrl"),
    },
    listIntro: {
      eyebrow: read("list_eyebrow"),
      title: read("list_title"),
      highlightedTitle: read("list_highlightedTitle"),
      lead: read("list_lead"),
    },
    chooseSection: {
      eyebrow: read("choose_eyebrow"),
      title: read("choose_title"),
      highlightedTitle: read("choose_highlightedTitle"),
      lead: read("choose_lead"),
      items: [1, 2, 3, 4].map((index) => ({
        title: read(`choose_item${index}_title`),
        text: read(`choose_item${index}_text`),
      })),
    },
    cta: {
      title: read("cta_title"),
      highlightedTitle: read("cta_highlightedTitle"),
      description: read("cta_description"),
      primaryLabel: read("cta_primaryLabel"),
      primaryHref: read("cta_primaryHref"),
      secondaryLabel: read("cta_secondaryLabel"),
      secondaryHref: read("cta_secondaryHref"),
    },
  };
}

export function isValidSchemesPageContent(
  content: EditableSchemesPageContent,
): boolean {
  return (
    Boolean(content.hero.title) &&
    Boolean(content.hero.description) &&
    Boolean(content.hero.backgroundImageUrl) &&
    Boolean(content.listIntro.title) &&
    Boolean(content.chooseSection.title) &&
    content.chooseSection.items.every((item) => item.title && item.text) &&
    Boolean(content.cta.title) &&
    content.cta.primaryHref.startsWith("/") &&
    content.cta.secondaryHref.startsWith("/")
  );
}
