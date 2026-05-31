import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableLeader } from "@/lib/leaders-data";
import {
  LEADER_PERSON_TYPE_ADMIN_LABELS,
  LEADER_PERSON_TYPES,
  type LeaderPersonType,
} from "@/lib/leader-person-type";
import type { MediaSelectorOption } from "@/lib/media-data";

type LeaderFormProps = {
  leader?: EditableLeader;
  action: string;
  submitLabel: string;
  imageFiles: MediaSelectorOption[];
  defaultPersonType?: LeaderPersonType;
};

export default function LeaderForm({
  leader,
  action,
  submitLabel,
  imageFiles,
  defaultPersonType = "LEADER",
}: LeaderFormProps) {
  const personType = leader?.personType ?? defaultPersonType;
  const isBoardMember = personType === "BOARD";

  return (
    <form
      method="post"
      action={action}
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection title="Person details">
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              defaultValue={leader?.name ?? ""}
              required
              placeholder="Dr. Marlene Joseph"
            />
          </label>

          <label className="admin-field">
            <span>Position / title</span>
            <input
              type="text"
              name="title"
              defaultValue={leader?.title ?? ""}
              required
              placeholder={
                isBoardMember ? "Board Chair" : "Executive Director"
              }
            />
          </label>

          <label className="admin-field">
            <span>Person type</span>
            <select name="personType" defaultValue={personType}>
              {LEADER_PERSON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {LEADER_PERSON_TYPE_ADMIN_LABELS[type]}
                </option>
              ))}
            </select>
            <span className="admin-form-help">
              Leaders appear in Our Leaders. Board members appear in the Board
              of Directors section.
            </span>
          </label>

          <label className="admin-field">
            <span>Display order</span>
            <input
              type="number"
              name="displayOrder"
              min={0}
              defaultValue={leader?.displayOrder ?? 0}
              required
            />
          </label>

          <label className="admin-field">
            <span>Show on website</span>
            <select
              name="active"
              defaultValue={leader?.active === false ? "false" : "true"}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <label className="admin-field admin-field-full">
            <span>Photo URL</span>
            <AdminMediaUrlField
              name="photoUrl"
              defaultValue={leader?.photoUrl ?? ""}
              options={imageFiles}
              required
              placeholder="/uploads/images/leader.jpg"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>{isBoardMember ? "Short bio" : "Bio"}</span>
            <textarea
              name="bio"
              defaultValue={leader?.bio ?? ""}
              required={!isBoardMember}
              placeholder={
                isBoardMember
                  ? "Optional short description shown on the board card."
                  : "Biography shown on the About page."
              }
            />
          </label>
        </div>
      </AdminFormSection>

      <div className="admin-save-bar admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
