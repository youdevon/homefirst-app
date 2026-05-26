type AdminScopeNoticeProps = {
  manages: string[];
  doesNotManage?: string[];
  relatedLinks?: { label: string; href: string }[];
};

export default function AdminScopeNotice({
  manages,
  doesNotManage = [],
  relatedLinks = [],
}: AdminScopeNoticeProps) {
  return (
    <div className="admin-scope-notice">
      <div className="admin-scope-notice-grid">
        <div>
          <h2 className="admin-scope-notice-title">What you can edit here</h2>
          <ul className="admin-scope-list">
            {manages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {doesNotManage.length > 0 ? (
          <div>
            <h2 className="admin-scope-notice-title">Managed elsewhere</h2>
            <ul className="admin-scope-list admin-scope-list-muted">
              {doesNotManage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {relatedLinks.length > 0 ? (
        <div className="admin-scope-links">
          {relatedLinks.map((link) => (
            <a key={link.href} href={link.href} className="admin-scope-link">
              {link.label} →
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
