import type { Metadata } from "next";
import { getPublicAboutContent } from "@/lib/about-content-data";
import { getPublicLeaders } from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [about, leaders] = await Promise.all([
    getPublicAboutContent(),
    getPublicLeaders(),
  ]);

  const heroBackground = about.hero.backgroundImageUrl
    ? `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${about.hero.backgroundImageUrl}")`
    : undefined;

  return (
    <main>
      <section
        className="page-hero about-page-hero"
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
          <span className="eyebrow">{about.hero.eyebrow}</span>
          <h1 className="page-title">
            {about.hero.title} <em>{about.hero.titleEmphasis}</em>
          </h1>
          <p>{about.hero.subtitle}</p>
        </div>
      </section>

      <section className="sec about-page-section">
        <div className="wrap about-grid">
          <div className="about-copy">
            <span className="eyebrow">{about.intro.eyebrow}</span>
            <h2 className="sec-title">
              {about.intro.title} <em>{about.intro.titleEmphasis}</em>
            </h2>

            {about.intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <div className="vm-grid">
              <div className="vm-card">
                <h5>{about.vision.title}</h5>
                <p>{about.vision.text}</p>
              </div>

              <div className="vm-card">
                <h5>{about.mission.title}</h5>
                <p>{about.mission.text}</p>
              </div>
            </div>

            <div className="about-highlights">
              {about.highlights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-vis">
            <div className="ai ai-main">
              <img src={about.images.main.src} alt={about.images.main.alt} />
            </div>

            <div className="ai ai-sec">
              <img
                src={about.images.secondary.src}
                alt={about.images.secondary.alt}
              />
            </div>

            <div className="ai-badge">
              <div className="ai-badge-n">{about.images.badge.year}</div>
              <div className="ai-badge-t">{about.images.badge.label}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec leadership-section">
        <div className="wrap">
          <div className="leadership-head">
            <span className="eyebrow">{about.leadershipSection.eyebrow}</span>
            <h2 className="sec-title">
              {about.leadershipSection.title}{" "}
              <em>{about.leadershipSection.titleEmphasis}</em>
            </h2>
            <p className="sec-lead">{about.leadershipSection.lead}</p>
          </div>

          <div className="leaders-grid">
            {leaders.map((leader) => (
              <article className="leader-card" key={`${leader.name}-${leader.title}`}>
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
