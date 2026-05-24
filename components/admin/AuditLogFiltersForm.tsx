import type { AuditLogFilters } from "@/lib/audit-log";

type AuditLogFiltersFormProps = {
  filters: AuditLogFilters;
  actions: string[];
  entityTypes: string[];
  roles: string[];
};

export default function AuditLogFiltersForm({
  filters,
  actions,
  entityTypes,
  roles,
}: AuditLogFiltersFormProps) {
  const query = new URLSearchParams();

  if (filters.from) query.set("from", filters.from);
  if (filters.to) query.set("to", filters.to);
  if (filters.actor) query.set("actor", filters.actor);
  if (filters.role) query.set("role", filters.role);
  if (filters.action) query.set("action", filters.action);
  if (filters.entityType) query.set("entityType", filters.entityType);
  if (filters.search) query.set("search", filters.search);

  const printHref = `/admin/audit/print${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <form method="get" action="/admin/audit" className="admin-settings-form admin-audit-filters">
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Date from</span>
          <input type="date" name="from" defaultValue={filters.from ?? ""} />
        </label>

        <label className="admin-field">
          <span>Date to</span>
          <input type="date" name="to" defaultValue={filters.to ?? ""} />
        </label>

        <label className="admin-field">
          <span>Actor</span>
          <input
            type="text"
            name="actor"
            defaultValue={filters.actor ?? ""}
            placeholder="Name or email"
          />
        </label>

        <label className="admin-field">
          <span>Role</span>
          <select name="role" defaultValue={filters.role ?? ""}>
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Action</span>
          <select name="action" defaultValue={filters.action ?? ""}>
            <option value="">All actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Entity type</span>
          <select name="entityType" defaultValue={filters.entityType ?? ""}>
            <option value="">All entity types</option>
            {entityTypes.map((entityType) => (
              <option key={entityType} value={entityType}>
                {entityType}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Search</span>
          <input
            type="text"
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Search descriptions, entity names, or actor details"
          />
        </label>
      </div>

      <div className="admin-form-actions admin-form-actions-inline">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Apply Filters
        </button>
        <a href="/admin/audit" className="admin-btn admin-btn-secondary">
          Clear
        </a>
        <a href={printHref} className="admin-btn admin-btn-ghost admin-btn-dark" target="_blank">
          Print Report
        </a>
      </div>
    </form>
  );
}
