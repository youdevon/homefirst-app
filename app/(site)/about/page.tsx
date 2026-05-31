import type { Metadata } from "next";
import BoardRail from "@/components/BoardRail";
import { getPublicAboutContent } from "@/lib/about-content-data";
import { getPublicBoardMembers, getPublicLeaders } from "@/lib/leaders-data";
import { isSectionVisible } from "@/lib/section-visibility";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
};

function getLeadersGridClass(count: number): string {
  if (count <= 1) {
    return "leaders-grid leaders-grid--few leaders-grid--count-1";
  }

  if (count === 2) {
    return "leaders-grid leaders-grid--few leaders-grid--count-2";
  }

  if (count === 3) {
    return "leaders-grid leaders-grid--few leaders-grid--count-3";
  }

  return "leaders-grid";
}

export default async function AboutPage() {
  const [about, leaders, boardMembers] = await Promise.all([
    getPublicAboutContent(),
    getPublicLeaders(),
    getPublicBoardMembers(),
  ]);

  const show = (key: keyof typeof about.visibility) =>
    isSectionVisible(about.visibility, key);

  const heroBackground = about.hero.backgroundImageUrl
    ? `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${about.hero.backgroundImageUrl}")`
    : undefined;

  const showBodySection =
    show("intro") ||
    show("visionMission") ||
    show("highlights") ||
    show("images");

  const showLeadership = show("leadership") && leaders.length > 0;
  const showBoard = show("board") && boardMembers.length > 0;

  return (
    <main>
      {show("hero") ? (
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
      ) : null}

      {showBodySection ? (
        <section className="sec about-page-section">
          <div className="wrap about-grid">
            <div className="about-copy">
              {show("intro") ? (
                <>
                  <span className="eyebrow">{about.intro.eyebrow}</span>
                  <h2 className="sec-title">
                    {about.intro.title} <em>{about.intro.titleEmphasis}</em>
                  </h2>

                  {about.intro.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </>
              ) : null}

              {show("visionMission") ? (
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
              ) : null}

              {show("highlights") ? (
                <div className="about-highlights">
                  {about.highlights.map((item) => (
                    <div key={item.label}>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {show("images") ? (
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
            ) : null}
          </div>
        </section>
      ) : null}

      {showLeadership ? (
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

            <div className={getLeadersGridClass(leaders.length)}>
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
      ) : null}

      {showBoard ? (
        <section className="sec board-section">
          <div className="wrap">
            <div className="leadership-head">
              <span className="eyebrow">{about.boardSection.eyebrow}</span>
              <h2 className="sec-title">
                {about.boardSection.title}{" "}
                <em>{about.boardSection.titleEmphasis}</em>
              </h2>
              <p className="sec-lead">{about.boardSection.lead}</p>
            </div>

            <BoardRail>
              {boardMembers.map((member) => (
                <article
                  className="board-card"
                  key={`${member.name}-${member.title}`}
                  role="listitem"
                >
                  <div className="board-card-img">
                    <img src={member.image} alt={member.alt} />
                  </div>

                  <div className="board-card-info">
                    <span className="board-card-role">{member.title}</span>
                    <h4>{member.name}</h4>
                    {member.description ? (
                      <p>{member.description}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </BoardRail>
          </div>
        </section>
      ) : null}
    </main>
  );
}
