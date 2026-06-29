import { Badge } from "@/components/ui/badge";
import type { PatientStatus } from "@/core/patients/types";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "./consts";

interface PatientStatusBadgeProps {
  status: PatientStatus;
}

export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  return (
    <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
  );
}
