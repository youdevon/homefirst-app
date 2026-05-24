import { videoSection } from "@/content/home";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const VIDEOS_SECTION_KEY = "home.videos";
const LEGACY_VIDEOS_SECTION_KEY = "home.video";

export type EditableVideoSectionHeader = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
};

export type EditableHomepageVideo = {
  id: string;
  title: string;
  meta: string;
  videoUrl: string;
  thumbnailUrl: string;
  displayOrder: number;
  active: boolean;
  featured: boolean;
};

export type HomepageVideoFormInput = {
  title: string;
  meta: string;
  videoUrl: string;
  thumbnailUrl: string;
  displayOrder: number;
  active: boolean;
  featured: boolean;
};

export type PublicHomepageVideo = {
  id: string;
  title: string;
  meta: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
};

export type PublicVideoSection = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  featuredVideo: PublicHomepageVideo;
  videos: PublicHomepageVideo[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function optionalUrl(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

function mapDbVideo(video: {
  id: string;
  title: string;
  meta: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
  active: boolean;
  featured: boolean;
}): EditableHomepageVideo {
  return {
    id: video.id,
    title: video.title,
    meta: video.meta,
    videoUrl: video.videoUrl ?? "",
    thumbnailUrl: video.thumbnailUrl ?? "",
    displayOrder: video.displayOrder,
    active: video.active,
    featured: video.featured,
  };
}

function mapPublicVideo(video: EditableHomepageVideo): PublicHomepageVideo {
  return {
    id: video.id,
    title: video.title,
    meta: video.meta,
    videoUrl: optionalUrl(video.videoUrl),
    thumbnailUrl: optionalUrl(video.thumbnailUrl),
  };
}

export function getDefaultVideoSectionHeader(): EditableVideoSectionHeader {
  return {
    eyebrow: videoSection.eyebrow,
    title: videoSection.title,
    highlightedTitle: videoSection.titleEmphasis,
    description: videoSection.lead,
  };
}

function getContentFallbackVideos(): PublicHomepageVideo[] {
  return videoSection.videos.map((video, index) => ({
    id: `fallback-${index}`,
    title: video.title,
    meta: video.meta,
    videoUrl: null,
    thumbnailUrl: video.image,
  }));
}

function getContentFallbackSection(): PublicVideoSection {
  const videos = getContentFallbackVideos();
  const featuredVideo: PublicHomepageVideo = {
    id: "fallback-main",
    title: videoSection.mainVideo.alt,
    meta: "",
    videoUrl: null,
    thumbnailUrl: videoSection.mainVideo.image,
  };

  return {
    ...getDefaultVideoSectionHeader(),
    featuredVideo,
    videos: videos.length > 0 ? videos : [featuredVideo],
  };
}

function parseSectionHeaderFromPageContent(
  row: {
    title: string | null;
    subtitle: string | null;
    metadata: Prisma.JsonValue | null;
  } | null,
  defaults: EditableVideoSectionHeader,
): EditableVideoSectionHeader {
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

async function getVideoSectionHeaderRow() {
  const rows = await prisma.pageContent.findMany({
    where: {
      sectionKey: {
        in: [VIDEOS_SECTION_KEY, LEGACY_VIDEOS_SECTION_KEY],
      },
    },
  });

  return (
    rows.find((row) => row.sectionKey === VIDEOS_SECTION_KEY) ??
    rows.find((row) => row.sectionKey === LEGACY_VIDEOS_SECTION_KEY) ??
    null
  );
}

export async function getEditableVideoSectionHeader(): Promise<EditableVideoSectionHeader> {
  const defaults = getDefaultVideoSectionHeader();
  const row = await getVideoSectionHeaderRow();
  return parseSectionHeaderFromPageContent(row, defaults);
}

export async function getAllHomepageVideosForAdmin(): Promise<EditableHomepageVideo[]> {
  const rows = await prisma.homepageVideo.findMany({
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
  });

  return rows.map(mapDbVideo);
}

export async function getHomepageVideoById(
  id: string,
): Promise<EditableHomepageVideo | null> {
  const video = await prisma.homepageVideo.findUnique({ where: { id } });
  return video ? mapDbVideo(video) : null;
}


export async function getPublicVideoSection(): Promise<PublicVideoSection> {
  try {
    const [headerRow, dbVideos, headerDefaults] = await Promise.all([
      getVideoSectionHeaderRow(),
      prisma.homepageVideo.findMany({
        where: { active: true },
        orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
      }),
      Promise.resolve(getDefaultVideoSectionHeader()),
    ]);

    const header = parseSectionHeaderFromPageContent(headerRow, headerDefaults);

    if (dbVideos.length === 0) {
      return getContentFallbackSection();
    }

    const videos = dbVideos.map((video) =>
      mapPublicVideo(mapDbVideo(video)),
    );
    const featuredRow =
      dbVideos.find((video) => video.featured) ?? dbVideos[0];
    const featuredVideo = mapPublicVideo(mapDbVideo(featuredRow));

    return {
      eyebrow: header.eyebrow,
      title: header.title,
      highlightedTitle: header.highlightedTitle,
      description: header.description,
      featuredVideo,
      videos,
    };
  } catch {
    return getContentFallbackSection();
  }
}

export async function saveVideoSectionHeader(
  input: EditableVideoSectionHeader,
): Promise<void> {
  await prisma.pageContent.upsert({
    where: { sectionKey: VIDEOS_SECTION_KEY },
    update: {
      title: input.title.trim(),
      subtitle: input.description.trim(),
      metadata: {
        eyebrow: input.eyebrow.trim(),
        highlightedTitle: input.highlightedTitle.trim(),
      },
    },
    create: {
      sectionKey: VIDEOS_SECTION_KEY,
      title: input.title.trim(),
      subtitle: input.description.trim(),
      metadata: {
        eyebrow: input.eyebrow.trim(),
        highlightedTitle: input.highlightedTitle.trim(),
      },
    },
  });
}

async function applyFeaturedFlag(videoId: string, featured: boolean): Promise<void> {
  if (!featured) {
    return;
  }

  await prisma.$transaction([
    prisma.homepageVideo.updateMany({
      data: { featured: false },
    }),
    prisma.homepageVideo.update({
      where: { id: videoId },
      data: { featured: true },
    }),
  ]);
}

export async function createHomepageVideo(
  input: HomepageVideoFormInput,
): Promise<string> {
  const created = await prisma.homepageVideo.create({
    data: {
      title: input.title.trim(),
      meta: input.meta.trim(),
      videoUrl: optionalUrl(input.videoUrl),
      thumbnailUrl: optionalUrl(input.thumbnailUrl),
      displayOrder: input.displayOrder,
      active: input.active,
      featured: input.featured,
    },
  });

  if (input.featured) {
    await applyFeaturedFlag(created.id, true);
  } else {
    const featuredCount = await prisma.homepageVideo.count({
      where: { featured: true },
    });

    if (featuredCount === 0) {
      await prisma.homepageVideo.update({
        where: { id: created.id },
        data: { featured: true },
      });
    }
  }

  return created.id;
}

export async function updateHomepageVideo(
  id: string,
  input: HomepageVideoFormInput,
): Promise<void> {
  await prisma.homepageVideo.update({
    where: { id },
    data: {
      title: input.title.trim(),
      meta: input.meta.trim(),
      videoUrl: optionalUrl(input.videoUrl),
      thumbnailUrl: optionalUrl(input.thumbnailUrl),
      displayOrder: input.displayOrder,
      active: input.active,
      featured: input.featured,
    },
  });

  if (input.featured) {
    await applyFeaturedFlag(id, true);
  }
}

export async function setHomepageVideoActive(
  id: string,
  active: boolean,
): Promise<void> {
  await prisma.homepageVideo.update({
    where: { id },
    data: { active },
  });
}

export async function setHomepageVideoFeatured(id: string): Promise<void> {
  await applyFeaturedFlag(id, true);
}

export function parseVideoSectionHeaderFormData(
  formData: FormData,
): EditableVideoSectionHeader {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    eyebrow: read("videos_eyebrow"),
    title: read("videos_title"),
    highlightedTitle: read("videos_highlightedTitle"),
    description: read("videos_description"),
  };
}

export function parseHomepageVideoFormData(
  formData: FormData,
): HomepageVideoFormInput {
  const displayOrder = Number.parseInt(
    String(formData.get("displayOrder") ?? "0"),
    10,
  );

  return {
    title: String(formData.get("title") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    videoUrl: String(formData.get("videoUrl") ?? "").trim(),
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? "").trim(),
    displayOrder: Number.isNaN(displayOrder) ? 0 : displayOrder,
    active: String(formData.get("active") ?? "true") === "true",
    featured: String(formData.get("featured") ?? "false") === "true",
  };
}

export function isValidVideoSectionHeader(
  input: EditableVideoSectionHeader,
): boolean {
  return (
    Boolean(input.eyebrow) &&
    Boolean(input.title) &&
    Boolean(input.highlightedTitle) &&
    Boolean(input.description)
  );
}

export function isValidHomepageVideoInput(
  input: HomepageVideoFormInput,
): boolean {
  return (
    Boolean(input.title) &&
    input.displayOrder >= 0 &&
    (Boolean(input.videoUrl) || Boolean(input.thumbnailUrl))
  );
}
