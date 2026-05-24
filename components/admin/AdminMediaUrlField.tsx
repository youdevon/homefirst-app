"use client";

import { useState } from "react";
import type { MediaSelectorOption } from "@/lib/media-data";

type AdminMediaUrlFieldProps = {
  name: string;
  defaultValue?: string;
  options: MediaSelectorOption[];
  required?: boolean;
  placeholder?: string;
};

export default function AdminMediaUrlField({
  name,
  defaultValue = "",
  options,
  required = false,
  placeholder,
}: AdminMediaUrlFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const selectedOption = options.find((option) => option.fileUrl === value);

  return (
    <div className="admin-media-url-field">
      <select
        className="admin-media-select"
        value={selectedOption?.fileUrl ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue) {
            setValue(nextValue);
          }
        }}
        aria-label={`Choose ${name} from Media Library`}
      >
        <option value="">No media selected</option>
        {options.map((option) => (
          <option key={option.fileUrl} value={option.fileUrl}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required={required}
        placeholder={placeholder}
      />

      <span className="admin-form-help">
        Choose from Media Library or paste a custom URL.
      </span>
    </div>
  );
}
