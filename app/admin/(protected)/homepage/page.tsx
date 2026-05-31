import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import HomepageContentForm from "@/components/admin/HomepageContentForm";
import HomepageVideosSectionForm from "@/components/admin/HomepageVideosSectionForm";
import HomepageVideosTable from "@/components/admin/HomepageVideosTable";
import { getEditableHomepageContent } from "@/lib/homepage-content-data";
import {
  getAllHomepageVideosForAdmin,
  getEditableVideoSectionHeader,
} from "@/lib/homepage-videos-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminHomepagePageProps = {
  searchParams?: Promise<{
    saved?: string;
    videos_section_saved?: string;
    video_saved?: string;
    error?: string;
  }>;
};

export default async function AdminHomepagePage({
  searchParams,
}: AdminHomepagePageProps) {
  const params = searchParams ? await searchParams : {};
  const [content, videoHeader, videos, mediaAssets] = await Promise.all([
    getEditableHomepageContent(),
    getEditableVideoSectionHeader(),
    getAllHomepageVideosForAdmin(),
    getAdminMediaSelectorAssets(),
  ]);

  const showHeroSuccess = params.saved === "1";
  const showVideosSectionSuccess = params.videos_section_saved === "1";
  const showVideoSuccess = params.video_saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";
  const showVideosSectionError = params.error === "videos-section";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="Home Page"
        lead="Edit homepage hero media, section headings, calls to action, and Real Communities video area."
        previewHref="/"
      />

      <AdminScopeNotice
        manages={[
          "Homepage hero text, images, and videos",
          "Hero background media rotation",
          "Housing schemes preview heading",
          "Homepage CTA / enquiry section",
          "Real Communities video section heading and videos",
        ]}
        doesNotManage={[
          "Site logo, header, footer, and global contact details",
          "Housing scheme cards, news articles, and leader profiles",
        ]}
        relatedLinks={[
          { label: "Manage housing schemes", href: "/admin/schemes" },
          { label: "Manage news and notices", href: "/admin/news" },
        ]}
      />

      {showHeroSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Homepage hero and CTA content saved successfully.
        </div>
      ) : null}

      {showVideosSectionSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Real Communities section header saved successfully.
        </div>
      ) : null}

      {showVideoSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Homepage video updated successfully.
        </div>
      ) : null}

      {showSessionError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Your session has expired. Please sign in again.
        </div>
      ) : null}

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      {showVideosSectionError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all Real Communities section header fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <HomepageContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
          videoFiles={mediaAssets.videoFiles}
        />

        <HomepageVideosSectionForm
          header={videoHeader}
          visibilityEnabled={content.visibility.videoSection}
        />

        <section className="admin-section-card">
          <div className="admin-page-header admin-page-header-compact">
            <div>
              <h2 className="admin-section-title">Video items</h2>
              <p className="admin-section-lead">
                Manage playable homepage videos. Use Media Library paths for uploaded
                files.
              </p>
            </div>
            <Link
              href="/admin/homepage/videos/new"
              className="admin-btn admin-btn-primary admin-btn-dark"
            >
              Add Video
            </Link>
          </div>

          <HomepageVideosTable videos={videos} />
        </section>
      </div>
    </div>
  );
}
