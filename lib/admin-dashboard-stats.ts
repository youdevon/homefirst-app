import { prisma } from "@/lib/prisma";
import {
  ABOUT_SECTION_KEYS,
  ABOUT_VISIBILITY_KEY,
  CONTACT_SECTION_KEYS,
  CONTACT_VISIBILITY_KEY,
  HOME_SECTION_KEYS,
  HOME_VISIBILITY_KEY,
  MEDIA_PAGE_SECTION_KEYS,
  MEDIA_PAGE_VISIBILITY_KEY,
  parseVisibilityMetadata,
  SCHEMES_PAGE_SECTION_KEYS,
  SCHEMES_PAGE_VISIBILITY_KEY,
} from "@/lib/section-visibility";
import { getEditableSiteSettings } from "@/lib/site-settings-data";
import { getThemePresetLabel } from "@/lib/theme-presets";

export type AdminDashboardStats = {
  aiAssistantEnabled: boolean;
  themePreset: string;
  themePresetLabel: string;
  recentUpdateCount: number;
  hiddenSectionCount: number;
};

const VISIBILITY_ROWS = [
  { sectionKey: HOME_VISIBILITY_KEY, keys: HOME_SECTION_KEYS },
  { sectionKey: ABOUT_VISIBILITY_KEY, keys: ABOUT_SECTION_KEYS },
  { sectionKey: SCHEMES_PAGE_VISIBILITY_KEY, keys: SCHEMES_PAGE_SECTION_KEYS },
  { sectionKey: MEDIA_PAGE_VISIBILITY_KEY, keys: MEDIA_PAGE_SECTION_KEYS },
  { sectionKey: CONTACT_VISIBILITY_KEY, keys: CONTACT_SECTION_KEYS },
] as const;

async function countHiddenSections(): Promise<number> {
  try {
    const rows = await prisma.pageContent.findMany({
      where: {
        sectionKey: {
          in: VISIBILITY_ROWS.map((row) => row.sectionKey),
        },
      },
      select: {
        sectionKey: true,
        metadata: true,
      },
    });

    const rowMap = new Map(rows.map((row) => [row.sectionKey, row.metadata]));
    let hidden = 0;

    for (const { sectionKey, keys } of VISIBILITY_ROWS) {
      const visibility = parseVisibilityMetadata(rowMap.get(sectionKey) ?? null, keys);
      for (const key of keys) {
        if (visibility[key] === false) {
          hidden += 1;
        }
      }
    }

    return hidden;
  } catch {
    return 0;
  }
}

async function countRecentAuditUpdates(): Promise<number> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    return await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    });
  } catch {
    return 0;
  }
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [settings, recentUpdateCount, hiddenSectionCount] = await Promise.all([
    getEditableSiteSettings(),
    countRecentAuditUpdates(),
    countHiddenSections(),
  ]);

  return {
    aiAssistantEnabled: settings.aiAssistantEnabled,
    themePreset: settings.themePreset,
    themePresetLabel: getThemePresetLabel(settings.themePreset),
    recentUpdateCount,
    hiddenSectionCount,
  };
}
