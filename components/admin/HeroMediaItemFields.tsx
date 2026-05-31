"use client";

import { useState } from "react";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { HeroMediaItem } from "@/lib/hero-media";
import type { MediaSelectorOption } from "@/lib/media-data";

type HeroMediaItemFieldsProps = {
  slot: number;
  item?: HeroMediaItem;
  imageFiles: MediaSelectorOption[];
  videoFiles: MediaSelectorOption[];
};

export default function HeroMediaItemFields({
  slot,
  item,
  imageFiles,
  videoFiles,
}: HeroMediaItemFieldsProps) {
  const [type, setType] = useState(item?.type ?? "image");

  return (
    <div className="admin-hero-media-item">
      <h3 className="admin-hero-media-item-title">Media item {slot}</h3>
      <div className="admin-form-grid-2">
        <label className="admin-field">
          <span>Media type</span>
          <select
            name={`hero_media${slot}_type`}
            value={type}
            onChange={(event) =>
              setType(event.target.value === "video" ? "video" : "image")
            }
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        <label className="admin-field admin-toggle-row">
          <span>Show on website</span>
          <label className="admin-checkbox-field">
            <input
              type="checkbox"
              name={`hero_media${slot}_active`}
              value="1"
              defaultChecked={item?.active ?? false}
            />
            <span className="admin-muted">Include in homepage hero rotation.</span>
          </label>
        </label>

        <label className="admin-field admin-field-full">
          <span>{type === "video" ? "Video file path" : "Image file path"}</span>
          <AdminMediaUrlField
            name={`hero_media${slot}_url`}
            defaultValue={item?.url ?? ""}
            options={type === "video" ? videoFiles : imageFiles}
            placeholder={
              type === "video"
                ? "/uploads/videos/hero.mp4"
                : `/uploads/images/hero-${slot}.jpg`
            }
          />
        </label>

        {type === "video" ? (
          <label className="admin-field admin-field-full">
            <span>Video poster image (optional)</span>
            <AdminMediaUrlField
              name={`hero_media${slot}_posterUrl`}
              defaultValue={item?.posterUrl ?? ""}
              options={imageFiles}
              placeholder="/uploads/images/hero-poster.jpg"
              showInlineHelp={false}
            />
            <span className="admin-form-help">
              Shown while the video loads or when reduced motion is enabled.
            </span>
          </label>
        ) : (
          <input type="hidden" name={`hero_media${slot}_posterUrl`} value="" />
        )}
      </div>
    </div>
  );
}
