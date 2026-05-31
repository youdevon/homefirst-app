export const LEADER_PERSON_TYPES = ["LEADER", "BOARD"] as const;

export type LeaderPersonType = (typeof LEADER_PERSON_TYPES)[number];

export const LEADER_PERSON_TYPE_LABELS: Record<LeaderPersonType, string> = {
  LEADER: "Leadership Team",
  BOARD: "Board of Directors",
};

export const LEADER_PERSON_TYPE_ADMIN_LABELS: Record<LeaderPersonType, string> = {
  LEADER: "Leader",
  BOARD: "Board Member",
};

export function parseLeaderPersonType(value: unknown): LeaderPersonType {
  return value === "BOARD" ? "BOARD" : "LEADER";
}

export function getLeaderPersonTypeAuditLabel(type: LeaderPersonType): string {
  return type === "BOARD" ? "board member" : "leader profile";
}
