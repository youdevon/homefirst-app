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
import { hero } from "@/content/home";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-stripe"></div>
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>

        <div className="hero-wrap">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="badge-dot"></div>
              {hero.badge}
            </div>

            <h1>
              {hero.title}
              <em>{hero.titleEmphasis}</em>
            </h1>

            <p className="hero-sub">{hero.subtitle}</p>

            <div className="hero-btns">
              <a href={hero.primaryCta.href} className="btn-pri">
                {hero.primaryCta.label}
              </a>
              <a href={hero.secondaryCta.href} className="btn-ghost">
                {hero.secondaryCta.label}
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
      <CtaBanner />
      <ContactStrip />
    </main>
  );
}
