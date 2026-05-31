import Link from "next/link";
import { getPublicHomepageContent } from "@/lib/homepage-content-data";
import { getPublicSchemes } from "@/lib/schemes-data";

export default async function SchemesPreview() {
  const [schemes, homepage] = await Promise.all([
    getPublicSchemes(),
    getPublicHomepageContent(),
  ]);
  const section = homepage.schemesPreview;

  return (
    <section className="sec sch-sec">
      <div className="wrap">
        <div className="sch-head">
          <div>
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="sec-title">
              {section.title} <em>{section.highlightedTitle}</em>
            </h2>
          </div>

          <Link href={section.viewAllHref} className="lk">
            {section.viewAllLabel}
          </Link>
        </div>

        <div className="sch-grid">
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
                  <Link href={scheme.href} className="sch-cta">
                    {section.cardCtaLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
