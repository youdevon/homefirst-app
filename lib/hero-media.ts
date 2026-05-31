export const HERO_MEDIA_SLOTS = 10;

export type HeroMediaType = "image" | "video";

export type HeroMediaItem = {
  type: HeroMediaType;
  url: string;
  posterUrl: string;
  displayOrder: number;
  active: boolean;
};

export type PublicHeroMediaItem = {
  type: HeroMediaType;
  url: string;
  posterUrl: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseHeroMediaType(value: unknown): HeroMediaType {
  return value === "video" ? "video" : "image";
}

export function normalizeHeroMediaSlots(items: HeroMediaItem[]): HeroMediaItem[] {
  const slots = Array.from({ length: HERO_MEDIA_SLOTS }, (_, index) => {
    const existing = items[index];
    return {
      type: existing?.type ?? "image",
      url: (existing?.url ?? "").trim(),
      posterUrl: (existing?.posterUrl ?? "").trim(),
      displayOrder: existing?.displayOrder ?? index + 1,
      active: existing?.active ?? Boolean(existing?.url?.trim()),
    };
  });

  return slots;
}

export function parseHeroMediaFromMetadata(
  metadata: unknown,
  heroImages: string[],
  backgroundImageUrl: string,
): HeroMediaItem[] {
  const record = asRecord(metadata);
  const raw = record.heroMedia;

  if (Array.isArray(raw) && raw.length > 0) {
    const parsed = raw
      .map((entry, index) => {
        const item = asRecord(entry);
        const url = typeof item.url === "string" ? item.url.trim() : "";
        return {
          type: parseHeroMediaType(item.type),
          url,
          posterUrl: typeof item.posterUrl === "string" ? item.posterUrl.trim() : "",
          displayOrder:
            typeof item.displayOrder === "number" ? item.displayOrder : index + 1,
          active:
            typeof item.active === "boolean"
              ? item.active
              : Boolean(url),
        } satisfies HeroMediaItem;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const slots = Array.from({ length: HERO_MEDIA_SLOTS }, (_, index) => {
      const item = parsed[index];
      if (item) {
        return { ...item, displayOrder: index + 1 };
      }

      return {
        type: "image" as const,
        url: "",
        posterUrl: "",
        displayOrder: index + 1,
        active: false,
      };
    });

    return slots;
  }

  const fromImages = heroImages.filter(Boolean);
  if (fromImages.length > 0) {
    return normalizeHeroMediaSlots(
      fromImages.map((url, index) => ({
        type: "image" as const,
        url,
        posterUrl: "",
        displayOrder: index + 1,
        active: true,
      })),
    );
  }

  if (backgroundImageUrl.trim()) {
    return normalizeHeroMediaSlots([
      {
        type: "image",
        url: backgroundImageUrl.trim(),
        posterUrl: "",
        displayOrder: 1,
        active: true,
      },
    ]);
  }

  return normalizeHeroMediaSlots([]);
}

export function resolvePublicHeroMedia(
  items: HeroMediaItem[],
  fallbackImageUrl: string,
): PublicHeroMediaItem[] {
  const active = items
    .filter((item) => item.active && item.url.trim())
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item) => ({
      type: item.type,
      url: item.url.trim(),
      posterUrl: item.posterUrl.trim(),
    }));

  if (active.length > 0) {
    return active;
  }

  if (fallbackImageUrl.trim()) {
    return [
      {
        type: "image",
        url: fallbackImageUrl.trim(),
        posterUrl: "",
      },
    ];
  }

  return [];
}

export function heroMediaToMetadata(items: HeroMediaItem[]): HeroMediaItem[] {
  return items.map((item, index) => ({
    type: item.type,
    url: item.url.trim(),
    posterUrl: item.posterUrl.trim(),
    displayOrder: index + 1,
    active: item.active && Boolean(item.url.trim()),
  }));
}

export function syncHeroImagesFromMedia(items: HeroMediaItem[]): string[] {
  return items
    .filter((item) => item.active && item.type === "image" && item.url.trim())
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item) => item.url.trim());
}
