import { PrismaClient } from "@prisma/client";
import { site } from "../content/site";
import { hero, videoSection, ctaBanner } from "../content/home";
import { aboutHero, aboutIntro, vision, mission } from "../content/about";
import { leaders } from "../content/leaders";
import { schemes } from "../content/schemes";
import { newsItems } from "../content/news";
import { DEFAULT_ADMIN } from "../lib/auth/constants";
import { DEFAULT_HERO_BACKGROUND_URL } from "../lib/homepage-content-data";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

const siteSettings = [
  { key: "site.name", value: site.name },
  { key: "site.tagline", value: site.tagline },
  { key: "site.phone.display", value: site.phone.display },
  { key: "site.phone.href", value: site.phone.href },
  { key: "site.email.display", value: site.email.display },
  { key: "site.email.href", value: site.email.href },
  { key: "site.officeHours", value: site.officeHours },
  { key: "site.copyright", value: site.copyright },
  { key: "site.footerDescription", value: site.footerDescription },
];

const pageContentSections = [
  {
    sectionKey: "home.hero",
    title: hero.title,
    subtitle: hero.subtitle,
    imageUrl: DEFAULT_HERO_BACKGROUND_URL,
    metadata: {
      badge: hero.badge,
      highlightedTitle: hero.titleEmphasis,
      primaryCtaLabel: hero.primaryCta.label,
      primaryCtaHref: hero.primaryCta.href,
      secondaryCtaLabel: hero.secondaryCta.label,
      secondaryCtaHref: hero.secondaryCta.href,
    },
  },
  {
    sectionKey: "home.cta",
    title: ctaBanner.title,
    subtitle: ctaBanner.lead,
    metadata: {
      eyebrow: ctaBanner.eyebrow,
      highlightedTitle: ctaBanner.titleEmphasis,
      formTitle: ctaBanner.formTitle,
      submitLabel: ctaBanner.submitLabel,
    },
  },
  {
    sectionKey: "about.hero",
    title: aboutHero.title,
    subtitle: aboutHero.subtitle,
    metadata: {
      eyebrow: aboutHero.eyebrow,
      titleEmphasis: aboutHero.titleEmphasis,
    },
  },
  {
    sectionKey: "about.intro",
    title: aboutIntro.title,
    body: aboutIntro.paragraphs.join("\n\n"),
    metadata: {
      eyebrow: aboutIntro.eyebrow,
      titleEmphasis: aboutIntro.titleEmphasis,
      vision,
      mission,
    },
  },
  {
    sectionKey: "home.video",
    title: videoSection.title,
    subtitle: videoSection.lead,
    imageUrl: videoSection.mainVideo.image,
    metadata: {
      eyebrow: videoSection.eyebrow,
      titleEmphasis: videoSection.titleEmphasis,
      mainVideoAlt: videoSection.mainVideo.alt,
      videos: videoSection.videos,
    },
  },
];

function parsePublishedAt(dateLabel: string): Date {
  const parsed = Date.parse(`${dateLabel} 1`);
  return Number.isNaN(parsed) ? new Date() : new Date(parsed);
}

function fileNameFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const segment = pathname.split("/").pop() ?? "media-file";
  return segment.split("?")[0] ?? segment;
}

async function main() {
  console.log("Seeding site settings...");
  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seeding page content...");
  for (const section of pageContentSections) {
    await prisma.pageContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {
        title: section.title,
        subtitle: section.subtitle ?? null,
        body: section.body ?? null,
        imageUrl: section.imageUrl ?? null,
        metadata: section.metadata ?? null,
      },
      create: {
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle ?? null,
        body: section.body ?? null,
        imageUrl: section.imageUrl ?? null,
        metadata: section.metadata ?? null,
      },
    });
  }

  console.log("Seeding leaders...");
  for (const [index, leader] of leaders.entries()) {
    await prisma.leader.upsert({
      where: { id: `seed-leader-${index + 1}` },
      update: {
        name: leader.name,
        title: leader.title,
        bio: leader.description,
        photoUrl: leader.image,
        displayOrder: index,
        active: true,
      },
      create: {
        id: `seed-leader-${index + 1}`,
        name: leader.name,
        title: leader.title,
        bio: leader.description,
        photoUrl: leader.image,
        displayOrder: index,
        active: true,
      },
    });
  }

  console.log("Seeding schemes...");
  for (const [index, scheme] of schemes.entries()) {
    await prisma.scheme.upsert({
      where: { id: `seed-scheme-${index + 1}` },
      update: {
        name: scheme.title,
        description: scheme.description,
        imageUrl: scheme.image,
        statusLabel: scheme.label,
        meta: scheme.meta,
        displayOrder: index,
        active: scheme.open,
      },
      create: {
        id: `seed-scheme-${index + 1}`,
        name: scheme.title,
        description: scheme.description,
        imageUrl: scheme.image,
        statusLabel: scheme.label,
        meta: scheme.meta,
        displayOrder: index,
        active: scheme.open,
      },
    });
  }

  console.log("Seeding news items...");
  for (const [index, item] of newsItems.entries()) {
    await prisma.newsItem.upsert({
      where: { id: `seed-news-${index + 1}` },
      update: {
        title: item.title,
        category: item.category,
        summary: item.text,
        imageUrl: item.image,
        published: true,
        publishedAt: parsePublishedAt(item.date),
      },
      create: {
        id: `seed-news-${index + 1}`,
        title: item.title,
        category: item.category,
        summary: item.text,
        imageUrl: item.image,
        published: true,
        publishedAt: parsePublishedAt(item.date),
      },
    });
  }

  console.log("Seeding media files...");
  const mediaEntries = [
    {
      fileUrl: videoSection.mainVideo.image,
      originalName: "community-video-cover.jpg",
      altText: videoSection.mainVideo.alt,
    },
    ...videoSection.videos.map((video) => ({
      fileUrl: video.image,
      originalName: `${video.title}.jpg`,
      altText: video.title,
    })),
    ...newsItems.map((item) => ({
      fileUrl: item.image,
      originalName: `${item.title}.jpg`,
      altText: item.title,
    })),
  ];

  for (const [index, media] of mediaEntries.entries()) {
    const fileName = fileNameFromUrl(media.fileUrl);

    await prisma.mediaFile.upsert({
      where: { id: `seed-media-${index + 1}` },
      update: {
        fileName,
        originalName: media.originalName,
        fileType: "image/jpeg",
        fileUrl: media.fileUrl,
        altText: media.altText,
      },
      create: {
        id: `seed-media-${index + 1}`,
        fileName,
        originalName: media.originalName,
        fileType: "image/jpeg",
        fileUrl: media.fileUrl,
        altText: media.altText,
      },
    });
  }

  console.log("Seeding admin user...");
  const passwordHash = await hashPassword(DEFAULT_ADMIN.password);

  await prisma.adminUser.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {
      name: DEFAULT_ADMIN.name,
      passwordHash,
      role: DEFAULT_ADMIN.role,
      active: true,
    },
    create: {
      id: DEFAULT_ADMIN.id,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      role: DEFAULT_ADMIN.role,
      active: true,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
