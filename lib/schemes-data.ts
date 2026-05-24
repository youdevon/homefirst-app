import { schemes as contentSchemes } from "@/content/schemes";
import { prisma } from "@/lib/prisma";

export type PublicScheme = {
  title: string;
  description: string;
  image: string;
  label: string;
  meta: string;
  href: string;
  open: boolean;
};

export type EditableScheme = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statusLabel: string;
  meta: string;
  displayOrder: number;
  active: boolean;
};

export type SchemeFormInput = {
  name: string;
  description: string;
  imageUrl: string;
  statusLabel: string;
  meta: string;
  displayOrder: number;
  active: boolean;
};

function isOpenStatusLabel(statusLabel: string): boolean {
  return /\b(open|registering)\b/i.test(statusLabel);
}

function mapDbScheme(scheme: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statusLabel: string;
  meta: string;
  displayOrder: number;
  active: boolean;
}): EditableScheme {
  return {
    id: scheme.id,
    name: scheme.name,
    description: scheme.description,
    imageUrl: scheme.imageUrl,
    statusLabel: scheme.statusLabel,
    meta: scheme.meta,
    displayOrder: scheme.displayOrder,
    active: scheme.active,
  };
}

function mapPublicScheme(scheme: EditableScheme): PublicScheme {
  return {
    title: scheme.name,
    description: scheme.description,
    image: scheme.imageUrl,
    label: scheme.statusLabel,
    meta: scheme.meta,
    href: "/schemes",
    open: isOpenStatusLabel(scheme.statusLabel),
  };
}

function getContentFallbackSchemes(): PublicScheme[] {
  return contentSchemes.map((scheme) => ({
    title: scheme.title,
    description: scheme.description,
    image: scheme.image,
    label: scheme.label,
    meta: scheme.meta,
    href: scheme.href,
    open: scheme.open,
  }));
}

export async function getAllSchemesForAdmin(): Promise<EditableScheme[]> {
  const rows = await prisma.scheme.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

  return rows.map(mapDbScheme);
}

export async function getSchemeById(id: string): Promise<EditableScheme | null> {
  const scheme = await prisma.scheme.findUnique({ where: { id } });
  return scheme ? mapDbScheme(scheme) : null;
}

export async function getPublicSchemes(): Promise<PublicScheme[]> {
  try {
    const rows = await prisma.scheme.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length === 0) {
      return getContentFallbackSchemes();
    }

    return rows.map((scheme) => mapPublicScheme(mapDbScheme(scheme)));
  } catch {
    return getContentFallbackSchemes();
  }
}

export function parseSchemeFormData(formData: FormData): SchemeFormInput {
  const displayOrder = Number.parseInt(
    String(formData.get("displayOrder") ?? "0"),
    10,
  );

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    statusLabel: String(formData.get("statusLabel") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    displayOrder: Number.isNaN(displayOrder) ? 0 : displayOrder,
    active: String(formData.get("active") ?? "true") === "true",
  };
}

export function isValidSchemeInput(input: SchemeFormInput): boolean {
  return (
    Boolean(input.name) &&
    Boolean(input.description) &&
    Boolean(input.imageUrl) &&
    Boolean(input.statusLabel) &&
    Boolean(input.meta) &&
    input.displayOrder >= 0
  );
}

export async function createScheme(input: SchemeFormInput): Promise<void> {
  await prisma.scheme.create({
    data: {
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      statusLabel: input.statusLabel,
      meta: input.meta,
      displayOrder: input.displayOrder,
      active: input.active,
    },
  });
}

export async function updateScheme(
  id: string,
  input: SchemeFormInput,
): Promise<void> {
  await prisma.scheme.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      statusLabel: input.statusLabel,
      meta: input.meta,
      displayOrder: input.displayOrder,
      active: input.active,
    },
  });
}

export async function setSchemeActive(id: string, active: boolean): Promise<void> {
  await prisma.scheme.update({
    where: { id },
    data: { active },
  });
}
