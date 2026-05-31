import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LeaderForm from "@/components/admin/LeaderForm";
import { parseLeaderPersonType } from "@/lib/leader-person-type";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminNewLeaderPageProps = {
  searchParams?: Promise<{ error?: string; type?: string }>;
};

export default async function AdminNewLeaderPage({
  searchParams,
}: AdminNewLeaderPageProps) {
  const params = searchParams ? await searchParams : {};
  const mediaAssets = await getAdminMediaSelectorAssets();
  const personType = parseLeaderPersonType(params.type);
  const isBoardMember = personType === "BOARD";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Leaders & Board"
        title={isBoardMember ? "Add Board Member" : "Add Leader"}
        lead={
          isBoardMember
            ? "Create a new Board of Directors profile for the About page."
            : "Create a new leadership profile for the Our Leaders section."
        }
        backHref={`/admin/leaders?type=${personType}`}
        backLabel="← Back to list"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <LeaderForm
          action="/api/admin/leaders"
          submitLabel={isBoardMember ? "Create Board Member" : "Create Leader"}
          imageFiles={mediaAssets.imageFiles}
          defaultPersonType={personType}
        />
      </div>
    </div>
  );
}
