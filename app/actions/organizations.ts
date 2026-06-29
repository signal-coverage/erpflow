"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { checkPermission } from "@/core/permissions/utils";
import {
  getOrganization as _getOrganization,
  createOrganization as _createOrganization,
  updateOrganization as _updateOrganization,
} from "@/core/organizations/services/organizations.service";
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@/core/organizations/schemas/organization.schema";
import type { Organization } from "@/core/organizations/types";
import type { ActionResult } from "@/core/billing/types";

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
  });
  return profile ?? null;
}

export async function getOrganization(
  id: string,
): Promise<ActionResult<Organization | null>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "organization.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _getOrganization(id);
    return { success: true, data };
  } catch (error) {
    console.error("getOrganization error:", error);
    return { success: false, error: "Failed to fetch organization" };
  }
}

export async function createOrganization(
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">,
  createdBy: string,
): Promise<ActionResult<Organization>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
    const result = await _createOrganization(data, createdBy);
    return { success: true, data: result };
  } catch (error) {
    console.error("createOrganization error:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<Organization, "id" | "createdAt" | "createdBy">>,
  updatedBy: string,
): Promise<ActionResult<void>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "organization.update")) {
      return { success: false, error: "Forbidden" };
    }
    await _updateOrganization(id, data, updatedBy);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("updateOrganization error:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function updateOrganizationSettings(
  input: UpdateOrganizationInput,
): Promise<ActionResult<void>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "organization.update")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = updateOrganizationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    await _updateOrganization(profile.organizationId, parsed.data, profile.id);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("updateOrganizationSettings error:", error);
    return { success: false, error: "Failed to update organization settings" };
  }
}
