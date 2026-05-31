import type { Metadata } from "next";
import Link from "next/link";
import MediaCategoryFilter from "@/components/MediaCategoryFilter";
import { getPublicMediaPageContent } from "@/lib/media-page-content-data";
import { getPublicNewsArticles } from "@/lib/news-data";
import { isSectionVisible } from "@/lib/section-visibility";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media",
};

type MediaPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = searchParams ? await searchParams : {};
  const activeCategory = params.category?.trim() ?? "";
  const pageContent = await getPublicMediaPageContent();
  const articles = await getPublicNewsArticles(activeCategory || undefined);
  const [featured, ...rest] = articles;
  const show = (key: keyof typeof pageContent.visibility) =>
    isSectionVisible(pageContent.visibility, key);

  const showArticlesSection =
    show("sectionIntro") ||
    show("categoryFilter") ||
    show("featuredArticle") ||
    show("articleGrid");

  return (
    <main>
      {show("hero") ? (
        <section
          className="page-hero media-page-hero"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(10,26,24,.92), rgba(16,38,36,.45)), url("${pageContent.backgroundImageUrl}")`,
          }}
        >
          <div className="page-hero-overlay"></div>
          <div className="wrap page-hero-content">
            <span className="eyebrow">{pageContent.eyebrow}</span>
            <h1 className="page-title">
              {pageContent.title} <em>{pageContent.highlightedTitle}</em>
            </h1>
            <p>{pageContent.description}</p>
          </div>
        </section>
      ) : null}

      {showArticlesSection ? (
        <section className="sec media-page-section">
          <div className="wrap">
            {show("sectionIntro") ? (
              <div className="center-head media-page-section-head">
                <span className="eyebrow">{pageContent.sectionEyebrow}</span>
                <h2 className="sec-title">
                  {pageContent.sectionTitle}{" "}
                  <em>{pageContent.sectionHighlightedTitle}</em>
                </h2>
                <p className="sec-lead">{pageContent.sectionLead}</p>
              </div>
            ) : null}

            {show("categoryFilter") ? (
              <MediaCategoryFilter activeCategory={activeCategory} />
            ) : null}

            {show("featuredArticle") && featured ? (
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
            ) : show("featuredArticle") && !featured ? (
              <div className="media-empty">
                <p>No published articles match this filter yet.</p>
              </div>
            ) : null}

            {show("articleGrid") && rest.length > 0 ? (
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
      ) : null}
    </main>
  );
}
