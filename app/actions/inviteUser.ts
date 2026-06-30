"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { checkPermission } from "@/core/permissions/utils";
import type { SystemRole } from "@/core/users/types";
import type { ActionResult } from "@/core/billing/types";

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
  });
  return profile ?? null;
}

export async function inviteUser(
  email: string,
  roleId: SystemRole,
): Promise<ActionResult<void>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };

    if (!checkPermission(profile.roleId, "users.invite")) {
      return { success: false, error: "Forbidden" };
    }

    const existing = await prisma.userProfile.findFirst({
      where: {
        email,
        organizationId: profile.organizationId,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "This user is already a member of your organization",
      };
    }

    const client = await clerkClient();
    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: "/signup",
      publicMetadata: {
        organizationId: profile.organizationId,
        roleId,
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("inviteUser error:", error);
    return { success: false, error: "Failed to send invitation" };
  }
}
