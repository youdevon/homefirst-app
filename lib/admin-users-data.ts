import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import {
  ADMIN_ROLE,
  ADMIN_USER_ROLES,
  isValidAdminUserRole,
  type AdminUserRole,
} from "@/lib/auth/roles";

export type EditableAdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserFormInput = {
  name: string;
  email: string;
  role: AdminUserRole;
  active: boolean;
  password: string;
};

function mapDbAdminUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): EditableAdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: isValidAdminUserRole(user.role) ? user.role : ADMIN_ROLE,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getAllAdminUsersForAdmin(): Promise<EditableAdminUser[]> {
  const rows = await prisma.adminUser.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });

  return rows.map(mapDbAdminUser);
}

export async function getAdminUserById(id: string): Promise<EditableAdminUser | null> {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  return user ? mapDbAdminUser(user) : null;
}

export async function getAdminUserByEmail(
  email: string,
): Promise<EditableAdminUser | null> {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  return user ? mapDbAdminUser(user) : null;
}

async function countOtherActiveAdmins(excludeUserId?: string): Promise<number> {
  return prisma.adminUser.count({
    where: {
      role: ADMIN_ROLE,
      active: true,
      ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
    },
  });
}

export async function canChangeAdminUserAccess(
  userId: string,
  nextRole: AdminUserRole,
  nextActive: boolean,
): Promise<boolean> {
  const user = await getAdminUserById(userId);

  if (!user) {
    return false;
  }

  const isCurrentlyActiveAdmin = user.role === ADMIN_ROLE && user.active;
  const willRemainActiveAdmin = nextRole === ADMIN_ROLE && nextActive;

  if (isCurrentlyActiveAdmin && !willRemainActiveAdmin) {
    const otherActiveAdmins = await countOtherActiveAdmins(userId);
    return otherActiveAdmins > 0;
  }

  return true;
}

export function parseAdminUserFormData(formData: FormData): AdminUserFormInput {
  const roleValue = String(formData.get("role") ?? ADMIN_ROLE).trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    role: isValidAdminUserRole(roleValue) ? roleValue : ADMIN_ROLE,
    active: String(formData.get("active") ?? "true") === "true",
    password: String(formData.get("password") ?? ""),
  };
}

export function isValidAdminUserCreateInput(input: AdminUserFormInput): boolean {
  return (
    Boolean(input.name) &&
    Boolean(input.email) &&
    input.email.includes("@") &&
    ADMIN_USER_ROLES.includes(input.role) &&
    input.password.length >= 8
  );
}

export function isValidAdminUserUpdateInput(
  input: AdminUserFormInput,
  requirePassword: boolean,
): boolean {
  const passwordValid = requirePassword ? input.password.length >= 8 : true;

  return (
    Boolean(input.name) &&
    Boolean(input.email) &&
    input.email.includes("@") &&
    ADMIN_USER_ROLES.includes(input.role) &&
    passwordValid
  );
}

export async function createAdminUser(input: AdminUserFormInput): Promise<EditableAdminUser> {
  const passwordHash = await hashPassword(input.password);

  const created = await prisma.adminUser.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      active: input.active,
      passwordHash,
    },
  });

  return mapDbAdminUser(created);
}

export async function updateAdminUser(
  id: string,
  input: AdminUserFormInput,
): Promise<EditableAdminUser> {
  const passwordHash =
    input.password.trim().length > 0
      ? await hashPassword(input.password)
      : undefined;

  const updated = await prisma.adminUser.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      active: input.active,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  return mapDbAdminUser(updated);
}

export function formatAdminUserDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
