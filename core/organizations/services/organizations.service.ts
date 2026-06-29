import { prisma } from "@/infrastructure/db/client";
import type { Organization } from "@/core/organizations/types";

function toOrganization(
  row: Awaited<ReturnType<typeof prisma.organization.findUnique>>,
): Organization {
  if (!row) throw new Error("Organization not found");
  return {
    ...row,
    plan: row.plan as Organization["plan"],
    status: row.status as Organization["status"],
  };
}

export async function getOrganization(
  id: string,
): Promise<Organization | null> {
  const row = await prisma.organization.findUnique({ where: { id } });
  return row ? toOrganization(row) : null;
}

export async function createOrganization(
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">,
  createdBy: string,
): Promise<Organization> {
  const row = await prisma.organization.create({
    data: { ...data, createdBy, updatedBy: createdBy },
  });
  return toOrganization(row);
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<Organization, "id" | "createdAt" | "createdBy">>,
  updatedBy: string,
): Promise<void> {
  await prisma.organization.update({
    where: { id },
    data: { ...data, updatedBy },
  });
}
