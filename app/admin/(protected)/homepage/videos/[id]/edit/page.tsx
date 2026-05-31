import Link from "next/link";
import { notFound } from "next/navigation";
import HomepageVideoForm from "@/components/admin/HomepageVideoForm";
import { getHomepageVideoById } from "@/lib/homepage-videos-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminEditHomepageVideoPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminEditHomepageVideoPage({
  params,
  searchParams,
}: AdminEditHomepageVideoPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const [video, mediaAssets] = await Promise.all([
    getHomepageVideoById(id),
    getAdminMediaSelectorAssets(),
  ]);

  if (!video) {
    notFound();
  }

  const showSessionError = query.error === "session";
  const showValidationError = query.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Homepage</p>
          <h1>Edit Homepage Video</h1>
          <p className="admin-lead">Update {video.title}.</p>
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
          video={video}
          action={`/api/admin/homepage-videos/${video.id}`}
          submitLabel="Save Video"
          imageFiles={mediaAssets.imageFiles}
          videoFiles={mediaAssets.videoFiles}
        />
      </div>
    </div>
  );
}
