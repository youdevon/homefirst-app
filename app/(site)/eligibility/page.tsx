import type { Metadata } from "next";
import Link from "next/link";
import { getPublicEligibilityPageContent } from "@/lib/eligibility-page-content-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eligibility",
};

export default async function EligibilityPage() {
  const content = await getPublicEligibilityPageContent();
  const heroBackground = content.hero.backgroundImageUrl
    ? `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${content.hero.backgroundImageUrl}")`
    : undefined;

  return (
    <main>
      <section
        className="page-hero eligibility-page-hero"
        style={
          heroBackground
            ? {
                backgroundImage: heroBackground,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <div className="page-hero-overlay"></div>
        <div className="wrap page-hero-content">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1 className="page-title">
            {content.hero.title}{" "}
            <em>{content.hero.highlightedTitle}</em>
          </h1>
          <p>{content.hero.description}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="center-head">
            <h2 className="sec-title">
              {content.whoQualifies.title}{" "}
              <em>{content.whoQualifies.highlightedTitle}</em>
            </h2>
            <p className="sec-lead">{content.whoQualifies.description}</p>
          </div>
        </div>
      </section>

      <section className="sec eligibility-checklist-section">
        <div className="wrap eligibility-checklist-grid">
          <article className="eligibility-checklist-card">
            <h3>{content.requirements.title}</h3>
            <ul>
              {content.requirements.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="eligibility-checklist-card">
            <h3>{content.documents.title}</h3>
            <ul>
              {content.documents.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="sec eligibility-page-cta">
        <div className="wrap eligibility-page-cta-inner">
          <div>
            <h2 className="sec-title">
              {content.cta.title}{" "}
              <em>{content.cta.highlightedTitle}</em>
            </h2>
            <p className="sec-lead">{content.cta.description}</p>
          </div>
          <div className="eligibility-page-cta-actions">
            <Link href={content.cta.primaryHref} className="btn-pri">
              {content.cta.primaryLabel}
            </Link>
            <Link href={content.cta.secondaryHref} className="btn-ghost">
              {content.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
