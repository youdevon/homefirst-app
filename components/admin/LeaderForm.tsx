import type { EditableLeader } from "@/lib/leaders-data";

type LeaderFormProps = {
  leader?: EditableLeader;
  action: string;
  submitLabel: string;
};

export default function LeaderForm({
  leader,
  action,
  submitLabel,
}: LeaderFormProps) {
  return (
    <form method="post" action={action} className="admin-settings-form">
      <div className="admin-form-grid">
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
          <span>Title</span>
          <input
            type="text"
            name="title"
            defaultValue={leader?.title ?? ""}
            required
            placeholder="Executive Director"
          />
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
          <span>Status</span>
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
          <input
            type="text"
            name="photoUrl"
            defaultValue={leader?.photoUrl ?? ""}
            required
            placeholder="/images/leaders/name.jpg"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Bio</span>
          <textarea
            name="bio"
            defaultValue={leader?.bio ?? ""}
            required
            placeholder="Short biography shown on the About page."
          />
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
