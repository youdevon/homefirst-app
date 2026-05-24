import {
  aboutHero as contentAboutHero,
  aboutHighlights as contentAboutHighlights,
  aboutImages as contentAboutImages,
  aboutIntro as contentAboutIntro,
  leadershipSection as contentLeadershipSection,
  mission as contentMission,
  vision as contentVision,
} from "@/content/about";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const ABOUT_HERO_KEY = "about.hero";
export const ABOUT_INTRO_KEY = "about.intro";
export const ABOUT_VISION_KEY = "about.vision";
export const ABOUT_MISSION_KEY = "about.mission";
export const ABOUT_HIGHLIGHTS_KEY = "about.highlights";
export const ABOUT_IMAGES_KEY = "about.images";
export const ABOUT_LEADERSHIP_HEADER_KEY = "about.leadershipHeader";

export type EditableAboutHero = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  backgroundImageUrl: string;
};

export type EditableAboutIntro = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  paragraphOne: string;
  paragraphTwo: string;
};

export type EditableAboutVision = {
  title: string;
  body: string;
};

export type EditableAboutMission = {
  title: string;
  body: string;
};

export type EditableAboutHighlights = {
  highlightOneValue: string;
  highlightOneLabel: string;
  highlightTwoValue: string;
  highlightTwoLabel: string;
  highlightThreeValue: string;
  highlightThreeLabel: string;
};

export type EditableAboutImages = {
  mainImageUrl: string;
  secondaryImageUrl: string;
  establishedYear: string;
  establishedLabel: string;
};

export type EditableAboutLeadershipHeader = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
};

export type EditableAboutContent = {
  hero: EditableAboutHero;
  intro: EditableAboutIntro;
  vision: EditableAboutVision;
  mission: EditableAboutMission;
  highlights: EditableAboutHighlights;
  images: EditableAboutImages;
  leadershipHeader: EditableAboutLeadershipHeader;
};

export type PublicAboutHighlight = {
  value: string;
  label: string;
};

export type PublicAboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    paragraphs: string[];
  };
  vision: {
    title: string;
    text: string;
  };
  mission: {
    title: string;
    text: string;
  };
  highlights: PublicAboutHighlight[];
  images: {
    main: { src: string; alt: string };
    secondary: { src: string; alt: string };
    badge: { year: string; label: string };
  };
  leadershipSection: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    lead: string;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export function getDefaultAboutHero(): EditableAboutHero {
  return {
    eyebrow: contentAboutHero.eyebrow,
    title: contentAboutHero.title,
    highlightedTitle: contentAboutHero.titleEmphasis,
    description: contentAboutHero.subtitle,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85",
  };
}

export function getDefaultAboutIntro(): EditableAboutIntro {
  return {
    eyebrow: contentAboutIntro.eyebrow,
    title: contentAboutIntro.title,
    highlightedTitle: contentAboutIntro.titleEmphasis,
    paragraphOne: contentAboutIntro.paragraphs[0] ?? "",
    paragraphTwo: contentAboutIntro.paragraphs[1] ?? "",
  };
}

export function getDefaultAboutVision(): EditableAboutVision {
  return {
    title: contentVision.title,
    body: contentVision.text,
  };
}

export function getDefaultAboutMission(): EditableAboutMission {
  return {
    title: contentMission.title,
    body: contentMission.text,
  };
}

export function getDefaultAboutHighlights(): EditableAboutHighlights {
  return {
    highlightOneValue: contentAboutHighlights[0]?.value ?? "",
    highlightOneLabel: contentAboutHighlights[0]?.label ?? "",
    highlightTwoValue: contentAboutHighlights[1]?.value ?? "",
    highlightTwoLabel: contentAboutHighlights[1]?.label ?? "",
    highlightThreeValue: contentAboutHighlights[2]?.value ?? "",
    highlightThreeLabel: contentAboutHighlights[2]?.label ?? "",
  };
}

export function getDefaultAboutImages(): EditableAboutImages {
  return {
    mainImageUrl: contentAboutImages.main.src,
    secondaryImageUrl: contentAboutImages.secondary.src,
    establishedYear: contentAboutImages.badge.year,
    establishedLabel: contentAboutImages.badge.label,
  };
}

export function getDefaultAboutLeadershipHeader(): EditableAboutLeadershipHeader {
  return {
    eyebrow: contentLeadershipSection.eyebrow,
    title: contentLeadershipSection.title,
    highlightedTitle: contentLeadershipSection.titleEmphasis,
    description: contentLeadershipSection.lead,
  };
}

export function getDefaultAboutContent(): EditableAboutContent {
  return {
    hero: getDefaultAboutHero(),
    intro: getDefaultAboutIntro(),
    vision: getDefaultAboutVision(),
    mission: getDefaultAboutMission(),
    highlights: getDefaultAboutHighlights(),
    images: getDefaultAboutImages(),
    leadershipHeader: getDefaultAboutLeadershipHeader(),
  };
}

function parseHeroRow(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableAboutHero,
): EditableAboutHero {
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
    backgroundImageUrl: asString(row.imageUrl, defaults.backgroundImageUrl),
  };
}

function parseIntroRow(
  row: { metadata: Prisma.JsonValue | null } | null,
  defaults: EditableAboutIntro,
): EditableAboutIntro {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    eyebrow: asString(metadata.eyebrow, defaults.eyebrow),
    title: asString(metadata.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle ?? metadata.titleEmphasis,
      defaults.highlightedTitle,
    ),
    paragraphOne: asString(metadata.paragraphOne, defaults.paragraphOne),
    paragraphTwo: asString(metadata.paragraphTwo, defaults.paragraphTwo),
  };
}

function parseVisionRow(
  row: {
    title: string | null;
    body: string | null;
    subtitle: string | null;
  } | null,
  defaults: EditableAboutVision,
): EditableAboutVision {
  if (!row) {
    return defaults;
  }

  return {
    title: asString(row.title, defaults.title),
    body: asString(row.body ?? row.subtitle, defaults.body),
  };
}

function parseMissionRow(
  row: {
    title: string | null;
    body: string | null;
    subtitle: string | null;
  } | null,
  defaults: EditableAboutMission,
): EditableAboutMission {
  if (!row) {
    return defaults;
  }

  return {
    title: asString(row.title, defaults.title),
    body: asString(row.body ?? row.subtitle, defaults.body),
  };
}

function parseHighlightsRow(
  row: { metadata: Prisma.JsonValue | null } | null,
  defaults: EditableAboutHighlights,
): EditableAboutHighlights {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    highlightOneValue: asString(
      metadata.highlightOneValue,
      defaults.highlightOneValue,
    ),
    highlightOneLabel: asString(
      metadata.highlightOneLabel,
      defaults.highlightOneLabel,
    ),
    highlightTwoValue: asString(
      metadata.highlightTwoValue,
      defaults.highlightTwoValue,
    ),
    highlightTwoLabel: asString(
      metadata.highlightTwoLabel,
      defaults.highlightTwoLabel,
    ),
    highlightThreeValue: asString(
      metadata.highlightThreeValue,
      defaults.highlightThreeValue,
    ),
    highlightThreeLabel: asString(
      metadata.highlightThreeLabel,
      defaults.highlightThreeLabel,
    ),
  };
}

function parseImagesRow(
  row: { metadata: Prisma.JsonValue | null } | null,
  defaults: EditableAboutImages,
): EditableAboutImages {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    mainImageUrl: asString(metadata.mainImageUrl, defaults.mainImageUrl),
    secondaryImageUrl: asString(
      metadata.secondaryImageUrl,
      defaults.secondaryImageUrl,
    ),
    establishedYear: asString(metadata.establishedYear, defaults.establishedYear),
    establishedLabel: asString(
      metadata.establishedLabel,
      defaults.establishedLabel,
    ),
  };
}

function parseLeadershipHeaderRow(
  row: {
    title: string | null;
    subtitle: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableAboutLeadershipHeader,
): EditableAboutLeadershipHeader {
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
  };
}

export async function getEditableAboutContent(): Promise<EditableAboutContent> {
  const defaults = getDefaultAboutContent();

  const rows = await prisma.pageContent.findMany({
    where: {
      sectionKey: {
        in: [
          ABOUT_HERO_KEY,
          ABOUT_INTRO_KEY,
          ABOUT_VISION_KEY,
          ABOUT_MISSION_KEY,
          ABOUT_HIGHLIGHTS_KEY,
          ABOUT_IMAGES_KEY,
          ABOUT_LEADERSHIP_HEADER_KEY,
        ],
      },
    },
  });

  const findRow = (key: string) => rows.find((row) => row.sectionKey === key) ?? null;

  return {
    hero: parseHeroRow(findRow(ABOUT_HERO_KEY), defaults.hero),
    intro: parseIntroRow(findRow(ABOUT_INTRO_KEY), defaults.intro),
    vision: parseVisionRow(findRow(ABOUT_VISION_KEY), defaults.vision),
    mission: parseMissionRow(findRow(ABOUT_MISSION_KEY), defaults.mission),
    highlights: parseHighlightsRow(findRow(ABOUT_HIGHLIGHTS_KEY), defaults.highlights),
    images: parseImagesRow(findRow(ABOUT_IMAGES_KEY), defaults.images),
    leadershipHeader: parseLeadershipHeaderRow(
      findRow(ABOUT_LEADERSHIP_HEADER_KEY),
      defaults.leadershipHeader,
    ),
  };
}

export function toPublicAboutContent(content: EditableAboutContent): PublicAboutContent {
  return {
    hero: {
      eyebrow: content.hero.eyebrow,
      title: content.hero.title,
      titleEmphasis: content.hero.highlightedTitle,
      subtitle: content.hero.description,
      backgroundImageUrl: content.hero.backgroundImageUrl,
    },
    intro: {
      eyebrow: content.intro.eyebrow,
      title: content.intro.title,
      titleEmphasis: content.intro.highlightedTitle,
      paragraphs: [content.intro.paragraphOne, content.intro.paragraphTwo].filter(
        Boolean,
      ),
    },
    vision: {
      title: content.vision.title,
      text: content.vision.body,
    },
    mission: {
      title: content.mission.title,
      text: content.mission.body,
    },
    highlights: [
      {
        value: content.highlights.highlightOneValue,
        label: content.highlights.highlightOneLabel,
      },
      {
        value: content.highlights.highlightTwoValue,
        label: content.highlights.highlightTwoLabel,
      },
      {
        value: content.highlights.highlightThreeValue,
        label: content.highlights.highlightThreeLabel,
      },
    ],
    images: {
      main: {
        src: content.images.mainImageUrl,
        alt: contentAboutImages.main.alt,
      },
      secondary: {
        src: content.images.secondaryImageUrl,
        alt: contentAboutImages.secondary.alt,
      },
      badge: {
        year: content.images.establishedYear,
        label: content.images.establishedLabel,
      },
    },
    leadershipSection: {
      eyebrow: content.leadershipHeader.eyebrow,
      title: content.leadershipHeader.title,
      titleEmphasis: content.leadershipHeader.highlightedTitle,
      lead: content.leadershipHeader.description,
    },
  };
}

export async function getPublicAboutContent(): Promise<PublicAboutContent> {
  try {
    const content = await getEditableAboutContent();
    return toPublicAboutContent(content);
  } catch {
    return toPublicAboutContent(getDefaultAboutContent());
  }
}

export async function saveEditableAboutContent(
  input: EditableAboutContent,
): Promise<void> {
  await prisma.$transaction([
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_HERO_KEY },
      update: {
        title: input.hero.title.trim(),
        subtitle: input.hero.description.trim(),
        imageUrl: input.hero.backgroundImageUrl.trim(),
        metadata: {
          eyebrow: input.hero.eyebrow.trim(),
          highlightedTitle: input.hero.highlightedTitle.trim(),
        },
      },
      create: {
        sectionKey: ABOUT_HERO_KEY,
        title: input.hero.title.trim(),
        subtitle: input.hero.description.trim(),
        imageUrl: input.hero.backgroundImageUrl.trim(),
        metadata: {
          eyebrow: input.hero.eyebrow.trim(),
          highlightedTitle: input.hero.highlightedTitle.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_INTRO_KEY },
      update: {
        metadata: {
          eyebrow: input.intro.eyebrow.trim(),
          title: input.intro.title.trim(),
          highlightedTitle: input.intro.highlightedTitle.trim(),
          paragraphOne: input.intro.paragraphOne.trim(),
          paragraphTwo: input.intro.paragraphTwo.trim(),
        },
      },
      create: {
        sectionKey: ABOUT_INTRO_KEY,
        metadata: {
          eyebrow: input.intro.eyebrow.trim(),
          title: input.intro.title.trim(),
          highlightedTitle: input.intro.highlightedTitle.trim(),
          paragraphOne: input.intro.paragraphOne.trim(),
          paragraphTwo: input.intro.paragraphTwo.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_VISION_KEY },
      update: {
        title: input.vision.title.trim(),
        body: input.vision.body.trim(),
      },
      create: {
        sectionKey: ABOUT_VISION_KEY,
        title: input.vision.title.trim(),
        body: input.vision.body.trim(),
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_MISSION_KEY },
      update: {
        title: input.mission.title.trim(),
        body: input.mission.body.trim(),
      },
      create: {
        sectionKey: ABOUT_MISSION_KEY,
        title: input.mission.title.trim(),
        body: input.mission.body.trim(),
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_HIGHLIGHTS_KEY },
      update: {
        metadata: {
          highlightOneValue: input.highlights.highlightOneValue.trim(),
          highlightOneLabel: input.highlights.highlightOneLabel.trim(),
          highlightTwoValue: input.highlights.highlightTwoValue.trim(),
          highlightTwoLabel: input.highlights.highlightTwoLabel.trim(),
          highlightThreeValue: input.highlights.highlightThreeValue.trim(),
          highlightThreeLabel: input.highlights.highlightThreeLabel.trim(),
        },
      },
      create: {
        sectionKey: ABOUT_HIGHLIGHTS_KEY,
        metadata: {
          highlightOneValue: input.highlights.highlightOneValue.trim(),
          highlightOneLabel: input.highlights.highlightOneLabel.trim(),
          highlightTwoValue: input.highlights.highlightTwoValue.trim(),
          highlightTwoLabel: input.highlights.highlightTwoLabel.trim(),
          highlightThreeValue: input.highlights.highlightThreeValue.trim(),
          highlightThreeLabel: input.highlights.highlightThreeLabel.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_IMAGES_KEY },
      update: {
        metadata: {
          mainImageUrl: input.images.mainImageUrl.trim(),
          secondaryImageUrl: input.images.secondaryImageUrl.trim(),
          establishedYear: input.images.establishedYear.trim(),
          establishedLabel: input.images.establishedLabel.trim(),
        },
      },
      create: {
        sectionKey: ABOUT_IMAGES_KEY,
        metadata: {
          mainImageUrl: input.images.mainImageUrl.trim(),
          secondaryImageUrl: input.images.secondaryImageUrl.trim(),
          establishedYear: input.images.establishedYear.trim(),
          establishedLabel: input.images.establishedLabel.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: ABOUT_LEADERSHIP_HEADER_KEY },
      update: {
        title: input.leadershipHeader.title.trim(),
        subtitle: input.leadershipHeader.description.trim(),
        metadata: {
          eyebrow: input.leadershipHeader.eyebrow.trim(),
          highlightedTitle: input.leadershipHeader.highlightedTitle.trim(),
        },
      },
      create: {
        sectionKey: ABOUT_LEADERSHIP_HEADER_KEY,
        title: input.leadershipHeader.title.trim(),
        subtitle: input.leadershipHeader.description.trim(),
        metadata: {
          eyebrow: input.leadershipHeader.eyebrow.trim(),
          highlightedTitle: input.leadershipHeader.highlightedTitle.trim(),
        },
      },
    }),
  ]);
}

export function parseAboutFormData(formData: FormData): EditableAboutContent {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    hero: {
      eyebrow: read("hero_eyebrow"),
      title: read("hero_title"),
      highlightedTitle: read("hero_highlightedTitle"),
      description: read("hero_description"),
      backgroundImageUrl: read("hero_backgroundImageUrl"),
    },
    intro: {
      eyebrow: read("intro_eyebrow"),
      title: read("intro_title"),
      highlightedTitle: read("intro_highlightedTitle"),
      paragraphOne: read("intro_paragraphOne"),
      paragraphTwo: read("intro_paragraphTwo"),
    },
    vision: {
      title: read("vision_title"),
      body: read("vision_body"),
    },
    mission: {
      title: read("mission_title"),
      body: read("mission_body"),
    },
    highlights: {
      highlightOneValue: read("highlights_highlightOneValue"),
      highlightOneLabel: read("highlights_highlightOneLabel"),
      highlightTwoValue: read("highlights_highlightTwoValue"),
      highlightTwoLabel: read("highlights_highlightTwoLabel"),
      highlightThreeValue: read("highlights_highlightThreeValue"),
      highlightThreeLabel: read("highlights_highlightThreeLabel"),
    },
    images: {
      mainImageUrl: read("images_mainImageUrl"),
      secondaryImageUrl: read("images_secondaryImageUrl"),
      establishedYear: read("images_establishedYear"),
      establishedLabel: read("images_establishedLabel"),
    },
    leadershipHeader: {
      eyebrow: read("leadership_eyebrow"),
      title: read("leadership_title"),
      highlightedTitle: read("leadership_highlightedTitle"),
      description: read("leadership_description"),
    },
  };
}

function isValidImageUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

export function isValidAboutContent(content: EditableAboutContent): boolean {
  const heroValid = Object.values(content.hero).every(Boolean);
  const introValid =
    Boolean(content.intro.eyebrow) &&
    Boolean(content.intro.title) &&
    Boolean(content.intro.highlightedTitle) &&
    Boolean(content.intro.paragraphOne) &&
    Boolean(content.intro.paragraphTwo);
  const visionValid = Boolean(content.vision.title) && Boolean(content.vision.body);
  const missionValid = Boolean(content.mission.title) && Boolean(content.mission.body);
  const highlightsValid = Object.values(content.highlights).every(Boolean);
  const imagesValid =
    isValidImageUrl(content.images.mainImageUrl) &&
    isValidImageUrl(content.images.secondaryImageUrl) &&
    Boolean(content.images.establishedYear) &&
    Boolean(content.images.establishedLabel);
  const leadershipValid = Object.values(content.leadershipHeader).every(Boolean);
  const heroImageValid = isValidImageUrl(content.hero.backgroundImageUrl);

  return (
    heroValid &&
    introValid &&
    visionValid &&
    missionValid &&
    highlightsValid &&
    imagesValid &&
    leadershipValid &&
    heroImageValid
  );
}
