import type { EditableNewsItem } from "@/lib/news-data";
import { NEWS_CATEGORIES, toDatetimeLocalValue } from "@/lib/news-data";

type NewsFormProps = {
  item?: EditableNewsItem;
  action: string;
  submitLabel: string;
};

export default function NewsForm({ item, action, submitLabel }: NewsFormProps) {
  return (
    <form method="post" action={action} className="admin-settings-form">
      <div className="admin-form-grid">
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

        <label className="admin-field admin-field-full">
          <span>Image URL</span>
          <input
            type="text"
            name="imageUrl"
            defaultValue={item?.imageUrl ?? ""}
            required
            placeholder="/images/news/item.jpg"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Summary</span>
          <textarea
            name="summary"
            defaultValue={item?.summary ?? ""}
            required
            placeholder="Short summary shown on news cards."
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Body</span>
          <textarea
            name="body"
            defaultValue={item?.body ?? ""}
            placeholder="Full article content for future detail pages."
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
