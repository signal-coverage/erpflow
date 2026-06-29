import { ROLE_PERMISSIONS } from "@/core/permissions/permissions";
import type { PermissionKey } from "@/core/permissions/types";

export function checkPermission(
  roleId: string,
  permission: PermissionKey,
  pluginPermissions: string[] = [],
): boolean {
  const corePerms =
    ROLE_PERMISSIONS[roleId as keyof typeof ROLE_PERMISSIONS] ?? [];
  return ([...corePerms, ...pluginPermissions] as string[]).includes(
    permission as string,
  );
}
