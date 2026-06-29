"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/actions/users";
import { UserTable } from "../UserTable";
import type { SystemRole, UserStatus } from "@/core/users/types";
import type { UsersPageProps } from "./types";

export function UsersPage({ users, currentUserId, canEdit }: UsersPageProps) {
  const router = useRouter();

  async function handleRoleChange(uid: string, roleId: SystemRole) {
    const result = await updateUserProfile(uid, { roleId });
    if (result.success) {
      toast.success("Role updated");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update role");
    }
  }

  async function handleStatusToggle(uid: string, status: UserStatus) {
    const result = await updateUserProfile(uid, {
      status: status as "ACTIVE" | "INACTIVE",
    });
    if (result.success) {
      toast.success("Status updated");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update status");
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <UserTable
        users={users}
        currentUserId={currentUserId}
        canEdit={canEdit}
        onRoleChange={handleRoleChange}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}
