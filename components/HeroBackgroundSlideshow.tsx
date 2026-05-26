"use client";

import { useEffect, useState } from "react";

const CYCLE_MS = 16000;

type HeroBackgroundSlideshowProps = {
  images: string[];
};

export default function HeroBackgroundSlideshow({
  images,
}: HeroBackgroundSlideshowProps) {
  const slides = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [reducedMotion, slides.length]);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) {
      return;
    }

    setAnimKey((current) => current + 1);
  }, [activeIndex, reducedMotion, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const showSlideshow = slides.length > 1 && !reducedMotion;

  if (!showSlideshow) {
    return (
      <div className="hero-slideshow" aria-hidden="true">
        <div className="hero-slide active">
          <div
            className="hero-slide-inner hero-slide-static"
            style={{ backgroundImage: `url("${slides[0]}")` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {slides.map((url, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={`${index}-${url}`}
            className={isActive ? "hero-slide active" : "hero-slide"}
          >
            <div
              key={isActive ? `anim-${animKey}` : `idle-${index}`}
              className={
                isActive
                  ? "hero-slide-inner hero-animate-bg"
                  : "hero-slide-inner hero-slide-static"
              }
              style={{ backgroundImage: `url("${url}")` }}
            />
          </div>
        );
      })}
    </div>
  );
}
