import { getPublicAboutContent } from "@/lib/about-content-data";
import { getPublicContactContent } from "@/lib/contact-content-data";
import { getPublicEligibilityPageContent } from "@/lib/eligibility-page-content-data";
import { getPublicHomepageContent } from "@/lib/homepage-content-data";
import { getPublicNewsItems } from "@/lib/news-data";
import { getPublicSchemes } from "@/lib/schemes-data";
import { getPublicSiteSettings } from "@/lib/site-settings-data";
import { AI_PUBLIC_PAGES } from "@/lib/ai/chat-config";

function clip(text: string, max = 280): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) {
    return trimmed;
  }

  return `${trimmed.slice(0, max).trim()}…`;
}

function formatList(items: string[], maxItems = 8): string {
  return items
    .slice(0, maxItems)
    .map((item) => `- ${clip(item, 200)}`)
    .join("\n");
}

export async function buildPublicWebsiteContext(): Promise<string> {
  const [
    settings,
    homepage,
    about,
    contact,
    schemes,
    newsItems,
    eligibility,
  ] = await Promise.all([
    getPublicSiteSettings(),
    getPublicHomepageContent(),
    getPublicAboutContent(),
    getPublicContactContent(),
    getPublicSchemes(),
    getPublicNewsItems(),
    getPublicEligibilityPageContent(),
  ]);

  const pages = AI_PUBLIC_PAGES.map(
    (page) => `- ${page.label}: ${page.path}`,
  ).join("\n");

  const schemeLines = schemes
    .slice(0, 12)
    .map(
      (scheme) =>
        `- ${scheme.title} (${scheme.label}): ${clip(scheme.description, 180)}. Meta: ${clip(scheme.meta, 80)}`,
    )
    .join("\n");

  const newsLines = newsItems
    .slice(0, 10)
    .map(
      (item) =>
        `- ${item.title} [${item.category}, ${item.date}]: ${clip(item.text, 160)}. Link: /media/${item.slug}`,
    )
    .join("\n");

  const sections = [
    "## Site identity",
    `Name: ${settings.name}`,
    `Tagline: ${settings.tagline}`,
    `Phone: ${settings.phone.display}`,
    `Email: ${settings.email.display}`,
    `Office hours: ${settings.officeHours}`,
    "",
    "## Public pages",
    pages,
    "",
    "## Homepage",
    `Hero: ${clip(`${homepage.hero.title} ${homepage.hero.highlightedTitle}. ${homepage.hero.description}`, 320)}`,
    `Primary action: ${homepage.hero.primaryCtaLabel} (${homepage.hero.primaryCtaHref})`,
    `Secondary action: ${homepage.hero.secondaryCtaLabel} (${homepage.hero.secondaryCtaHref})`,
    `CTA banner: ${clip(`${homepage.ctaBanner.title} ${homepage.ctaBanner.highlightedTitle}. ${homepage.ctaBanner.description}`, 280)}`,
    "",
    "## About",
    `Intro: ${clip(about.intro.paragraphs.join(" "), 360)}`,
    `Vision: ${clip(about.vision.text, 220)}`,
    `Mission: ${clip(about.mission.text, 220)}`,
    "",
    "## Contact",
    `Office: ${contact.details.officeName}`,
    `Address: ${clip(contact.details.address, 200)}`,
    `Phone: ${contact.details.phone}`,
    `Email: ${contact.details.email}`,
    `Hours: ${contact.details.officeHours}`,
    `Instructions: ${clip(contact.instructions.description, 240)}`,
    contact.instructions.items.length
      ? `Contact tips:\n${formatList(contact.instructions.items, 5)}`
      : "",
    "",
    "## Eligibility (general website information only — not a decision tool)",
    clip(eligibility.hero.description, 220),
    eligibility.whoQualifies.description
      ? `Who qualifies (summary): ${clip(eligibility.whoQualifies.description, 220)}`
      : "",
    eligibility.requirements.items.length
      ? `Requirements:\n${formatList(eligibility.requirements.items, 8)}`
      : "",
    eligibility.documents.items.length
      ? `Documents:\n${formatList(eligibility.documents.items, 8)}`
      : "",
    eligibility.cta.description
      ? `Eligibility CTA: ${clip(eligibility.cta.description, 180)}`
      : "",
    "",
    "## Housing schemes",
    schemeLines || "- See /schemes for current programmes.",
    "",
    "## Recent news & media",
    newsLines || "- See /media for updates.",
  ];

  return sections.filter(Boolean).join("\n");
}
