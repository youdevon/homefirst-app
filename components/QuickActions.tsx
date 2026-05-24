import Link from "next/link";
import { quickActions } from "@/content/home";

export default function QuickActions() {
  return (
    <section className="qactions">
      <div className="qactions-inner">
        {quickActions.map((action) => (
          <Link href={action.href} className="qa-card" key={action.label}>
            <div className="qa-icon">{action.icon}</div>
            <div className="qa-lbl">{action.label}</div>
            <div className="qa-sub">{action.sub}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
