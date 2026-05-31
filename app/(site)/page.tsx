import SchemesPreview from "@/components/SchemesPreview";
import ApplicationSteps from "@/components/ApplicationSteps";
import ServicesPreview from "@/components/ServicesPreview";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import NewsPreview from "@/components/NewsPreview";
import CtaBanner from "@/components/CtaBanner";
import ContactStrip from "@/components/ContactStrip";
import HeroBackgroundSlideshow from "@/components/HeroBackgroundSlideshow";
import { getPublicHomepageContent } from "@/lib/homepage-content-data";
import { isSectionVisible } from "@/lib/section-visibility";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero, ctaBanner, visibility } = await getPublicHomepageContent();
  const show = (key: keyof typeof visibility) => isSectionVisible(visibility, key);

  return (
    <main>
      {show("hero") ? (
        <section className="hero">
          <div className="hero-stripe"></div>
          <HeroBackgroundSlideshow media={hero.heroMedia} />
          <div className="hero-ov"></div>

          <div className="hero-wrap">
            <div className="hero-left">
              <div className="hero-badge hero-animate-badge">
                <div className="badge-dot"></div>
                {hero.badge}
              </div>

              <h1 className="hero-animate-title">
                {hero.title}
                <em>{hero.highlightedTitle}</em>
              </h1>

              <p className="hero-sub hero-animate-sub">{hero.description}</p>

              <div className="hero-btns hero-animate-actions">
                <a href={hero.primaryCtaHref} className="btn-pri">
                  {hero.primaryCtaLabel}
                </a>
                <a href={hero.secondaryCtaHref} className="btn-ghost">
                  {hero.secondaryCtaLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {show("schemesPreview") ? <SchemesPreview /> : null}
      {show("applicationSteps") ? <ApplicationSteps /> : null}
      {show("servicesPreview") ? <ServicesPreview /> : null}
      {show("videoSection") ? <VideoSection /> : null}
      {show("testimonials") ? <Testimonials /> : null}
      {show("newsPreview") ? <NewsPreview /> : null}
      {show("cta") ? <CtaBanner ctaBanner={ctaBanner} /> : null}
      {show("contactStrip") ? <ContactStrip /> : null}
    </main>
  );
}
