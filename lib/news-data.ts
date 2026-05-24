import { newsItems as contentNewsItems } from "@/content/news";
import { prisma } from "@/lib/prisma";

export const NEWS_CATEGORIES = [
  "Notice",
  "Update",
  "Event",
  "Press Release",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type PublicNewsItem = {
  category: string;
  title: string;
  text: string;
  date: string;
  image: string;
  featured: boolean;
};

export type EditableNewsItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  imageUrl: string;
  published: boolean;
  publishedAt: Date | null;
};

export type NewsFormInput = {
  title: string;
  category: string;
  summary: string;
  body: string;
  imageUrl: string;
  published: boolean;
  publishedAt: Date | null;
};

export function formatPublicDate(date: Date | null): string {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function mapDbNewsItem(item: {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string | null;
  imageUrl: string | null;
  published: boolean;
  publishedAt: Date | null;
}): EditableNewsItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    body: item.body ?? "",
    imageUrl: item.imageUrl ?? "",
    published: item.published,
    publishedAt: item.publishedAt,
  };
}

function mapPublicNewsItem(
  item: EditableNewsItem,
  featured: boolean,
): PublicNewsItem {
  return {
    category: item.category,
    title: item.title,
    text: item.summary,
    date: formatPublicDate(item.publishedAt),
    image: item.imageUrl,
    featured,
  };
}

function getContentFallbackNewsItems(): PublicNewsItem[] {
  return contentNewsItems.map((item) => ({
    category: item.category,
    title: item.title,
    text: item.text,
    date: item.date,
    image: item.image,
    featured: item.featured,
  }));
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

export function parseNewsFormData(formData: FormData): NewsFormInput {
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  const published = String(formData.get("published") ?? "false") === "true";

  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
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

export async function createNewsItem(input: NewsFormInput): Promise<void> {
  const publishedAt =
    input.published && !input.publishedAt ? new Date() : input.publishedAt;

  await prisma.newsItem.create({
    data: {
      title: input.title,
      category: input.category,
      summary: input.summary,
      body: input.body || null,
      imageUrl: input.imageUrl,
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

  await prisma.newsItem.update({
    where: { id },
    data: {
      title: input.title,
      category: input.category,
      summary: input.summary,
      body: input.body || null,
      imageUrl: input.imageUrl,
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
