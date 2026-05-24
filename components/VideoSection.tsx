import { videoSection } from "@/content/home";

export default function VideoSection() {
  return (
    <section className="vid-sec">
      <div className="wrap">
        <span className="eyebrow">{videoSection.eyebrow}</span>
        <h2 className="sec-title">
          {videoSection.title} <em>{videoSection.titleEmphasis}</em>
        </h2>
        <p className="sec-lead">{videoSection.lead}</p>

        <div className="vid-layout">
          <div className="vid-main">
            <img
              src={videoSection.mainVideo.image}
              alt={videoSection.mainVideo.alt}
            />
            <div className="vplay">
              <div className="vring">
                <div className="vfill">▶</div>
              </div>
            </div>
          </div>

          <div className="vlist">
            {videoSection.videos.map((video, index) => (
              <div className={index === 0 ? "vi act" : "vi"} key={video.title}>
                <div className="vi-thumb">
                  <img src={video.image} alt={video.title} />
                  <div className="vi-mplay">
                    <div className="mcirc">▶</div>
                  </div>
                </div>
                <div className="vi-meta">
                  <h5>{video.title}</h5>
                  <span>{video.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
