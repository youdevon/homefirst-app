import { newsItems as contentNewsItems } from "@/content/news";
import { slugifyTitle } from "@/lib/news-slug";
import { prisma } from "@/lib/prisma";

export const NEWS_CATEGORIES = [
  "Notice",
  "Update",
  "Event",
  "Press Release",
  "News",
] as const;

export const MEDIA_FILTER_CATEGORIES = [
  { label: "All", value: "" },
  { label: "Notices", value: "Notice" },
  { label: "Updates", value: "Update" },
  { label: "Events", value: "Event" },
  { label: "Press Releases", value: "Press Release" },
  { label: "News", value: "News" },
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type PublicNewsItem = {
  slug: string;
  category: string;
  title: string;
  text: string;
  date: string;
  image: string;
  featured: boolean;
};

export type PublicNewsArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  dateLabel: string;
  publishedAt: Date | null;
  imageUrl: string;
  imageUrlTwo: string;
  imageUrlThree: string;
  imageCaptionOne: string;
  imageCaptionTwo: string;
  imageCaptionThree: string;
};

export type EditableNewsItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  imageUrl: string;
  imageUrlTwo: string;
  imageUrlThree: string;
  imageCaptionOne: string;
  imageCaptionTwo: string;
  imageCaptionThree: string;
  published: boolean;
  publishedAt: Date | null;
};

export type NewsFormInput = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  imageUrl: string;
  imageUrlTwo: string;
  imageUrlThree: string;
  imageCaptionOne: string;
  imageCaptionTwo: string;
  imageCaptionThree: string;
  published: boolean;
  publishedAt: Date | null;
};

type DbNewsItem = {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  summary: string;
  body: string | null;
  imageUrl: string | null;
  imageUrlTwo: string | null;
  imageUrlThree: string | null;
  imageCaptionOne: string | null;
  imageCaptionTwo: string | null;
  imageCaptionThree: string | null;
  published: boolean;
  publishedAt: Date | null;
};

export function formatPublicDate(date: Date | null): string {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function resolveSlug(title: string, slug: string | null | undefined): string {
  const trimmed = slug?.trim();
  if (trimmed) {
    return trimmed;
  }

  return slugifyTitle(title);
}

function mapDbNewsItem(item: DbNewsItem): EditableNewsItem {
  return {
    id: item.id,
    title: item.title,
    slug: resolveSlug(item.title, item.slug),
    category: item.category,
    summary: item.summary,
    body: item.body ?? "",
    imageUrl: item.imageUrl ?? "",
    imageUrlTwo: item.imageUrlTwo ?? "",
    imageUrlThree: item.imageUrlThree ?? "",
    imageCaptionOne: item.imageCaptionOne ?? "",
    imageCaptionTwo: item.imageCaptionTwo ?? "",
    imageCaptionThree: item.imageCaptionThree ?? "",
    published: item.published,
    publishedAt: item.publishedAt,
  };
}

function mapPublicNewsArticle(item: EditableNewsItem): PublicNewsArticle {
  return {
    slug: item.slug,
    category: item.category,
    title: item.title,
    summary: item.summary,
    body: item.body,
    dateLabel: formatPublicDate(item.publishedAt),
    publishedAt: item.publishedAt,
    imageUrl: item.imageUrl,
    imageUrlTwo: item.imageUrlTwo,
    imageUrlThree: item.imageUrlThree,
    imageCaptionOne: item.imageCaptionOne,
    imageCaptionTwo: item.imageCaptionTwo,
    imageCaptionThree: item.imageCaptionThree,
  };
}

function mapPublicNewsItem(
  item: EditableNewsItem,
  featured: boolean,
): PublicNewsItem {
  return {
    slug: item.slug,
    category: item.category,
    title: item.title,
    text: item.summary,
    date: formatPublicDate(item.publishedAt),
    image: item.imageUrl,
    featured,
  };
}

function getContentFallbackEditableItems(): EditableNewsItem[] {
  return contentNewsItems.map((item, index) => ({
    id: `fallback-${index + 1}`,
    title: item.title,
    slug: slugifyTitle(item.title),
    category: item.category,
    summary: item.text,
    body: item.text,
    imageUrl: item.image,
    imageUrlTwo: "",
    imageUrlThree: "",
    imageCaptionOne: "",
    imageCaptionTwo: "",
    imageCaptionThree: "",
    published: true,
    publishedAt: new Date(`${item.date} 1`),
  }));
}

function getContentFallbackNewsItems(): PublicNewsItem[] {
  return getContentFallbackEditableItems().map((item, index) =>
    mapPublicNewsItem(item, index === 0),
  );
}

function getContentFallbackArticles(): PublicNewsArticle[] {
  return getContentFallbackEditableItems().map(mapPublicNewsArticle);
}

export async function ensureUniqueNewsSlug(
  preferredSlug: string,
  excludeId?: string,
): Promise<string> {
  const base = slugifyTitle(preferredSlug) || "news-item";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.newsItem.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export function toDatetimeLocalValue(date: Date | null): string {
  if (!date) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export async function getAllNewsItemsForAdmin(): Promise<EditableNewsItem[]> {
  const rows = await prisma.newsItem.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return rows.map(mapDbNewsItem);
}

export async function getNewsItemById(id: string): Promise<EditableNewsItem | null> {
  const item = await prisma.newsItem.findUnique({ where: { id } });
  return item ? mapDbNewsItem(item) : null;
}

export async function getPublicNewsItems(): Promise<PublicNewsItem[]> {
  try {
    const rows = await prisma.newsItem.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) {
      return getContentFallbackNewsItems();
    }

    return rows.map((item, index) =>
      mapPublicNewsItem(mapDbNewsItem(item), index === 0),
    );
  } catch {
    return getContentFallbackNewsItems();
  }
}

export async function getPublicNewsArticles(
  category?: string,
): Promise<PublicNewsArticle[]> {
  try {
    const rows = await prisma.newsItem.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) {
      const fallback = getContentFallbackArticles();
      if (!category) {
        return fallback;
      }

      return fallback.filter((item) => item.category === category);
    }

    return rows.map((item) => mapPublicNewsArticle(mapDbNewsItem(item)));
  } catch {
    const fallback = getContentFallbackArticles();
    if (!category) {
      return fallback;
    }

    return fallback.filter((item) => item.category === category);
  }
}

export async function getPublicNewsArticleBySlug(
  slug: string,
): Promise<PublicNewsArticle | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  try {
    const row = await prisma.newsItem.findFirst({
      where: {
        slug: normalizedSlug,
        published: true,
      },
    });

    if (row) {
      return mapPublicNewsArticle(mapDbNewsItem(row));
    }
  } catch {
    // fall through to content fallback
  }

  const fallback = getContentFallbackArticles().find(
    (item) => item.slug === normalizedSlug,
  );

  return fallback ?? null;
}

export async function getRelatedPublicNewsArticles(
  slug: string,
  limit = 3,
): Promise<PublicNewsArticle[]> {
  const articles = await getPublicNewsArticles();
  return articles.filter((item) => item.slug !== slug).slice(0, limit);
}

export function parseNewsFormData(formData: FormData): NewsFormInput {
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  const published = String(formData.get("published") ?? "false") === "true";
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    title: read("title"),
    slug: read("slug"),
    category: read("category"),
    summary: read("summary"),
    body: read("body"),
    imageUrl: read("imageUrl"),
    imageUrlTwo: read("imageUrlTwo"),
    imageUrlThree: read("imageUrlThree"),
    imageCaptionOne: read("imageCaptionOne"),
    imageCaptionTwo: read("imageCaptionTwo"),
    imageCaptionThree: read("imageCaptionThree"),
    published,
    publishedAt:
      publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
  };
}

export function isValidNewsInput(input: NewsFormInput): boolean {
  const hasValidCategory = NEWS_CATEGORIES.includes(input.category as NewsCategory);

  return (
    Boolean(input.title) &&
    hasValidCategory &&
    Boolean(input.summary) &&
    Boolean(input.imageUrl)
  );
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

async function resolveInputSlug(
  input: NewsFormInput,
  excludeId?: string,
): Promise<string> {
  const preferred = input.slug.trim() || slugifyTitle(input.title);
  return ensureUniqueNewsSlug(preferred, excludeId);
}

export async function createNewsItem(input: NewsFormInput): Promise<void> {
  const publishedAt =
    input.published && !input.publishedAt ? new Date() : input.publishedAt;
  const slug = await resolveInputSlug(input);

  await prisma.newsItem.create({
    data: {
      title: input.title,
      slug,
      category: input.category,
      summary: input.summary,
      body: input.body || null,
      imageUrl: input.imageUrl,
      imageUrlTwo: emptyToNull(input.imageUrlTwo),
      imageUrlThree: emptyToNull(input.imageUrlThree),
      imageCaptionOne: emptyToNull(input.imageCaptionOne),
      imageCaptionTwo: emptyToNull(input.imageCaptionTwo),
      imageCaptionThree: emptyToNull(input.imageCaptionThree),
      published: input.published,
      publishedAt: input.published ? publishedAt : null,
    },
  });
}

export async function updateNewsItem(
  id: string,
  input: NewsFormInput,
): Promise<void> {
  const publishedAt =
    input.published && !input.publishedAt ? new Date() : input.publishedAt;
  const slug = await resolveInputSlug(input, id);

  await prisma.newsItem.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      category: input.category,
      summary: input.summary,
      body: input.body || null,
      imageUrl: input.imageUrl,
      imageUrlTwo: emptyToNull(input.imageUrlTwo),
      imageUrlThree: emptyToNull(input.imageUrlThree),
      imageCaptionOne: emptyToNull(input.imageCaptionOne),
      imageCaptionTwo: emptyToNull(input.imageCaptionTwo),
      imageCaptionThree: emptyToNull(input.imageCaptionThree),
      published: input.published,
      publishedAt: input.published ? publishedAt : null,
    },
  });
}

export async function setNewsItemPublished(
  id: string,
  published: boolean,
): Promise<void> {
  const existing = await prisma.newsItem.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("News item not found");
  }

  await prisma.newsItem.update({
    where: { id },
    data: {
      published,
      publishedAt:
        published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
}
