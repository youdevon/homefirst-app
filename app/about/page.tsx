import {
  aboutHero,
  aboutIntro,
  vision,
  mission,
  aboutHighlights,
  aboutImages,
  leadershipSection,
} from "@/content/about";
import { leaders } from "@/content/leaders";

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero about-page-hero">
        <div className="page-hero-overlay"></div>
        <div className="wrap page-hero-content">
          <span className="eyebrow">{aboutHero.eyebrow}</span>
          <h1 className="page-title">
            {aboutHero.title} <em>{aboutHero.titleEmphasis}</em>
          </h1>
          <p>{aboutHero.subtitle}</p>
        </div>
      </section>

      <section className="sec about-page-section">
        <div className="wrap about-grid">
          <div className="about-copy">
            <span className="eyebrow">{aboutIntro.eyebrow}</span>
            <h2 className="sec-title">
              {aboutIntro.title} <em>{aboutIntro.titleEmphasis}</em>
            </h2>

            {aboutIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <div className="vm-grid">
              <div className="vm-card">
                <h5>{vision.title}</h5>
                <p>{vision.text}</p>
              </div>

              <div className="vm-card">
                <h5>{mission.title}</h5>
                <p>{mission.text}</p>
              </div>
            </div>

            <div className="about-highlights">
              {aboutHighlights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-vis">
            <div className="ai ai-main">
              <img src={aboutImages.main.src} alt={aboutImages.main.alt} />
            </div>

            <div className="ai ai-sec">
              <img
                src={aboutImages.secondary.src}
                alt={aboutImages.secondary.alt}
              />
            </div>

            <div className="ai-badge">
              <div className="ai-badge-n">{aboutImages.badge.year}</div>
              <div className="ai-badge-t">{aboutImages.badge.label}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec leadership-section">
        <div className="wrap">
          <div className="leadership-head">
            <span className="eyebrow">{leadershipSection.eyebrow}</span>
            <h2 className="sec-title">
              {leadershipSection.title}{" "}
              <em>{leadershipSection.titleEmphasis}</em>
            </h2>
            <p className="sec-lead">{leadershipSection.lead}</p>
          </div>

          <div className="leaders-grid">
            {leaders.map((leader) => (
              <article className="leader-card" key={leader.name}>
                <div className="leader-img">
                  <img src={leader.image} alt={leader.alt} />
                </div>

                <div className="leader-info">
                  <span className="leader-title">{leader.title}</span>
                  <h4>{leader.name}</h4>
                  <p>{leader.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
