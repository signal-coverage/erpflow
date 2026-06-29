"use client";

import { useEffect, useState } from "react";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { listNotifications } from "@/app/actions/notifications";
import { NotificationsPage } from "./_components/NotificationsPage";
import type { Notification } from "@/core/notifications/types";

export default function NotificationsSettingsPage() {
  const { hasPermission } = usePermission();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listNotifications({}, 1, 20).then((result) => {
      if (result.success) {
        setNotifications(result.data.notifications);
        setTotal(result.data.total);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
  }, []);

  if (!hasPermission("notifications.read")) {
    return (
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
    );
  }

  if (loading) return null;

  if (error) {
    return (
      <p className="text-muted-foreground">Failed to load notifications.</p>
    );
  }

  return (
    <NotificationsPage
      initialNotifications={notifications}
      initialTotal={total}
    />
  );
}
