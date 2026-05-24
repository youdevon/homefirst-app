-- CreateTable
CREATE TABLE "HomepageVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meta" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageVideo_pkey" PRIMARY KEY ("id")
);
