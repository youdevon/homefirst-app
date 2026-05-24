import type { Metadata } from "next";
import Link from "next/link";
import { getPublicContactContent } from "@/lib/contact-content-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const content = await getPublicContactContent();

  return (
    <main>
      <section
        className="page-hero contact-page-hero"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${content.hero.backgroundImageUrl}")`,
        }}
      >
        <div className="page-hero-overlay"></div>
        <div className="wrap page-hero-content">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1 className="page-title">
            {content.hero.title} <em>{content.hero.highlightedTitle}</em>
          </h1>
          <p>{content.hero.description}</p>
        </div>
      </section>

      <section className="sec contact-page-section">
        <div className="wrap contact-layout">
          <div className="contact-details-panel">
            <span className="eyebrow">Office Details</span>
            <h2 className="sec-title">{content.details.officeName}</h2>

            <ul className="contact-details-list">
              <li>
                <strong>Address</strong>
                <span>{content.details.address}</span>
              </li>
              <li>
                <strong>Phone</strong>
                <a href={content.details.phoneHref}>{content.details.phone}</a>
              </li>
              <li>
                <strong>Email</strong>
                <a href={content.details.emailHref}>{content.details.email}</a>
              </li>
              <li>
                <strong>Office hours</strong>
                <span>{content.details.officeHours}</span>
              </li>
            </ul>

            <div className="contact-instructions">
              <h3 className="contact-instructions-title">
                {content.instructions.title}{" "}
                <em>{content.instructions.highlightedTitle}</em>
              </h3>
              <p>{content.instructions.description}</p>
              <ul>
                {content.instructions.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contact-side-panel">
            <div className="contact-form-box">
              <h4>{content.formPlaceholder.title}</h4>
              <p className="contact-form-note">{content.formPlaceholder.description}</p>

              <div className="contact-form-fields">
                <input
                  className="ci"
                  type="text"
                  placeholder={content.formPlaceholder.nameLabel}
                  disabled
                />
                <input
                  className="ci"
                  type="email"
                  placeholder={content.formPlaceholder.emailLabel}
                  disabled
                />
                <input
                  className="ci"
                  type="tel"
                  placeholder={content.formPlaceholder.phoneLabel}
                  disabled
                />
                <textarea
                  className="ci contact-message-input"
                  placeholder={content.formPlaceholder.messageLabel}
                  disabled
                />
              </div>

              <button type="button" className="csub contact-form-submit" disabled>
                {content.formPlaceholder.submitLabel}
              </button>
            </div>

            {content.details.mapEmbedUrl ? (
              <div className="contact-map-wrap">
                <iframe
                  title="Office location map"
                  src={content.details.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contact-map-embed"
                />
              </div>
            ) : content.details.mapUrl ? (
              <div className="contact-map-link-wrap">
                <Link href={content.details.mapUrl} className="contact-map-link">
                  View office location on map →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="con-strip contact-cards-section">
        <div className="con-grid">
          {content.cards.map((card) => (
            <Link href={card.linkHref} className="con-card" key={`${card.title}-${card.displayOrder}`}>
              <div className="con-ico">{card.icon}</div>
              <div>
                <h5>{card.title}</h5>
                <p>{card.description}</p>
                <small>{card.linkLabel}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
