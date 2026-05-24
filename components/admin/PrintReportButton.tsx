"use client";

export default function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="admin-btn admin-btn-primary admin-btn-dark"
    >
      Print Report
    </button>
  );
}
