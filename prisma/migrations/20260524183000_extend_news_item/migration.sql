-- AlterTable
ALTER TABLE "NewsItem" ADD COLUMN "slug" TEXT,
ADD COLUMN "imageUrlTwo" TEXT,
ADD COLUMN "imageUrlThree" TEXT,
ADD COLUMN "imageCaptionOne" TEXT,
ADD COLUMN "imageCaptionTwo" TEXT,
ADD COLUMN "imageCaptionThree" TEXT;

UPDATE "NewsItem"
SET "slug" = lower(regexp_replace(regexp_replace(trim("title"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE "slug" IS NULL;

CREATE UNIQUE INDEX "NewsItem_slug_key" ON "NewsItem"("slug");
