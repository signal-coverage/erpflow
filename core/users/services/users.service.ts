import { prisma } from "@/infrastructure/db/client";
import type { UserProfile } from "@/core/users/types";

function toUserProfile(
  row: Awaited<ReturnType<typeof prisma.userProfile.findUnique>>,
): UserProfile {
  if (!row) throw new Error("UserProfile not found");
  return {
    ...row,
    roleId: row.roleId as UserProfile["roleId"],
    status: row.status as UserProfile["status"],
    lastLogin: row.lastLogin ?? undefined,
    photoURL: row.photoURL ?? undefined,
    phone: row.phone ?? undefined,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const row = await prisma.userProfile.findUnique({ where: { id: uid } });
  return row ? toUserProfile(row) : null;
}

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
): Promise<UserProfile> {
  const row = await prisma.userProfile.create({
    data: { id: uid, ...data },
  });
  return toUserProfile(row);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<
    Omit<UserProfile, "id" | "organizationId" | "createdAt" | "createdBy">
  >,
  updatedBy: string,
): Promise<void> {
  await prisma.userProfile.update({
    where: { id: uid },
    data: { ...data, updatedBy },
  });
}

export async function listUsersByOrg(orgId: string): Promise<UserProfile[]> {
  const rows = await prisma.userProfile.findMany({
    where: { organizationId: orgId },
    orderBy: { displayName: "asc" },
  });
  return rows.map(toUserProfile);
}
