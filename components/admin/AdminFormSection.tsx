"use client";

import { useId, useState } from "react";
import AdminSectionVisibilityToggle from "@/components/admin/AdminSectionVisibilityToggle";

type AdminFormSectionProps = {
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  visibilityName?: string;
  visibilityEnabled?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
};

export default function AdminFormSection({
  title,
  lead,
  children,
  className,
  visibilityName,
  visibilityEnabled = true,
  defaultOpen = true,
  collapsible = true,
}: AdminFormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [visible, setVisible] = useState(visibilityEnabled);
  const panelId = useId();
  const hidden = visibilityName ? !visible : false;
  const isOpen = !collapsible || open;

  return (
    <section
      className={`admin-section-card${hidden ? " admin-section-card-hidden" : ""}${!isOpen ? " admin-section-collapsed" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="admin-section-header admin-section-card-header">
        <div className="admin-section-header-copy">
          <div className="admin-section-title-row">
            {collapsible ? (
              <button
                type="button"
                className="admin-section-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((current) => !current)}
              >
                <span className="admin-section-toggle-icon" aria-hidden="true">
                  {isOpen ? "▾" : "▸"}
                </span>
                <h2 className="admin-section-title admin-section-card-title">
                  {title}
                </h2>
              </button>
            ) : (
              <h2 className="admin-section-title admin-section-card-title">{title}</h2>
            )}
            {hidden ? (
              <span className="admin-section-hidden-badge admin-badge-hidden admin-status-badge">
                Hidden
              </span>
            ) : null}
          </div>
          {lead ? (
            <p className="admin-section-lead admin-section-description admin-section-card-description">
              {lead}
            </p>
          ) : null}
        </div>
        {visibilityName ? (
          <AdminSectionVisibilityToggle
            name={visibilityName}
            defaultChecked={visibilityEnabled}
            onChange={setVisible}
          />
        ) : null}
      </div>
      <div
        id={panelId}
        className="admin-section-card-body"
        hidden={!isOpen}
      >
        {children}
      </div>
    </section>
  );
}
