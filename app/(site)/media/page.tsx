import Link from "next/link";
import { mediaPage } from "@/content/news";
import MediaCategoryFilter from "@/components/MediaCategoryFilter";
import { getPublicNewsArticles } from "@/lib/news-data";

export const dynamic = "force-dynamic";

type MediaPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = searchParams ? await searchParams : {};
  const activeCategory = params.category?.trim() ?? "";
  const articles = await getPublicNewsArticles(activeCategory || undefined);
  const [featured, ...rest] = articles;

  return (
    <main>
      <section
        className="page-hero media-page-hero"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${mediaPage.heroBackground}")`,
        }}
      >
        <div className="page-hero-overlay"></div>
        <div className="wrap page-hero-content">
          <span className="eyebrow">{mediaPage.eyebrow}</span>
          <h1 className="page-title">
            {mediaPage.title} <em>{mediaPage.titleEmphasis}</em>
          </h1>
          <p>{mediaPage.description}</p>
        </div>
      </section>

      <section className="sec media-page-section">
        <div className="wrap">
          <MediaCategoryFilter activeCategory={activeCategory} />

          {featured ? (
            <article className="media-featured-card">
              <Link href={`/media/${featured.slug}`} className="media-featured-link">
                <div className="media-featured-image">
                  <img src={featured.imageUrl} alt={featured.title} />
                </div>
                <div className="media-featured-body">
                  <span className="ncat">{featured.category}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.summary}</p>
                  <div className="media-card-meta">
                    <span>{featured.dateLabel}</span>
                    <span className="media-read-more">Read More →</span>
                  </div>
                </div>
              </Link>
            </article>
          ) : (
            <div className="media-empty">
              <p>No published articles match this filter yet.</p>
            </div>
          )}

          {rest.length > 0 ? (
            <div className="media-articles-grid">
              {rest.map((article) => (
                <article className="media-article-card" key={article.slug}>
                  <Link href={`/media/${article.slug}`} className="media-article-link">
                    <div className="media-article-image">
                      <img src={article.imageUrl} alt={article.title} />
                    </div>
                    <div className="media-article-body">
                      <span className="ncat">{article.category}</span>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                      <div className="media-card-meta">
                        <span>{article.dateLabel}</span>
                        <span className="media-read-more">Read More →</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
