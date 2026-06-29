import type { SystemRole } from "@/core/users/types";

export type PermissionKey =
  | "patients.read"
  | "patients.create"
  | "patients.update"
  | "patients.delete"
  | "professionals.read"
  | "professionals.create"
  | "professionals.update"
  | "professionals.delete"
  | "appointments.read"
  | "appointments.create"
  | "appointments.update"
  | "appointments.cancel"
  | "billing.read"
  | "billing.create"
  | "billing.update"
  | "users.read"
  | "users.invite"
  | "users.update"
  | "users.delete"
  | "organization.read"
  | "organization.update"
  | "settings.manage";

export interface RolePermissions {
  roleId: SystemRole;
  permissions: PermissionKey[];
}
