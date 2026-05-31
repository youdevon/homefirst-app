import Link from "next/link";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
  previewHref?: string;
  previewLabel?: string;
  children?: React.ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  lead,
  backHref = "/admin/dashboard",
  backLabel = "← Back to dashboard",
  previewHref,
  previewLabel = "Preview public page",
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        {eyebrow ? <p className="admin-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="admin-lead">{lead}</p> : null}
      </div>
      <div className="admin-page-actions">
        {previewHref ? (
          <a
            href={previewHref}
            className="admin-btn admin-btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {previewLabel}
          </a>
        ) : null}
        {children}
        <Link href={backHref} className="admin-back-link">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
