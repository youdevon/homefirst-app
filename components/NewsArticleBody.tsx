import type { PublicNewsArticle } from "@/lib/news-data";

type NewsArticleBodyProps = {
  article: PublicNewsArticle;
};

function splitParagraphs(body: string): string[] {
  const trimmed = body.trim();

  if (!trimmed) {
    return [];
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function NewsArticleBody({ article }: NewsArticleBodyProps) {
  const paragraphs = splitParagraphs(article.body);

  if (paragraphs.length === 0) {
    paragraphs.push(article.summary);
  }

  const remainingStart = article.imageUrlTwo ? 1 : 0;
  const afterSecondImageStart = article.imageUrlThree
    ? remainingStart + 1
    : remainingStart;

  return (
    <div className="article-body">
      {paragraphs[0] ? <p>{paragraphs[0]}</p> : null}

      {article.imageUrlTwo ? (
        <figure className="article-inline-figure article-inline-figure-left">
          <img src={article.imageUrlTwo} alt={article.imageCaptionTwo || article.title} />
          {article.imageCaptionTwo ? (
            <figcaption>{article.imageCaptionTwo}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {paragraphs.slice(remainingStart, afterSecondImageStart).map((paragraph) => (
        <p key={`mid-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}

      {article.imageUrlThree ? (
        <figure className="article-inline-figure article-inline-figure-right">
          <img src={article.imageUrlThree} alt={article.imageCaptionThree || article.title} />
          {article.imageCaptionThree ? (
            <figcaption>{article.imageCaptionThree}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {paragraphs.slice(afterSecondImageStart).map((paragraph) => (
        <p key={`rest-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  );
}
