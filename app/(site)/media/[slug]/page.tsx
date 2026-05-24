import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: MediaArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicNewsArticleBySlug(slug);

  if (!article) {
    return { title: "Article" };
  }

  return { title: article.title };
}

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
        </div>
      </section>

      {relatedArticles.length > 0 ? (
        <section className="recent-updates-section">
          <div className="wrap">
            <h2 className="recent-updates-title">Recent Updates</h2>
            <div className="recent-updates-rail">
              {relatedArticles.map((item) => (
                <article className="recent-update-card" key={item.slug}>
                  <Link href={`/media/${item.slug}`} className="recent-update-link">
                    <div className="recent-update-thumb">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                    <div className="recent-update-body">
                      <span className="ncat">{item.category}</span>
                      <h3>{item.title}</h3>
                      <div className="recent-update-meta">
                        <span>{item.dateLabel}</span>
                        <span className="media-read-more">Read More →</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
