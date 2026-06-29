"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleBadge } from "../UserRoleBadge";
import type { UserProfile, SystemRole, UserStatus } from "@/core/users/types";

const STATUS_VARIANT: Record<UserStatus, "default" | "secondary" | "outline"> =
  {
    ACTIVE: "default",
    INACTIVE: "secondary",
    PENDING: "outline",
  };

interface UserTableProps {
  users: UserProfile[];
  currentUserId: string;
  canEdit: boolean;
  onRoleChange: (uid: string, roleId: SystemRole) => Promise<void>;
  onStatusToggle: (uid: string, status: UserStatus) => Promise<void>;
}

export function UserTable({
  users,
  currentUserId,
  canEdit,
  onRoleChange,
  onStatusToggle,
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          {canEdit && <TableHead className="w-[80px]">Active</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          const isPending = user.status === "PENDING";

          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.displayName}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                {canEdit && !isSelf ? (
                  <Select
                    value={user.roleId}
                    onValueChange={(v) =>
                      onRoleChange(user.id, v as SystemRole)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <UserRoleBadge role={user.roleId} />
                )}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[user.status] ?? "secondary"}>
                  {user.status}
                </Badge>
              </TableCell>
              {canEdit && (
                <TableCell>
                  <Switch
                    checked={user.status === "ACTIVE"}
                    disabled={isSelf || isPending}
                    onCheckedChange={(checked) =>
                      onStatusToggle(user.id, checked ? "ACTIVE" : "INACTIVE")
                    }
                  />
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
