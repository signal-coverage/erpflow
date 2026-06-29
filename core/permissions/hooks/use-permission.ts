"use client";

import { useCallback } from "react";
import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { ROLE_PERMISSIONS } from "@/core/permissions/permissions";
import type { PermissionKey } from "@/core/permissions/types";

export function usePermission() {
  const { userProfile, loading } = useOrganization();

  const hasPermission = useCallback(
    (key: PermissionKey): boolean => {
      if (loading || !userProfile) return false;
      return ROLE_PERMISSIONS[userProfile.roleId].includes(key);
    },
    [userProfile, loading],
  );

  return { hasPermission };
}
