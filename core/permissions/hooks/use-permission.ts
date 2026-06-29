"use client";

import { useCallback } from "react";
import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { usePlugins } from "@/providers/plugin-provider";
import { checkPermission } from "@/core/permissions/utils";
import type { PermissionKey } from "@/core/permissions/types";

export function usePermission() {
  const { userProfile, loading } = useOrganization();
  const { pluginPermissions } = usePlugins();

  const hasPermission = useCallback(
    (permission: PermissionKey): boolean => {
      if (loading || !userProfile) return false;
      return checkPermission(userProfile.roleId, permission, pluginPermissions);
    },
    [userProfile, loading, pluginPermissions],
  );

  return { hasPermission };
}
