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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero, ctaBanner } = await getPublicHomepageContent();

  return (
    <main>
      <section className="hero">
        <div className="hero-stripe"></div>
        <HeroBackgroundSlideshow images={hero.backgroundImages} />
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

      <SchemesPreview />
      <ApplicationSteps />
      <ServicesPreview />
      <VideoSection />
      <Testimonials />
      <NewsPreview />
      <CtaBanner ctaBanner={ctaBanner} />
      <ContactStrip />
    </main>
  );
}
