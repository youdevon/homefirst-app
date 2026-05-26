import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const ELIGIBILITY_PAGE_SECTION_KEY = "eligibility.page";

export type EditableEligibilityPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    highlightedTitle: string;
    description: string;
    backgroundImageUrl: string;
  };
  whoQualifies: {
    title: string;
    highlightedTitle: string;
    description: string;
  };
  requirements: {
    title: string;
    items: string[];
  };
  documents: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    highlightedTitle: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

export function getDefaultEligibilityPageContent(): EditableEligibilityPageContent {
  return {
    hero: {
      eyebrow: "Eligibility",
      title: "Check Your",
      highlightedTitle: "Eligibility",
      description:
        "Review the general criteria, requirements, and documents needed before starting a housing application.",
      backgroundImageUrl: "",
    },
    whoQualifies: {
      title: "Who",
      highlightedTitle: "Qualifies",
      description:
        "HomeFirst programmes support citizens and families who meet residency, household, and income guidelines for community housing support.",
    },
    requirements: {
      title: "General Requirements",
      items: [
        "Citizen or legal resident of Trinidad and Tobago",
        "Household income within programme limits",
        "No outstanding housing arrears with the Division",
        "Willingness to participate in community programmes where required",
      ],
    },
    documents: {
      title: "Documents You May Need",
      items: [
        "Valid national identification",
        "Proof of income or employment",
        "Proof of address",
        "Birth certificates for household members",
        "Marriage certificate or supporting household documents where applicable",
      ],
    },
    cta: {
      title: "Ready to",
      highlightedTitle: "Apply?",
      description:
        "If you believe you meet the criteria, start your application or contact the Division for guidance.",
      primaryLabel: "Start Application",
      primaryHref: "/application",
      secondaryLabel: "Contact Us",
      secondaryHref: "/contact",
    },
  };
}

function parseEligibilityPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableEligibilityPageContent,
): EditableEligibilityPageContent {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const hero = asRecord(metadata.hero);
  const whoQualifies = asRecord(metadata.whoQualifies);
  const requirements = asRecord(metadata.requirements);
  const documents = asRecord(metadata.documents);
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
    whoQualifies: {
      title: asString(whoQualifies.title, defaults.whoQualifies.title),
      highlightedTitle: asString(
        whoQualifies.highlightedTitle,
        defaults.whoQualifies.highlightedTitle,
      ),
      description: asString(
        whoQualifies.description,
        defaults.whoQualifies.description,
      ),
    },
    requirements: {
      title: asString(requirements.title, defaults.requirements.title),
      items: asStringArray(requirements.items, defaults.requirements.items),
    },
    documents: {
      title: asString(documents.title, defaults.documents.title),
      items: asStringArray(documents.items, defaults.documents.items),
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
      secondaryLabel: asString(cta.secondaryLabel, defaults.cta.secondaryLabel),
      secondaryHref: asString(cta.secondaryHref, defaults.cta.secondaryHref),
    },
  };
}

export async function getEditableEligibilityPageContent(): Promise<EditableEligibilityPageContent> {
  const defaults = getDefaultEligibilityPageContent();
  const row = await prisma.pageContent.findUnique({
    where: { sectionKey: ELIGIBILITY_PAGE_SECTION_KEY },
  });

  return parseEligibilityPageContent(row, defaults);
}

export async function getPublicEligibilityPageContent(): Promise<EditableEligibilityPageContent> {
  try {
    return await getEditableEligibilityPageContent();
  } catch {
    return getDefaultEligibilityPageContent();
  }
}

export async function saveEditableEligibilityPageContent(
  input: EditableEligibilityPageContent,
): Promise<void> {
  await prisma.pageContent.upsert({
    where: { sectionKey: ELIGIBILITY_PAGE_SECTION_KEY },
    update: {
      title: input.hero.title.trim(),
      subtitle: input.hero.description.trim(),
      imageUrl: input.hero.backgroundImageUrl.trim(),
      metadata: input,
    },
    create: {
      sectionKey: ELIGIBILITY_PAGE_SECTION_KEY,
      title: input.hero.title.trim(),
      subtitle: input.hero.description.trim(),
      imageUrl: input.hero.backgroundImageUrl.trim(),
      metadata: input,
    },
  });
}

export function parseEligibilityPageFormData(
  formData: FormData,
): EditableEligibilityPageContent {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    hero: {
      eyebrow: read("hero_eyebrow"),
      title: read("hero_title"),
      highlightedTitle: read("hero_highlightedTitle"),
      description: read("hero_description"),
      backgroundImageUrl: read("hero_backgroundImageUrl"),
    },
    whoQualifies: {
      title: read("who_title"),
      highlightedTitle: read("who_highlightedTitle"),
      description: read("who_description"),
    },
    requirements: {
      title: read("requirements_title"),
      items: [1, 2, 3, 4].map((index) => read(`requirements_item${index}`)),
    },
    documents: {
      title: read("documents_title"),
      items: [1, 2, 3, 4, 5].map((index) => read(`documents_item${index}`)),
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

export function isValidEligibilityPageContent(
  content: EditableEligibilityPageContent,
): boolean {
  return (
    Boolean(content.hero.title) &&
    Boolean(content.hero.description) &&
    Boolean(content.whoQualifies.description) &&
    content.requirements.items.some(Boolean) &&
    content.documents.items.some(Boolean) &&
    content.cta.primaryHref.startsWith("/") &&
    content.cta.secondaryHref.startsWith("/")
  );
}
