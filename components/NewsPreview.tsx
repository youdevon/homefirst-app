import Link from "next/link";
import { newsSection } from "@/content/news";
import { getPublicNewsItems } from "@/lib/news-data";

export default async function NewsPreview() {
  const newsItems = await getPublicNewsItems();

  return (
    <section className="sec news-sec">
      <div className="wrap">
        <div className="news-head">
          <div>
            <span className="eyebrow">{newsSection.eyebrow}</span>
            <h2 className="sec-title">
              {newsSection.title} <em>{newsSection.titleEmphasis}</em>
            </h2>
          </div>

          <Link href={newsSection.viewAllHref} className="lk">
            {newsSection.viewAllLabel}
          </Link>
        </div>

        <div className="news-grid">
          {newsItems.map((item) => (
            <article
              className={item.featured ? "nc feat" : "nc"}
              key={`${item.title}-${item.date}`}
            >
              <div className="ni">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="nb">
                <span className="ncat">{item.category}</span>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
                <div className="nmeta">
                  <span>{item.date}</span>
                  <span>{newsSection.sourceLabel}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
