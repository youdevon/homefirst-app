import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LeaderForm from "@/components/admin/LeaderForm";
import { getLeaderById } from "@/lib/leaders-data";
import { LEADER_PERSON_TYPE_ADMIN_LABELS } from "@/lib/leader-person-type";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminEditLeaderPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminEditLeaderPage({
  params,
  searchParams,
}: AdminEditLeaderPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const [leader, mediaAssets] = await Promise.all([
    getLeaderById(id),
    getAdminMediaSelectorAssets(),
  ]);

  if (!leader) {
    notFound();
  }

  const showValidationError = query.error === "validation";
  const typeLabel = LEADER_PERSON_TYPE_ADMIN_LABELS[leader.personType];

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Leaders & Board"
        title={`Edit ${typeLabel}`}
        lead={`Update ${leader.name}'s profile.`}
        backHref={`/admin/leaders?type=${leader.personType}`}
        backLabel="← Back to list"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <LeaderForm
          leader={leader}
          action={`/api/admin/leaders/${leader.id}`}
          submitLabel={`Save ${typeLabel}`}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
