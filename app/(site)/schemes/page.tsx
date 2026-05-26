import type { Metadata } from "next";
import Link from "next/link";
import { schemeCardCtaLabels } from "@/content/schemes";
import { getPublicSchemesPageContent } from "@/lib/schemes-page-content-data";
import { getPublicSchemes, getSchemeCtaHref } from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Housing Schemes",
};

function getSchemeCtaLabel(open: boolean): string {
  return open ? schemeCardCtaLabels.apply : schemeCardCtaLabels.eligibility;
}

export default async function SchemesPage() {
  const [pageContent, schemes] = await Promise.all([
    getPublicSchemesPageContent(),
    getPublicSchemes(),
  ]);
  const heroBackground = pageContent.hero.backgroundImageUrl
    ? `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${pageContent.hero.backgroundImageUrl}")`
    : undefined;

  return (
    <main>
      <section
        className="page-hero schemes-page-hero"
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
          <span className="eyebrow">{pageContent.hero.eyebrow}</span>
          <h1 className="page-title">
            {pageContent.hero.title}{" "}
            <em>{pageContent.hero.highlightedTitle}</em>
          </h1>
          <p>{pageContent.hero.description}</p>
        </div>
      </section>

      <section className="sec sch-sec schemes-page-list">
        <div className="wrap">
          <div className="sch-head">
            <div>
              <span className="eyebrow">{pageContent.listIntro.eyebrow}</span>
              <h2 className="sec-title">
                {pageContent.listIntro.title}{" "}
                <em>{pageContent.listIntro.highlightedTitle}</em>
              </h2>
              <p className="sec-lead schemes-page-lead">
                {pageContent.listIntro.lead}
              </p>
            </div>
          </div>

          <div className="sch-grid schemes-page-grid">
            {schemes.map((scheme) => (
              <article className="sch-card" key={`${scheme.title}-${scheme.meta}`}>
                <div className="sch-img">
                  <img src={scheme.image} alt={scheme.title} />
                  <div className="sch-img-ov"></div>
                  <div className={scheme.open ? "spill open" : "spill"}>
                    {scheme.label}
                  </div>
                </div>

                <div className="sch-body">
                  <h3>{scheme.title}</h3>
                  <p>{scheme.description}</p>

                  <div className="sch-foot">
                    <span>{scheme.meta}</span>
                    <Link
                      href={getSchemeCtaHref(scheme)}
                      className="sch-cta"
                    >
                      {getSchemeCtaLabel(scheme.open)}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec schemes-choose-section">
        <div className="wrap">
          <div className="center-head">
            <span className="eyebrow">{pageContent.chooseSection.eyebrow}</span>
            <h2 className="sec-title">
              {pageContent.chooseSection.title}{" "}
              <em>{pageContent.chooseSection.highlightedTitle}</em>
            </h2>
            <p className="sec-lead schemes-choose-lead">
              {pageContent.chooseSection.lead}
            </p>
          </div>

          <div className="schemes-choose-grid">
            {pageContent.chooseSection.items.map((item, index) => (
              <article className="schemes-choose-card" key={item.title}>
                <div className="schemes-choose-num">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec schemes-page-cta">
        <div className="wrap schemes-page-cta-inner">
          <div>
            <span className="eyebrow schemes-page-cta-eyebrow">Next Steps</span>
            <h2 className="sec-title schemes-page-cta-title">
              {pageContent.cta.title}{" "}
              <em>{pageContent.cta.highlightedTitle}</em>
            </h2>
            <p className="schemes-page-cta-text">{pageContent.cta.description}</p>
          </div>

          <div className="schemes-page-cta-actions">
            <Link href={pageContent.cta.primaryHref} className="btn-pri">
              {pageContent.cta.primaryLabel}
            </Link>
            <Link
              href={pageContent.cta.secondaryHref}
              className="btn-ghost schemes-page-cta-secondary"
            >
              {pageContent.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
