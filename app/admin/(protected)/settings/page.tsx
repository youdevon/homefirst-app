function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Coming Soon</p>
          <h1>{title}</h1>
          <p className="admin-lead">
            This management screen will be available in a future phase.
          </p>
        </div>
      </div>

      <div className="admin-placeholder">
        <p>Placeholder route ready for CRUD implementation.</p>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return <AdminPlaceholder title="Site Settings" />;
}
