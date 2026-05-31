import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableNewsItem } from "@/lib/news-data";
import { NEWS_CATEGORIES, toDatetimeLocalValue } from "@/lib/news-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type NewsFormProps = {
  item?: EditableNewsItem;
  action: string;
  submitLabel: string;
  imageFiles: MediaSelectorOption[];
};

export default function NewsForm({
  item,
  action,
  submitLabel,
  imageFiles,
}: NewsFormProps) {
  return (
    <form
      method="post"
      action={action}
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection title="Article basics" defaultOpen>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Title</span>
            <input
              type="text"
              name="title"
              defaultValue={item?.title ?? ""}
              required
              placeholder="Applications Now Open for the Family Housing Scheme"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Slug</span>
            <input
              type="text"
              name="slug"
              defaultValue={item?.slug ?? ""}
              placeholder="applications-open-family-housing-scheme"
            />
            <span className="admin-form-help">
              Leave blank to auto-generate from the title. Used in the public URL
              /media/your-slug.
            </span>
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Summary" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Summary</span>
            <textarea
              name="summary"
              defaultValue={item?.summary ?? ""}
              required
              placeholder="Short summary shown on news cards."
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Full article body" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Full article body</span>
            <textarea
              name="body"
              defaultValue={item?.body ?? ""}
              placeholder="Full article content. Separate paragraphs with a blank line."
              rows={12}
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Images and captions" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Main image URL</span>
            <AdminMediaUrlField
              name="imageUrl"
              defaultValue={item?.imageUrl ?? ""}
              options={imageFiles}
              required
              placeholder="/uploads/images/news-item.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Main image caption</span>
            <input
              type="text"
              name="imageCaptionOne"
              defaultValue={item?.imageCaptionOne ?? ""}
              placeholder="Optional caption for the main image"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Second image URL (optional)</span>
            <AdminMediaUrlField
              name="imageUrlTwo"
              defaultValue={item?.imageUrlTwo ?? ""}
              options={imageFiles}
              placeholder="/uploads/images/news-secondary.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Second image caption</span>
            <input
              type="text"
              name="imageCaptionTwo"
              defaultValue={item?.imageCaptionTwo ?? ""}
              placeholder="Optional caption for the second image"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Third image URL (optional)</span>
            <AdminMediaUrlField
              name="imageUrlThree"
              defaultValue={item?.imageUrlThree ?? ""}
              options={imageFiles}
              placeholder="/uploads/images/news-third.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Third image caption</span>
            <input
              type="text"
              name="imageCaptionThree"
              defaultValue={item?.imageCaptionThree ?? ""}
              placeholder="Optional caption for the third image"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Publishing" defaultOpen={false}>
        <div className="admin-form-grid-3">
          <label className="admin-field">
            <span>Category</span>
            <select
              name="category"
              defaultValue={item?.category ?? NEWS_CATEGORIES[0]}
              required
            >
              {NEWS_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Published date</span>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={toDatetimeLocalValue(item?.publishedAt ?? null)}
            />
          </label>

          <label className="admin-field">
            <span>Status</span>
            <select
              name="published"
              defaultValue={item?.published === false ? "false" : "true"}
            >
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
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
