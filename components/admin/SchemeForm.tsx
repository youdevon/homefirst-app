import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableScheme } from "@/lib/schemes-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type SchemeFormProps = {
  scheme?: EditableScheme;
  action: string;
  submitLabel: string;
  imageFiles: MediaSelectorOption[];
};

export default function SchemeForm({
  scheme,
  action,
  submitLabel,
  imageFiles,
}: SchemeFormProps) {
  return (
    <form method="post" action={action} className="admin-settings-form">
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            defaultValue={scheme?.name ?? ""}
            required
            placeholder="Family Housing Scheme"
          />
        </label>

        <label className="admin-field">
          <span>Status label</span>
          <input
            type="text"
            name="statusLabel"
            defaultValue={scheme?.statusLabel ?? ""}
            required
            placeholder="Open Applications"
          />
        </label>

        <label className="admin-field">
          <span>Meta</span>
          <input
            type="text"
            name="meta"
            defaultValue={scheme?.meta ?? ""}
            required
            placeholder="2–5 Bedroom Units"
          />
        </label>

        <label className="admin-field">
          <span>Display order</span>
          <input
            type="number"
            name="displayOrder"
            min={0}
            defaultValue={scheme?.displayOrder ?? 0}
            required
          />
        </label>

        <label className="admin-field">
          <span>Status</span>
          <select
            name="active"
            defaultValue={scheme?.active === false ? "false" : "true"}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Image URL</span>
          <AdminMediaUrlField
            name="imageUrl"
            defaultValue={scheme?.imageUrl ?? ""}
            options={imageFiles}
            required
            placeholder="/uploads/images/scheme.jpg"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Description</span>
          <textarea
            name="description"
            defaultValue={scheme?.description ?? ""}
            required
            placeholder="Short description shown on scheme cards."
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
