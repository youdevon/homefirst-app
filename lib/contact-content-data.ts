import {
  contactCards as contentContactCards,
  contactDetails as contentContactDetails,
  contactFormPlaceholder,
  contactHero as contentContactHero,
  contactInstructions as contentContactInstructions,
} from "@/content/contact";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  CONTACT_SECTION_KEYS,
  CONTACT_VISIBILITY_KEY,
  getPageVisibility,
  parsePartialVisibilityFromFormData,
  savePartialPageVisibility,
  type ContactSectionVisibility,
} from "@/lib/section-visibility";

export const CONTACT_HERO_KEY = "contact.hero";
export const CONTACT_DETAILS_KEY = "contact.details";
export const CONTACT_INSTRUCTIONS_KEY = "contact.instructions";
export const CONTACT_CARDS_KEY = "contact.cards";
export const CONTACT_FORM_KEY = "contact.form";

export const MAX_CONTACT_CARDS = 6;

export type EditableContactHero = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  backgroundImageUrl: string;
};

export type EditableContactDetails = {
  officeName: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  mapEmbedUrl: string;
  mapUrl: string;
};

export type EditableContactInstructions = {
  title: string;
  highlightedTitle: string;
  description: string;
  items: string[];
};

export type EditableContactCard = {
  title: string;
  description: string;
  icon: string;
  linkLabel: string;
  linkHref: string;
  displayOrder: number;
  active: boolean;
};

export type EditableContactFormCopy = {
  detailsEyebrow: string;
  title: string;
  description: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  submitLabel: string;
};

export type EditableContactContent = {
  hero: EditableContactHero;
  details: EditableContactDetails;
  instructions: EditableContactInstructions;
  formCopy: EditableContactFormCopy;
  cards: EditableContactCard[];
  visibility: ContactSectionVisibility;
};

export type ContactContentFields = Omit<EditableContactContent, "visibility">;

export type PublicContactFormPlaceholder = EditableContactFormCopy;

export type PublicContactContent = {
  hero: EditableContactHero;
  details: EditableContactDetails & {
    phoneHref: string;
    emailHref: string;
  };
  instructions: EditableContactInstructions;
  formPlaceholder: PublicContactFormPlaceholder;
  cards: EditableContactCard[];
  visibility: ContactSectionVisibility;
};

export {
  CONTACT_VISIBILITY_KEY,
  CONTACT_SECTION_KEYS,
  CONTACT_SECTION_LABELS,
} from "@/lib/section-visibility";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
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

function toPhoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "tel:";
}

function toEmailHref(email: string): string {
  return email ? `mailto:${email}` : "mailto:";
}

export function getDefaultContactHero(): EditableContactHero {
  return {
    eyebrow: contentContactHero.eyebrow,
    title: contentContactHero.title,
    highlightedTitle: contentContactHero.highlightedTitle,
    description: contentContactHero.description,
    backgroundImageUrl: contentContactHero.backgroundImageUrl,
  };
}

export function getDefaultContactDetails(): EditableContactDetails {
  return { ...contentContactDetails };
}

export function getDefaultContactInstructions(): EditableContactInstructions {
  return {
    title: contentContactInstructions.title,
    highlightedTitle: contentContactInstructions.highlightedTitle,
    description: contentContactInstructions.description,
    items: [...contentContactInstructions.items],
  };
}

export function getDefaultContactCards(): EditableContactCard[] {
  return contentContactCards.map((card) => ({ ...card }));
}

export function getDefaultContactFormCopy(): EditableContactFormCopy {
  return {
    detailsEyebrow: "Office Details",
    title: contactFormPlaceholder.title,
    description: contactFormPlaceholder.description,
    nameLabel: contactFormPlaceholder.nameLabel,
    emailLabel: contactFormPlaceholder.emailLabel,
    phoneLabel: contactFormPlaceholder.phoneLabel,
    messageLabel: contactFormPlaceholder.messageLabel,
    submitLabel: contactFormPlaceholder.submitLabel,
  };
}

export function getDefaultContactContent(): EditableContactContent {
  return {
    hero: getDefaultContactHero(),
    details: getDefaultContactDetails(),
    instructions: getDefaultContactInstructions(),
    formCopy: getDefaultContactFormCopy(),
    cards: getDefaultContactCards(),
    visibility: Object.fromEntries(
      CONTACT_SECTION_KEYS.map((key) => [key, true]),
    ) as ContactSectionVisibility,
  };
}

function parseHeroRow(
  row: {
    title: string | null;
    subtitle: string | null;
    imageUrl: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableContactHero,
): EditableContactHero {
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

function parseDetailsRow(
  row: { metadata: Prisma.JsonValue | null } | null,
  defaults: EditableContactDetails,
): EditableContactDetails {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    officeName: asString(metadata.officeName, defaults.officeName),
    address: asString(metadata.address, defaults.address),
    phone: asString(metadata.phone, defaults.phone),
    email: asString(metadata.email, defaults.email),
    officeHours: asString(metadata.officeHours, defaults.officeHours),
    mapEmbedUrl: asString(metadata.mapEmbedUrl, defaults.mapEmbedUrl),
    mapUrl: asString(metadata.mapUrl, defaults.mapUrl),
  };
}

function parseInstructionsRow(
  row: {
    title: string | null;
    subtitle: string | null;
    body: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableContactInstructions,
): EditableContactInstructions {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const bodyItems = asString(row.body, "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    title: asString(row.title, defaults.title),
    highlightedTitle: asString(
      metadata.highlightedTitle ?? metadata.titleEmphasis,
      defaults.highlightedTitle,
    ),
    description: asString(row.subtitle, defaults.description),
    items: asStringArray(metadata.items, bodyItems.length ? bodyItems : defaults.items),
  };
}

function parseContactCard(value: unknown, fallback: EditableContactCard): EditableContactCard {
  const record = asRecord(value);

  return {
    title: asString(record.title, fallback.title),
    description: asString(record.description, fallback.description),
    icon: asString(record.icon, fallback.icon),
    linkLabel: asString(record.linkLabel, fallback.linkLabel),
    linkHref: asString(record.linkHref, fallback.linkHref),
    displayOrder: asNumber(record.displayOrder, fallback.displayOrder),
    active: asBoolean(record.active, fallback.active),
  };
}

function parseCardsRow(
  row: { metadata: Prisma.JsonValue | null } | null,
  defaults: EditableContactCard[],
): EditableContactCard[] {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);
  const rawCards = metadata.cards;

  if (!Array.isArray(rawCards) || rawCards.length === 0) {
    return defaults;
  }

  return rawCards.map((card, index) =>
    parseContactCard(card, defaults[index] ?? defaults[defaults.length - 1]),
  );
}

function parseFormCopyRow(
  row: {
    title: string | null;
    subtitle: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableContactFormCopy,
): EditableContactFormCopy {
  if (!row) {
    return defaults;
  }

  const metadata = asRecord(row.metadata);

  return {
    detailsEyebrow: asString(metadata.detailsEyebrow, defaults.detailsEyebrow),
    title: asString(row.title, defaults.title),
    description: asString(row.subtitle, defaults.description),
    nameLabel: asString(metadata.nameLabel, defaults.nameLabel),
    emailLabel: asString(metadata.emailLabel, defaults.emailLabel),
    phoneLabel: asString(metadata.phoneLabel, defaults.phoneLabel),
    messageLabel: asString(metadata.messageLabel, defaults.messageLabel),
    submitLabel: asString(metadata.submitLabel, defaults.submitLabel),
  };
}

export async function getEditableContactContent(): Promise<EditableContactContent> {
  const defaults = getDefaultContactContent();
  const visibility = await getPageVisibility(CONTACT_VISIBILITY_KEY, CONTACT_SECTION_KEYS);

  const rows = await prisma.pageContent.findMany({
    where: {
      sectionKey: {
        in: [
          CONTACT_HERO_KEY,
          CONTACT_DETAILS_KEY,
          CONTACT_INSTRUCTIONS_KEY,
          CONTACT_CARDS_KEY,
          CONTACT_FORM_KEY,
        ],
      },
    },
  });

  const heroRow = rows.find((row) => row.sectionKey === CONTACT_HERO_KEY) ?? null;
  const detailsRow =
    rows.find((row) => row.sectionKey === CONTACT_DETAILS_KEY) ?? null;
  const instructionsRow =
    rows.find((row) => row.sectionKey === CONTACT_INSTRUCTIONS_KEY) ?? null;
  const cardsRow = rows.find((row) => row.sectionKey === CONTACT_CARDS_KEY) ?? null;
  const formRow = rows.find((row) => row.sectionKey === CONTACT_FORM_KEY) ?? null;

  return {
    hero: parseHeroRow(heroRow, defaults.hero),
    details: parseDetailsRow(detailsRow, defaults.details),
    instructions: parseInstructionsRow(instructionsRow, defaults.instructions),
    formCopy: parseFormCopyRow(formRow, defaults.formCopy),
    cards: parseCardsRow(cardsRow, defaults.cards),
    visibility: visibility as ContactSectionVisibility,
  };
}

export function toPublicContactContent(
  content: EditableContactContent,
): PublicContactContent {
  const activeCards = content.cards
    .filter((card) => card.active && card.title.trim())
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    hero: content.hero,
    details: {
      ...content.details,
      phoneHref: toPhoneHref(content.details.phone),
      emailHref: toEmailHref(content.details.email),
    },
    instructions: content.instructions,
    formPlaceholder: content.formCopy,
    cards: activeCards.length > 0 ? activeCards : getDefaultContactCards().filter((c) => c.active),
    visibility: content.visibility,
  };
}

export async function getPublicContactContent(): Promise<PublicContactContent> {
  try {
    const content = await getEditableContactContent();
    return toPublicContactContent(content);
  } catch {
    return toPublicContactContent(getDefaultContactContent());
  }
}

export async function saveEditableContactContent(
  input: ContactContentFields,
  visibilityPartial: Partial<ContactSectionVisibility>,
): Promise<ContactSectionVisibility> {
  await prisma.$transaction([
    prisma.pageContent.upsert({
      where: { sectionKey: CONTACT_HERO_KEY },
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
        sectionKey: CONTACT_HERO_KEY,
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
      where: { sectionKey: CONTACT_DETAILS_KEY },
      update: {
        metadata: {
          officeName: input.details.officeName.trim(),
          address: input.details.address.trim(),
          phone: input.details.phone.trim(),
          email: input.details.email.trim(),
          officeHours: input.details.officeHours.trim(),
          mapEmbedUrl: input.details.mapEmbedUrl.trim(),
          mapUrl: input.details.mapUrl.trim(),
        },
      },
      create: {
        sectionKey: CONTACT_DETAILS_KEY,
        metadata: {
          officeName: input.details.officeName.trim(),
          address: input.details.address.trim(),
          phone: input.details.phone.trim(),
          email: input.details.email.trim(),
          officeHours: input.details.officeHours.trim(),
          mapEmbedUrl: input.details.mapEmbedUrl.trim(),
          mapUrl: input.details.mapUrl.trim(),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: CONTACT_INSTRUCTIONS_KEY },
      update: {
        title: input.instructions.title.trim(),
        subtitle: input.instructions.description.trim(),
        body: input.instructions.items.join("\n"),
        metadata: {
          highlightedTitle: input.instructions.highlightedTitle.trim(),
          items: input.instructions.items,
        },
      },
      create: {
        sectionKey: CONTACT_INSTRUCTIONS_KEY,
        title: input.instructions.title.trim(),
        subtitle: input.instructions.description.trim(),
        body: input.instructions.items.join("\n"),
        metadata: {
          highlightedTitle: input.instructions.highlightedTitle.trim(),
          items: input.instructions.items,
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: CONTACT_CARDS_KEY },
      update: {
        metadata: {
          cards: input.cards.map((card) => ({
            title: card.title.trim(),
            description: card.description.trim(),
            icon: card.icon.trim(),
            linkLabel: card.linkLabel.trim(),
            linkHref: card.linkHref.trim(),
            displayOrder: card.displayOrder,
            active: card.active,
          })),
        },
      },
      create: {
        sectionKey: CONTACT_CARDS_KEY,
        metadata: {
          cards: input.cards.map((card) => ({
            title: card.title.trim(),
            description: card.description.trim(),
            icon: card.icon.trim(),
            linkLabel: card.linkLabel.trim(),
            linkHref: card.linkHref.trim(),
            displayOrder: card.displayOrder,
            active: card.active,
          })),
        },
      },
    }),
    prisma.pageContent.upsert({
      where: { sectionKey: CONTACT_FORM_KEY },
      update: {
        title: input.formCopy.title.trim(),
        subtitle: input.formCopy.description.trim(),
        metadata: {
          detailsEyebrow: input.formCopy.detailsEyebrow.trim(),
          nameLabel: input.formCopy.nameLabel.trim(),
          emailLabel: input.formCopy.emailLabel.trim(),
          phoneLabel: input.formCopy.phoneLabel.trim(),
          messageLabel: input.formCopy.messageLabel.trim(),
          submitLabel: input.formCopy.submitLabel.trim(),
        },
      },
      create: {
        sectionKey: CONTACT_FORM_KEY,
        title: input.formCopy.title.trim(),
        subtitle: input.formCopy.description.trim(),
        metadata: {
          detailsEyebrow: input.formCopy.detailsEyebrow.trim(),
          nameLabel: input.formCopy.nameLabel.trim(),
          emailLabel: input.formCopy.emailLabel.trim(),
          phoneLabel: input.formCopy.phoneLabel.trim(),
          messageLabel: input.formCopy.messageLabel.trim(),
          submitLabel: input.formCopy.submitLabel.trim(),
        },
      },
    }),
  ]);

  return savePartialPageVisibility(
    CONTACT_VISIBILITY_KEY,
    CONTACT_SECTION_KEYS,
    visibilityPartial,
  ) as Promise<ContactSectionVisibility>;
}

export function parseContactVisibilityFromFormData(
  formData: FormData,
): Partial<ContactSectionVisibility> {
  return parsePartialVisibilityFromFormData(
    formData,
    CONTACT_SECTION_KEYS,
  ) as Partial<ContactSectionVisibility>;
}

function readCardFromForm(formData: FormData, index: number): EditableContactCard {
  const read = (name: string) =>
    String(formData.get(`card_${index}_${name}`) ?? "").trim();

  const displayOrder = Number.parseInt(read("displayOrder"), 10);

  return {
    title: read("title"),
    description: read("description"),
    icon: read("icon"),
    linkLabel: read("linkLabel"),
    linkHref: read("linkHref"),
    displayOrder: Number.isNaN(displayOrder) ? index : displayOrder,
    active: String(formData.get(`card_${index}_active`) ?? "false") === "true",
  };
}

export function parseContactFormData(formData: FormData): ContactContentFields {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  const cards = Array.from({ length: MAX_CONTACT_CARDS }, (_, index) =>
    readCardFromForm(formData, index),
  ).filter((card) => card.title || card.description || card.linkHref);

  return {
    hero: {
      eyebrow: read("hero_eyebrow"),
      title: read("hero_title"),
      highlightedTitle: read("hero_highlightedTitle"),
      description: read("hero_description"),
      backgroundImageUrl: read("hero_backgroundImageUrl"),
    },
    details: {
      officeName: read("details_officeName"),
      address: read("details_address"),
      phone: read("details_phone"),
      email: read("details_email"),
      officeHours: read("details_officeHours"),
      mapEmbedUrl: read("details_mapEmbedUrl"),
      mapUrl: read("details_mapUrl"),
    },
    instructions: {
      title: read("instructions_title"),
      highlightedTitle: read("instructions_highlightedTitle"),
      description: read("instructions_description"),
      items: read("instructions_items")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    },
    formCopy: {
      detailsEyebrow: read("form_detailsEyebrow"),
      title: read("form_title"),
      description: read("form_description"),
      nameLabel: read("form_nameLabel"),
      emailLabel: read("form_emailLabel"),
      phoneLabel: read("form_phoneLabel"),
      messageLabel: read("form_messageLabel"),
      submitLabel: read("form_submitLabel"),
    },
    cards: cards.length > 0 ? cards : getDefaultContactCards(),
  };
}

function isValidUrlField(value: string): boolean {
  if (!value) {
    return true;
  }

  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("tel:") ||
    value.startsWith("mailto:")
  );
}

export function isValidContactContent(content: ContactContentFields): boolean {
  const heroValid = Object.values(content.hero).every(Boolean);
  const detailsRequired = [
    content.details.officeName,
    content.details.address,
    content.details.phone,
    content.details.email,
    content.details.officeHours,
  ].every(Boolean);

  const instructionsValid =
    Boolean(content.instructions.title) &&
    Boolean(content.instructions.highlightedTitle) &&
    Boolean(content.instructions.description) &&
    content.instructions.items.length > 0;

  const cardsValid = content.cards.some(
    (card) =>
      card.active &&
      card.title &&
      card.description &&
      card.linkLabel &&
      card.linkHref &&
      isValidUrlField(card.linkHref),
  );

  const formValid = Object.values(content.formCopy).every(Boolean);

  const urlsValid =
    isValidUrlField(content.hero.backgroundImageUrl) &&
    isValidUrlField(content.details.mapEmbedUrl) &&
    isValidUrlField(content.details.mapUrl) &&
    content.details.email.includes("@");

  return (
    heroValid &&
    detailsRequired &&
    instructionsValid &&
    cardsValid &&
    formValid &&
    urlsValid
  );
}

export function getContactCardSlots(cards: EditableContactCard[]): EditableContactCard[] {
  const slots: EditableContactCard[] = [];

  for (let index = 0; index < MAX_CONTACT_CARDS; index += 1) {
    slots.push(
      cards[index] ?? {
        title: "",
        description: "",
        icon: "",
        linkLabel: "",
        linkHref: "",
        displayOrder: index,
        active: false,
      },
    );
  }

  return slots;
}
