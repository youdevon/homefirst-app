import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { getClientIpAddress, getClientUserAgent } from "@/lib/client-ip";
import { prisma } from "@/lib/prisma";
import type { AdminSession } from "@/lib/auth/session";
import { formatAdminRole } from "@/lib/auth/roles";

export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: "Login Success",
  LOGIN_FAILED: "Login Failed",
  LOGOUT: "Logout",
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_ACTIVATED: "User Activated",
  USER_DEACTIVATED: "User Deactivated",
  PASSWORD_RESET: "Password Reset",
  SITE_SETTINGS_SAVED: "Site Settings Saved",
  HOMEPAGE_SAVED: "Homepage Saved",
  ABOUT_SAVED: "About Page Saved",
  CONTACT_SAVED: "Contact Page Saved",
  LEADER_CREATED: "Leader Created",
  LEADER_UPDATED: "Leader Updated",
  LEADER_ACTIVATED: "Leader Activated",
  LEADER_DEACTIVATED: "Leader Deactivated",
  SCHEME_CREATED: "Scheme Created",
  SCHEME_UPDATED: "Scheme Updated",
  SCHEME_ACTIVATED: "Scheme Activated",
  SCHEME_DEACTIVATED: "Scheme Deactivated",
  NEWS_CREATED: "News Created",
  NEWS_UPDATED: "News Updated",
  NEWS_PUBLISHED: "News Published",
  NEWS_UNPUBLISHED: "News Unpublished",
  MEDIA_UPLOADED: "Media Uploaded",
  MEDIA_DELETED: "Media Deleted",
  HOMEPAGE_VIDEO_SECTION_SAVED: "Video Section Saved",
  HOMEPAGE_VIDEO_CREATED: "Homepage Video Created",
  HOMEPAGE_VIDEO_UPDATED: "Homepage Video Updated",
  HOMEPAGE_VIDEO_ACTIVATED: "Homepage Video Activated",
  HOMEPAGE_VIDEO_DEACTIVATED: "Homepage Video Deactivated",
  HOMEPAGE_VIDEO_FEATURED: "Homepage Video Featured",
  SCHEMES_PAGE_SAVED: "Schemes Page Saved",
  MEDIA_PAGE_SAVED: "Media Page Saved",
  ELIGIBILITY_PAGE_SAVED: "Eligibility Page Saved",
} as const;

export const AUDIT_ENTITY_TYPES = {
  SESSION: "Session",
  USER: "User",
  SITE_SETTINGS: "Site Settings",
  HOMEPAGE: "Homepage",
  ABOUT_PAGE: "About Page",
  CONTACT_PAGE: "Contact Page",
  LEADER: "Leader",
  SCHEME: "Scheme",
  NEWS: "News",
  MEDIA: "Media",
  HOMEPAGE_VIDEO: "Homepage Video",
  SCHEMES_PAGE: "Schemes Page",
  MEDIA_PAGE: "Media Page",
  ELIGIBILITY_PAGE: "Eligibility Page",
} as const;

type AuditActorInput =
  | AdminSession
  | {
      name: string;
      email: string;
      role: string;
    }
  | null
  | undefined;

export type LogAuditEventInput = {
  actor?: AuditActorInput;
  request?: NextRequest | null;
  action: string;
  entityType: string;
  entityName: string;
  description: string;
  metadata?: Record<string, unknown>;
};

export type AuditLogRecord = {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityName: string;
  description: string;
  ipAddress: string;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

export type AuditLogFilters = {
  from?: string;
  to?: string;
  actor?: string;
  role?: string;
  action?: string;
  entityType?: string;
  search?: string;
};

function resolveActor(actor?: AuditActorInput) {
  if (!actor) {
    return {
      actorName: "Unknown",
      actorEmail: "unknown",
      actorRole: "Unknown",
    };
  }

  return {
    actorName: actor.name.trim() || "Unknown",
    actorEmail: actor.email.trim().toLowerCase() || "unknown",
    actorRole: formatAdminRole(actor.role),
  };
}

function asMetadata(value: Prisma.JsonValue | null): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function mapAuditLog(row: {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityName: string;
  description: string;
  ipAddress: string;
  userAgent: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
}): AuditLogRecord {
  return {
    id: row.id,
    actorName: row.actorName,
    actorEmail: row.actorEmail,
    actorRole: row.actorRole,
    action: row.action,
    entityType: row.entityType,
    entityName: row.entityName,
    description: row.description,
    ipAddress: row.ipAddress,
    userAgent: row.userAgent,
    metadata: asMetadata(row.metadata),
    createdAt: row.createdAt,
  };
}

export async function logAuditEvent(input: LogAuditEventInput): Promise<void> {
  const actor = resolveActor(input.actor);

  try {
    await prisma.auditLog.create({
      data: {
        actorName: actor.actorName,
        actorEmail: actor.actorEmail,
        actorRole: actor.actorRole,
        action: input.action,
        entityType: input.entityType,
        entityName: input.entityName,
        description: input.description,
        ipAddress: getClientIpAddress(input.request),
        userAgent: getClientUserAgent(input.request),
        metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

function parseDateBoundary(value: string | undefined, endOfDay = false): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (endOfDay) {
    parsed.setHours(23, 59, 59, 999);
  }

  return parsed;
}

export async function getAuditLogs(
  filters: AuditLogFilters = {},
): Promise<AuditLogRecord[]> {
  const where: Prisma.AuditLogWhereInput = {};
  const fromDate = parseDateBoundary(filters.from);
  const toDate = parseDateBoundary(filters.to, true);

  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {}),
    };
  }

  if (filters.actor?.trim()) {
    const actor = filters.actor.trim();
    where.OR = [
      { actorName: { contains: actor, mode: "insensitive" } },
      { actorEmail: { contains: actor, mode: "insensitive" } },
    ];
  }

  if (filters.role?.trim()) {
    where.actorRole = filters.role.trim();
  }

  if (filters.action?.trim()) {
    where.action = filters.action.trim();
  }

  if (filters.entityType?.trim()) {
    where.entityType = filters.entityType.trim();
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { entityName: { contains: search, mode: "insensitive" } },
          { actorName: { contains: search, mode: "insensitive" } },
          { actorEmail: { contains: search, mode: "insensitive" } },
        ],
      },
    ];
  }

  const rows = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return rows.map(mapAuditLog);
}

export async function getAuditLogById(id: string): Promise<AuditLogRecord | null> {
  const row = await prisma.auditLog.findUnique({ where: { id } });
  return row ? mapAuditLog(row) : null;
}

export async function getDistinctAuditFilterValues(): Promise<{
  actions: string[];
  entityTypes: string[];
  roles: string[];
}> {
  const [actions, entityTypes, roles] = await Promise.all([
    prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),
    prisma.auditLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
      orderBy: { entityType: "asc" },
    }),
    prisma.auditLog.findMany({
      distinct: ["actorRole"],
      select: { actorRole: true },
      orderBy: { actorRole: "asc" },
    }),
  ]);

  return {
    actions: actions.map((row) => row.action),
    entityTypes: entityTypes.map((row) => row.entityType),
    roles: roles.map((row) => row.actorRole),
  };
}

export function formatAuditDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatMetadataForDisplay(
  metadata: Record<string, unknown> | null,
): Array<{ label: string; value: string }> {
  if (!metadata) {
    return [];
  }

  return Object.entries(metadata).map(([key, value]) => ({
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase()),
    value:
      typeof value === "string" || typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value, null, 2),
  }));
}
