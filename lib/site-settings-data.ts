import { site } from "@/content/site";
import { prisma } from "@/lib/prisma";

export type EditableSiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  officeHours: string;
  copyright: string;
};

export const SITE_SETTING_KEYS = {
  name: "site.name",
  tagline: "site.tagline",
  phone: "site.phone",
  email: "site.email",
  officeHours: "site.officeHours",
  copyright: "site.copyright",
} as const;

const LEGACY_SETTING_KEYS = {
  phone: "site.phone.display",
  email: "site.email.display",
} as const;

export function getDefaultSiteSettings(): EditableSiteSettings {
  return {
    name: site.name,
    tagline: site.tagline,
    phone: site.phone.display,
    email: site.email.display,
    officeHours: site.officeHours,
    copyright: site.copyright,
  };
}

const ALL_SETTING_KEYS = [
  ...Object.values(SITE_SETTING_KEYS),
  ...Object.values(LEGACY_SETTING_KEYS),
];

export async function getEditableSiteSettings(): Promise<EditableSiteSettings> {
  const defaults = getDefaultSiteSettings();
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ALL_SETTING_KEYS } },
  });

  const values = new Map(rows.map((row) => [row.key, row.value]));

  return {
    name: values.get(SITE_SETTING_KEYS.name) ?? defaults.name,
    tagline: values.get(SITE_SETTING_KEYS.tagline) ?? defaults.tagline,
    phone:
      values.get(SITE_SETTING_KEYS.phone) ??
      values.get(LEGACY_SETTING_KEYS.phone) ??
      defaults.phone,
    email:
      values.get(SITE_SETTING_KEYS.email) ??
      values.get(LEGACY_SETTING_KEYS.email) ??
      defaults.email,
    officeHours:
      values.get(SITE_SETTING_KEYS.officeHours) ?? defaults.officeHours,
    copyright: values.get(SITE_SETTING_KEYS.copyright) ?? defaults.copyright,
  };
}

export async function saveEditableSiteSettings(
  input: EditableSiteSettings,
): Promise<void> {
  const entries = [
    { key: SITE_SETTING_KEYS.name, value: input.name.trim() },
    { key: SITE_SETTING_KEYS.tagline, value: input.tagline.trim() },
    { key: SITE_SETTING_KEYS.phone, value: input.phone.trim() },
    { key: SITE_SETTING_KEYS.email, value: input.email.trim() },
    { key: SITE_SETTING_KEYS.officeHours, value: input.officeHours.trim() },
    { key: SITE_SETTING_KEYS.copyright, value: input.copyright.trim() },
  ];

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.siteSetting.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: entry,
      }),
    ),
  );
}
