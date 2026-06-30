"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { listOrgUsers } from "@/app/actions/users";
import { UsersPage } from "./_components/UsersPage";
import type { UserProfile } from "@/core/users/types";

export default function UsersSettingsPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listOrgUsers().then((result) => {
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
  }, []);

  if (!hasPermission("users.read")) {
    return (
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
    );
  }

  if (loading) return null;

  if (error) {
    return <p className="text-muted-foreground">Failed to load users.</p>;
  }

  if (users.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  const canEdit = hasPermission("users.update");
  const canInvite = hasPermission("users.invite");

  return (
    <UsersPage
      users={users}
      currentUserId={user?.id ?? ""}
      canEdit={canEdit}
      canInvite={canInvite}
    />
  );
}
