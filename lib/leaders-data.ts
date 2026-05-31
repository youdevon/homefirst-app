import { leaders as contentLeaders } from "@/content/leaders";
import {
  type LeaderPersonType,
  parseLeaderPersonType,
} from "@/lib/leader-person-type";
import { prisma } from "@/lib/prisma";

export type PublicLeader = {
  name: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type EditableLeader = {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  displayOrder: number;
  active: boolean;
  personType: LeaderPersonType;
};

export type LeaderFormInput = {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  displayOrder: number;
  active: boolean;
  personType: LeaderPersonType;
};

function mapDbLeader(leader: {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  displayOrder: number;
  active: boolean;
  personType: string;
}): EditableLeader {
  return {
    id: leader.id,
    name: leader.name,
    title: leader.title,
    bio: leader.bio,
    photoUrl: leader.photoUrl,
    displayOrder: leader.displayOrder,
    active: leader.active,
    personType: parseLeaderPersonType(leader.personType),
  };
}

function mapPublicLeader(leader: EditableLeader): PublicLeader {
  return {
    name: leader.name,
    title: leader.title,
    description: leader.bio,
    image: leader.photoUrl,
    alt: leader.title,
  };
}

function getContentFallbackLeaders(): PublicLeader[] {
  return contentLeaders.map((leader) => ({
    name: leader.name,
    title: leader.title,
    description: leader.description,
    image: leader.image,
    alt: leader.alt,
  }));
}

export async function getAllLeadersForAdmin(
  personType?: LeaderPersonType,
): Promise<EditableLeader[]> {
  const rows = await prisma.leader.findMany({
    where: personType ? { personType } : undefined,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

  return rows.map(mapDbLeader);
}

export async function getLeaderById(id: string): Promise<EditableLeader | null> {
  const leader = await prisma.leader.findUnique({ where: { id } });
  return leader ? mapDbLeader(leader) : null;
}

async function getPublicPeopleByType(
  personType: LeaderPersonType,
): Promise<PublicLeader[]> {
  try {
    const rows = await prisma.leader.findMany({
      where: { active: true, personType },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    if (personType === "LEADER" && rows.length === 0) {
      return getContentFallbackLeaders();
    }

    return rows.map((leader) => mapPublicLeader(mapDbLeader(leader)));
  } catch {
    return personType === "LEADER" ? getContentFallbackLeaders() : [];
  }
}

export async function getPublicLeaders(): Promise<PublicLeader[]> {
  return getPublicPeopleByType("LEADER");
}

export async function getPublicBoardMembers(): Promise<PublicLeader[]> {
  return getPublicPeopleByType("BOARD");
}

export function parseLeaderFormData(formData: FormData): LeaderFormInput {
  const displayOrder = Number.parseInt(
    String(formData.get("displayOrder") ?? "0"),
    10,
  );

  return {
    name: String(formData.get("name") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim(),
    displayOrder: Number.isNaN(displayOrder) ? 0 : displayOrder,
    active: String(formData.get("active") ?? "true") === "true",
    personType: parseLeaderPersonType(formData.get("personType")),
  };
}

export function isValidLeaderInput(input: LeaderFormInput): boolean {
  const bioValid = input.personType === "BOARD" ? true : Boolean(input.bio);

  return (
    Boolean(input.name) &&
    Boolean(input.title) &&
    bioValid &&
    Boolean(input.photoUrl) &&
    input.displayOrder >= 0
  );
}

export async function createLeader(input: LeaderFormInput): Promise<void> {
  await prisma.leader.create({
    data: {
      name: input.name,
      title: input.title,
      bio: input.bio,
      photoUrl: input.photoUrl,
      displayOrder: input.displayOrder,
      active: input.active,
      personType: input.personType,
    },
  });
}

export async function updateLeader(
  id: string,
  input: LeaderFormInput,
): Promise<void> {
  await prisma.leader.update({
    where: { id },
    data: {
      name: input.name,
      title: input.title,
      bio: input.bio,
      photoUrl: input.photoUrl,
      displayOrder: input.displayOrder,
      active: input.active,
      personType: input.personType,
    },
  });
}

export async function setLeaderActive(id: string, active: boolean): Promise<void> {
  await prisma.leader.update({
    where: { id },
    data: { active },
  });
}
