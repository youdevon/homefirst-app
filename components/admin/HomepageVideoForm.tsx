import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableHomepageVideo } from "@/lib/homepage-videos-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type HomepageVideoFormProps = {
  video?: EditableHomepageVideo;
  action: string;
  submitLabel: string;
  imageFiles: MediaSelectorOption[];
  videoFiles: MediaSelectorOption[];
};

export default function HomepageVideoForm({
  video,
  action,
  submitLabel,
  imageFiles,
  videoFiles,
}: HomepageVideoFormProps) {
  return (
    <form method="post" action={action} className="admin-settings-form">
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            defaultValue={video?.title ?? ""}
            required
            placeholder="Sunrise Gardens — Eastern Region"
          />
        </label>

        <label className="admin-field">
          <span>Meta / description</span>
          <input
            type="text"
            name="meta"
            defaultValue={video?.meta ?? ""}
            placeholder="4:32 · Community Tour"
          />
        </label>

        <label className="admin-field">
          <span>Display order</span>
          <input
            type="number"
            name="displayOrder"
            min={0}
            defaultValue={video?.displayOrder ?? 0}
            required
          />
        </label>

        <label className="admin-field">
          <span>Status</span>
          <select
            name="active"
            defaultValue={video?.active === false ? "false" : "true"}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <label className="admin-field">
          <span>Featured / main video</span>
          <select
            name="featured"
            defaultValue={video?.featured ? "true" : "false"}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Video URL</span>
          <AdminMediaUrlField
            name="videoUrl"
            defaultValue={video?.videoUrl ?? ""}
            options={videoFiles}
            placeholder="/uploads/videos/community-tour.mp4"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Thumbnail URL</span>
          <AdminMediaUrlField
            name="thumbnailUrl"
            defaultValue={video?.thumbnailUrl ?? ""}
            options={imageFiles}
            placeholder="/uploads/images/video-thumb.jpg"
          />
        </label>
      </div>

      <div className="admin-note">
        Provide at least one video URL or thumbnail URL.
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
