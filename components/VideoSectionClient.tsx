"use client";

import { useMemo, useState } from "react";
import type { PublicVideoSection } from "@/lib/homepage-videos-data";

type VideoSectionClientProps = {
  section: PublicVideoSection;
};

export default function VideoSectionClient({ section }: VideoSectionClientProps) {
  const initialActiveId = section.featuredVideo.id;
  const [activeId, setActiveId] = useState(initialActiveId);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeVideo = useMemo(() => {
    const fromList = section.videos.find((video) => video.id === activeId);
    if (fromList) {
      return fromList;
    }

    if (section.featuredVideo.id === activeId) {
      return section.featuredVideo;
    }

    return section.featuredVideo;
  }, [activeId, section.featuredVideo, section.videos]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setIsPlaying(false);
  };

  const handleMainPlay = () => {
    if (activeVideo.videoUrl) {
      setIsPlaying(true);
    }
  };

  const showMainPlayOverlay = Boolean(activeVideo.videoUrl) && !isPlaying;

  return (
    <section className="vid-sec">
      <div className="wrap">
        <span className="eyebrow">{section.eyebrow}</span>
        <h2 className="sec-title">
          {section.title} <em>{section.highlightedTitle}</em>
        </h2>
        <p className="sec-lead">{section.description}</p>

        <div className="vid-layout">
          <div
            className={
              isPlaying && activeVideo.videoUrl
                ? "vid-main vid-main-playing"
                : "vid-main"
            }
            onClick={showMainPlayOverlay ? handleMainPlay : undefined}
            onKeyDown={(event) => {
              if (
                showMainPlayOverlay &&
                (event.key === "Enter" || event.key === " ")
              ) {
                event.preventDefault();
                handleMainPlay();
              }
            }}
            role={showMainPlayOverlay ? "button" : undefined}
            tabIndex={showMainPlayOverlay ? 0 : undefined}
            aria-label={
              showMainPlayOverlay ? `Play ${activeVideo.title}` : undefined
            }
          >
            {isPlaying && activeVideo.videoUrl ? (
              <div className="video-player">
                <video
                  className="vid-main-player"
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : activeVideo.thumbnailUrl ? (
              <img src={activeVideo.thumbnailUrl} alt={activeVideo.title} />
            ) : (
              <div className="vid-main-placeholder" aria-hidden="true">
                <div className="vfill">▶</div>
              </div>
            )}

            {showMainPlayOverlay ? (
              <div className="vplay">
                <div className="vring">
                  <div className="vfill">▶</div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="vlist">
            {section.videos.map((video) => {
              const isActive = video.id === activeId;

              return (
                <div
                  className={isActive ? "vi act" : "vi"}
                  key={video.id}
                  onClick={() => handleSelect(video.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelect(video.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                >
                  <div className="vi-thumb">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} />
                    ) : (
                      <div className="vi-thumb-placeholder" aria-hidden="true">
                        <div className="mcirc">▶</div>
                      </div>
                    )}
                    <div className="vi-mplay">
                      <div className="mcirc">▶</div>
                    </div>
                  </div>
                  <div className="vi-meta">
                    <h5>{video.title}</h5>
                    <span>{video.meta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
