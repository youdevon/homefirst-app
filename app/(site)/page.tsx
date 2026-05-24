import QuickActions from "@/components/QuickActions";
import TrustBand from "@/components/TrustBand";
import SchemesPreview from "@/components/SchemesPreview";
import ApplicationSteps from "@/components/ApplicationSteps";
import ServicesPreview from "@/components/ServicesPreview";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import NewsPreview from "@/components/NewsPreview";
import CtaBanner from "@/components/CtaBanner";
import ContactStrip from "@/components/ContactStrip";
import { getPublicHomepageContent } from "@/lib/homepage-content-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero, ctaBanner } = await getPublicHomepageContent();

  return (
    <main>
      <section className="hero">
        <div className="hero-stripe"></div>
        <div
          className="hero-bg"
          style={{
            background: `url("${hero.backgroundImageUrl}") center/cover no-repeat`,
          }}
        ></div>
        <div className="hero-ov"></div>

        <div className="hero-wrap">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="badge-dot"></div>
              {hero.badge}
            </div>

            <h1>
              {hero.title}
              <em>{hero.highlightedTitle}</em>
            </h1>

            <p className="hero-sub">{hero.description}</p>

            <div className="hero-btns">
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

      <QuickActions />
      <TrustBand />
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
