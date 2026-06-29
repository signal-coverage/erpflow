import type { PatientStatus } from "@/core/patients/types";

export const STATUS_BADGE_VARIANT: Record<
  PatientStatus,
  "default" | "secondary" | "outline"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  ARCHIVED: "outline",
};

export const STATUS_LABEL: Record<PatientStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
};
