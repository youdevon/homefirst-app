import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import LeadersTable from "@/components/admin/LeadersTable";
import LeadersTypeFilter, {
  getNewPersonHref,
  parseLeadersPageType,
} from "@/components/admin/LeadersTypeFilter";
import { getAllLeadersForAdmin } from "@/lib/leaders-data";
import {
  LEADER_PERSON_TYPE_LABELS,
  type LeaderPersonType,
} from "@/lib/leader-person-type";

export const dynamic = "force-dynamic";

type AdminLeadersPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string; type?: string }>;
};

function getEmptyMessage(type: LeaderPersonType | "ALL"): string {
  if (type === "BOARD") {
    return "No board members yet. Add the first Board of Directors profile.";
  }

  if (type === "LEADER") {
    return "No leadership profiles yet. Add the first leadership team member.";
  }

  return "No people yet. Add a leadership or board profile.";
}

export default async function AdminLeadersPage({
  searchParams,
}: AdminLeadersPageProps) {
  const params = searchParams ? await searchParams : {};
  const activeType = parseLeadersPageType(params.type);
  const leaders = await getAllLeadersForAdmin(
    activeType === "ALL" ? undefined : activeType,
  );

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";
  const addLabel =
    activeType === "BOARD"
      ? "Add Board Member"
      : activeType === "LEADER"
        ? "Add Leader"
        : "Add Person";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Shared Content"
        title="Leaders & Board"
        lead="Manage leadership team and Board of Directors profiles shown on the About page."
      >
        <Link
          href={getNewPersonHref(activeType)}
          className="admin-btn admin-btn-primary admin-btn-dark"
        >
          {addLabel}
        </Link>
      </AdminPageHeader>

      <AdminScopeNotice
        manages={[
          "Leadership team profiles for the Our Leaders section",
          "Board of Directors profiles for the board section",
          "Photos, titles, bios, display order, and active status",
        ]}
        doesNotManage={[
          "About page section headings and visibility toggles",
        ]}
        relatedLinks={[
          { label: "Edit About page sections", href: "/admin/about" },
        ]}
      />

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Profiles updated successfully.
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

      <div className="admin-panel admin-panel-spaced">
        <LeadersTypeFilter activeType={activeType} />
        {activeType !== "ALL" ? (
          <p className="admin-muted admin-filter-caption">
            Showing {LEADER_PERSON_TYPE_LABELS[activeType]} profiles only.
          </p>
        ) : null}
        <LeadersTable leaders={leaders} emptyMessage={getEmptyMessage(activeType)} />
      </div>
    </div>
  );
}
