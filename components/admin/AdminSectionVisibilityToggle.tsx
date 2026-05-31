"use client";

import { useId, useState } from "react";

type AdminSectionVisibilityToggleProps = {
  name: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function AdminSectionVisibilityToggle({
  name,
  defaultChecked = true,
  onChange,
}: AdminSectionVisibilityToggleProps) {
  const inputId = useId();
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="admin-section-visibility" htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        name={name}
        value="1"
        checked={checked}
        onChange={(event) => {
          setChecked(event.target.checked);
          onChange?.(event.target.checked);
        }}
      />
      <span>Show on website</span>
    </label>
  );
}
