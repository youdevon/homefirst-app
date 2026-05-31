"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicHeroMediaItem } from "@/lib/hero-media";

const SLIDE_INTERVAL_MS = 10000;
const CROSSFADE_MS = 1800;

type HeroBackgroundSlideshowProps = {
  media: PublicHeroMediaItem[];
};

export default function HeroBackgroundSlideshow({
  media,
}: HeroBackgroundSlideshowProps) {
  const slides = media.filter((item) => item.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [playKeys, setPlayKeys] = useState<Record<number, number>>({ 0: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevActiveIndexRef = useRef(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

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
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reducedMotion, slides.length]);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) {
      return;
    }

    const previousIndex = prevActiveIndexRef.current;

    if (previousIndex === activeIndex) {
      return;
    }

    setLeavingIndex(previousIndex);
    setPlayKeys((current) => ({
      ...current,
      [activeIndex]: (current[activeIndex] ?? 0) + 1,
    }));

    prevActiveIndexRef.current = activeIndex;

    const timer = window.setTimeout(() => {
      setLeavingIndex(null);
    }, CROSSFADE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, reducedMotion, slides.length]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const video = videoRefs.current[activeIndex];
    if (video && slides[activeIndex]?.type === "video") {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    }
  }, [activeIndex, reducedMotion, slides, playKeys]);

  if (slides.length === 0) {
    return null;
  }

  const showSlideshow = slides.length > 1 && !reducedMotion;
  const staticItem = slides[0];

  if (!showSlideshow) {
    return (
      <div className="hero-slideshow" aria-hidden="true">
        <div className="hero-media-layer hero-slide active">
          {staticItem.type === "video" && !reducedMotion ? (
            <video
              className="hero-media-video hero-slide-static"
              src={staticItem.url}
              poster={staticItem.posterUrl || undefined}
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
            />
          ) : staticItem.type === "video" ? (
            staticItem.posterUrl ? (
              <div
                className="hero-media-image hero-slide-inner hero-slide-static"
                style={{ backgroundImage: `url("${staticItem.posterUrl}")` }}
              />
            ) : (
              <video
                className="hero-media-video hero-slide-static"
                src={staticItem.url}
                muted
                playsInline
                preload="metadata"
              />
            )
          ) : (
            <div
              className={
                reducedMotion
                  ? "hero-media-image hero-slide-inner hero-slide-static"
                  : "hero-media-image hero-slide-inner hero-animate-bg"
              }
              style={{ backgroundImage: `url("${staticItem.url}")` }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {slides.map((item, index) => {
        const isActive = index === activeIndex;
        const isLeaving = index === leavingIndex;
        const isVisible = isActive || isLeaving;
        const shouldAnimateImage = isVisible && item.type === "image";
        const playKey = playKeys[index] ?? 0;

        return (
          <div
            key={`${index}-${item.url}-${item.type}`}
            className={[
              "hero-media-layer",
              "hero-slide",
              isActive ? "active" : "",
              isLeaving ? "leaving" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.type === "video" ? (
              <video
                key={`video-${index}-${playKey}`}
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className="hero-media-video"
                src={item.url}
                poster={item.posterUrl || undefined}
                muted
                playsInline
                autoPlay={isActive}
                loop
                preload={index === 0 ? "auto" : "metadata"}
              />
            ) : (
              <div
                key={`image-${index}-${playKey}`}
                className={
                  shouldAnimateImage
                    ? "hero-media-image hero-slide-inner hero-animate-bg"
                    : "hero-media-image hero-slide-inner hero-slide-static"
                }
                style={{ backgroundImage: `url("${item.url}")` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
