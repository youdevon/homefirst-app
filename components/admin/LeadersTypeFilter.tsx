import Link from "next/link";
import {
  LEADER_PERSON_TYPE_LABELS,
  type LeaderPersonType,
  parseLeaderPersonType,
} from "@/lib/leader-person-type";

type LeadersTypeFilterProps = {
  activeType: LeaderPersonType | "ALL";
};

const FILTER_OPTIONS: Array<{
  id: LeaderPersonType | "ALL";
  label: string;
  href: string;
}> = [
  { id: "ALL", label: "All people", href: "/admin/leaders" },
  {
    id: "LEADER",
    label: LEADER_PERSON_TYPE_LABELS.LEADER,
    href: "/admin/leaders?type=LEADER",
  },
  {
    id: "BOARD",
    label: LEADER_PERSON_TYPE_LABELS.BOARD,
    href: "/admin/leaders?type=BOARD",
  },
];

export default function LeadersTypeFilter({ activeType }: LeadersTypeFilterProps) {
  return (
    <div className="admin-filter-tabs" role="tablist" aria-label="Filter by person type">
      {FILTER_OPTIONS.map((option) => (
        <Link
          key={option.id}
          href={option.href}
          className={`admin-filter-tab${activeType === option.id ? " admin-filter-tab-active" : ""}`}
          role="tab"
          aria-selected={activeType === option.id}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export function parseLeadersPageType(
  value: string | undefined,
): LeaderPersonType | "ALL" {
  if (value === "BOARD" || value === "LEADER") {
    return parseLeaderPersonType(value);
  }

  return "ALL";
}

export function getNewPersonHref(type: LeaderPersonType | "ALL"): string {
  if (type === "BOARD") {
    return "/admin/leaders/new?type=BOARD";
  }

  if (type === "LEADER") {
    return "/admin/leaders/new?type=LEADER";
  }

  return "/admin/leaders/new";
}
