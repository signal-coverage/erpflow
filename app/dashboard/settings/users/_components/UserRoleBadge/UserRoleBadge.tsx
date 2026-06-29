import { Badge } from "@/components/ui/badge";
import type { SystemRole } from "@/core/users/types";

const ROLE_LABEL: Record<SystemRole, string> = {
  admin: "Admin",
  staff: "Staff",
  professional: "Professional",
};

const ROLE_VARIANT: Record<SystemRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  staff: "secondary",
  professional: "outline",
};

interface UserRoleBadgeProps {
  role: SystemRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <Badge variant={ROLE_VARIANT[role] ?? "secondary"}>
      {ROLE_LABEL[role] ?? role}
    </Badge>
  );
}
