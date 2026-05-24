import Link from "next/link";
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
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Homepage</p>
          <h1>Homepage Content</h1>
          <p className="admin-lead">
            Edit the homepage hero, CTA banner, and Real Communities video
            section stored in the database.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

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

      <div className="admin-panel">
        <HomepageContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>

      <div className="admin-panel admin-panel-spaced">
        <HomepageVideosSectionForm header={videoHeader} />
      </div>

      <div className="admin-panel admin-panel-spaced">
        <div className="admin-form-section">
          <div className="admin-page-header admin-page-header-compact">
            <div>
              <h2 className="admin-form-section-title">Video Items</h2>
              <p className="admin-form-section-lead">
                Manage playable homepage videos. Use Media Library paths for
                uploaded files.
              </p>
            </div>
            <Link
              href="/admin/homepage/videos/new"
              className="admin-btn admin-btn-primary admin-btn-dark"
            >
              Add Video
            </Link>
          </div>
        </div>

        <HomepageVideosTable videos={videos} />
      </div>
    </div>
  );
}
