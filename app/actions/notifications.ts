"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { checkPermission } from "@/core/permissions/utils";
import { listNotifications as _listNotifications } from "@/core/notifications/services/notifications.service";
import type {
  NotificationFilters,
  PaginatedNotifications,
} from "@/core/notifications/services/notifications.service";
import type { ActionResult } from "@/core/billing/types";

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
  });
  return profile ?? null;
}

export async function listNotifications(
  filters?: NotificationFilters,
  page?: number,
  pageSize?: number,
): Promise<ActionResult<PaginatedNotifications>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "notifications.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _listNotifications(
      profile.organizationId,
      filters ?? {},
      page ?? 1,
      pageSize ?? 20,
    );
    return { success: true, data };
  } catch (error) {
    console.error("listNotifications error:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}
