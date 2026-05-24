import Link from "next/link";
import type { PublicCtaBanner } from "@/lib/homepage-content-data";

type CtaBannerProps = {
  ctaBanner: PublicCtaBanner;
};

export default function CtaBanner({ ctaBanner }: CtaBannerProps) {
  return (
    <section className="cta-sec">
      <div className="cta-layout">
        <div>
          <span className="eyebrow">{ctaBanner.eyebrow}</span>
          <h2 className="sec-title">
            {ctaBanner.title} <em>{ctaBanner.highlightedTitle}</em>
          </h2>
          <p className="sec-lead">{ctaBanner.description}</p>
        </div>

        <div className="cta-box">
          <h4>{ctaBanner.formTitle}</h4>

          <div className="cta-inputs">
            <input
              className="ci"
              type="text"
              placeholder={ctaBanner.placeholders.name}
            />
            <input
              className="ci"
              type="email"
              placeholder={ctaBanner.placeholders.email}
            />
            <input
              className="ci"
              type="tel"
              placeholder={ctaBanner.placeholders.phone}
            />
          </div>

          <Link href={ctaBanner.submitHref} className="csub">
            {ctaBanner.submitLabel}
          </Link>

          <div className="cass">
            {ctaBanner.assurances.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
