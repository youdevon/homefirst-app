import Link from "next/link";
import { notFound } from "next/navigation";
import LeaderForm from "@/components/admin/LeaderForm";
import { getLeaderById } from "@/lib/leaders-data";

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
  const leader = await getLeaderById(id);

  if (!leader) {
    notFound();
  }

  const showValidationError = query.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Leaders</p>
          <h1>Edit Leader</h1>
          <p className="admin-lead">Update {leader.name}&apos;s profile.</p>
        </div>
        <Link href="/admin/leaders" className="admin-back-link">
          ← Back to leaders
        </Link>
      </div>

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-panel">
        <LeaderForm
          leader={leader}
          action={`/api/admin/leaders/${leader.id}`}
          submitLabel="Save Leader"
        />
      </div>
    </div>
  );
}
