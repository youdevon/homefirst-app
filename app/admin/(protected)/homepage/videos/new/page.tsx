import Link from "next/link";
import HomepageVideoForm from "@/components/admin/HomepageVideoForm";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminNewHomepageVideoPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewHomepageVideoPage({
  searchParams,
}: AdminNewHomepageVideoPageProps) {
  const params = searchParams ? await searchParams : {};
  const mediaAssets = await getAdminMediaSelectorAssets();
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Homepage</p>
          <h1>Add Homepage Video</h1>
          <p className="admin-lead">
            Add a video for the Real Communities section on the homepage.
          </p>
        </div>
        <Link href="/admin/homepage" className="admin-back-link">
          ← Back to homepage content
        </Link>
      </div>

      {showSessionError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Your session has expired. Please sign in again.
        </div>
      ) : null}

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly. At least one video or
          thumbnail URL is required.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <HomepageVideoForm
          action="/api/admin/homepage-videos"
          submitLabel="Create Video"
          imageFiles={mediaAssets.imageFiles}
          videoFiles={mediaAssets.videoFiles}
        />
      </div>
    </div>
  );
}
