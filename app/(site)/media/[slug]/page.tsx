import Link from "next/link";
import { notFound } from "next/navigation";
import NewsArticleBody from "@/components/NewsArticleBody";
import {
  getPublicNewsArticleBySlug,
  getRelatedPublicNewsArticles,
} from "@/lib/news-data";

export const dynamic = "force-dynamic";

type MediaArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MediaArticlePage({ params }: MediaArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedPublicNewsArticles(article.slug);

  return (
    <main>
      <section className="sec article-page">
        <div className="wrap article-wrap">
          <Link href="/media" className="article-back-link">
            ← Back to Media
          </Link>

          <header className="article-header">
            <span className="ncat">{article.category}</span>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-intro">{article.summary}</p>
            {article.dateLabel ? (
              <p className="article-date">{article.dateLabel}</p>
            ) : null}
          </header>

          {article.imageUrl ? (
            <figure className="article-main-figure">
              <img src={article.imageUrl} alt={article.imageCaptionOne || article.title} />
              {article.imageCaptionOne ? (
                <figcaption>{article.imageCaptionOne}</figcaption>
              ) : null}
            </figure>
          ) : null}

          <NewsArticleBody article={article} />

          {relatedArticles.length > 0 ? (
            <section className="article-related">
              <h2>Recent Updates</h2>
              <div className="article-related-grid">
                {relatedArticles.map((item) => (
                  <article className="media-article-card" key={item.slug}>
                    <Link href={`/media/${item.slug}`} className="media-article-link">
                      <div className="media-article-image">
                        <img src={item.imageUrl} alt={item.title} />
                      </div>
                      <div className="media-article-body">
                        <span className="ncat">{item.category}</span>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                        <div className="media-card-meta">
                          <span>{item.dateLabel}</span>
                          <span className="media-read-more">Read More →</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
