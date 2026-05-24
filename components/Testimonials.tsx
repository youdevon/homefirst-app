import { testimonials, testimonialsSection } from "@/content/testimonials";

export default function Testimonials() {
  return (
    <section className="sec testi-sec">
      <div className="wrap">
        <div className="center-head">
          <span className="eyebrow">{testimonialsSection.eyebrow}</span>
          <h2 className="sec-title">
            {testimonialsSection.title}{" "}
            <em>{testimonialsSection.titleEmphasis}</em>
          </h2>
        </div>

        <div className="testi-grid">
          {testimonials.map((item) => (
            <article className="tc-card" key={item.name}>
              <div className="tq">&quot;</div>
              <p className="tt">{item.quote}</p>

              <div className="tp">
                <div className="tav">
                  <img src={item.image} alt={item.name} />
                </div>
                <div>
                  <div className="tn">{item.name}</div>
                  <div className="tl">{item.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
