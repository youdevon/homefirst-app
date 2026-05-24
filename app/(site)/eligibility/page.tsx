import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eligibility",
};

export default function EligibilityPage() {
  return (
    <main className="sec">
      <div className="wrap">
        <span className="eyebrow">Eligibility</span>
        <h1 className="sec-title">Check Your <em>Eligibility</em></h1>
        <p className="sec-lead">This page will guide citizens through eligibility criteria and requirements.</p>
      </div>
    </main>
  );
}
