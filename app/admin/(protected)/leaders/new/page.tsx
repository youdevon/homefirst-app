import Link from "next/link";
import LeaderForm from "@/components/admin/LeaderForm";

export const dynamic = "force-dynamic";

type AdminNewLeaderPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewLeaderPage({
  searchParams,
}: AdminNewLeaderPageProps) {
  const params = searchParams ? await searchParams : {};
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Leaders</p>
          <h1>Add Leader</h1>
          <p className="admin-lead">
            Create a new leadership profile for the About page.
          </p>
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
          action="/api/admin/leaders"
          submitLabel="Create Leader"
        />
      </div>
    </div>
  );
}
