import Link from "next/link";
import {
  schemeCardCtaLabels,
  schemesChooseSection,
  schemesPageCta,
  schemesPageHero,
} from "@/content/schemes";
import { getPublicSchemes, getSchemeCtaHref } from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

function getSchemeCtaLabel(open: boolean): string {
  return open ? schemeCardCtaLabels.apply : schemeCardCtaLabels.eligibility;
}

export default async function SchemesPage() {
  const schemes = await getPublicSchemes();
  const heroBackground = schemesPageHero.backgroundImageUrl
    ? `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${schemesPageHero.backgroundImageUrl}")`
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
          <span className="eyebrow">{schemesPageHero.eyebrow}</span>
          <h1 className="page-title">
            {schemesPageHero.title}{" "}
            <em>{schemesPageHero.highlightedTitle}</em>
          </h1>
          <p>{schemesPageHero.description}</p>
        </div>
      </section>

      <section className="sec sch-sec schemes-page-list">
        <div className="wrap">
          <div className="sch-head">
            <div>
              <span className="eyebrow">Programmes</span>
              <h2 className="sec-title">
                Current <em>Schemes</em>
              </h2>
              <p className="sec-lead schemes-page-lead">
                All active HomeFirst housing programmes currently open to
                applicants and registrants.
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
            <span className="eyebrow">{schemesChooseSection.eyebrow}</span>
            <h2 className="sec-title">
              {schemesChooseSection.title}{" "}
              <em>{schemesChooseSection.titleEmphasis}</em>
            </h2>
            <p className="sec-lead schemes-choose-lead">
              {schemesChooseSection.lead}
            </p>
          </div>

          <div className="schemes-choose-grid">
            {schemesChooseSection.items.map((item, index) => (
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
              {schemesPageCta.title}{" "}
              <em>{schemesPageCta.highlightedTitle}</em>
            </h2>
            <p className="schemes-page-cta-text">{schemesPageCta.description}</p>
          </div>

          <div className="schemes-page-cta-actions">
            <Link href={schemesPageCta.primaryHref} className="btn-pri">
              {schemesPageCta.primaryLabel}
            </Link>
            <Link href={schemesPageCta.secondaryHref} className="btn-ghost schemes-page-cta-secondary">
              {schemesPageCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
