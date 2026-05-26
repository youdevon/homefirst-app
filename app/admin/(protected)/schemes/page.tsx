import Link from "next/link";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import SchemesTable from "@/components/admin/SchemesTable";
import { getAllSchemesForAdmin } from "@/lib/schemes-data";

export const dynamic = "force-dynamic";

type AdminSchemesPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminSchemesPage({
  searchParams,
}: AdminSchemesPageProps) {
  const params = searchParams ? await searchParams : {};
  const schemes = await getAllSchemesForAdmin();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Shared Content</p>
          <h1>Housing Schemes</h1>
          <p className="admin-lead">
            Manage individual housing scheme records. Updates here appear on
            the homepage preview, /schemes page, and related links.
          </p>
        </div>
        <div className="admin-header-actions-inline">
          <Link href="/admin/dashboard" className="admin-back-link">
            ← Back to dashboard
          </Link>
          <Link href="/admin/schemes/new" className="admin-btn admin-btn-primary admin-btn-dark">
            Add Scheme
          </Link>
        </div>
      </div>

      <AdminScopeNotice
        manages={[
          "Scheme titles, descriptions, images, status labels, and links",
        ]}
        doesNotManage={[
          "Housing Schemes page hero, intro text, and page call-to-action",
        ]}
        relatedLinks={[
          { label: "Edit Housing Schemes page", href: "/admin/schemes-page" },
        ]}
      />

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Housing schemes updated successfully.
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

      <div className="admin-panel">
        <SchemesTable schemes={schemes} />
      </div>
    </div>
  );
}
