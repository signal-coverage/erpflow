"use client";

import { useEffect, useState, useCallback } from "react";
import { listNotifications } from "@/app/actions/notifications";
import type {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@/core/notifications/types";
import type { NotificationsPageProps, NotificationFiltersState } from "./types";
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_STATUS_LABELS,
  NOTIFICATION_STATUS_COLORS,
  PAGE_SIZE,
} from "./consts";

export function NotificationsPage({
  initialNotifications,
  initialTotal,
}: NotificationsPageProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<NotificationFiltersState>({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const load = useCallback(async (f: NotificationFiltersState) => {
    setLoading(true);
    setError(null);
    const result = await listNotifications(
      {
        type: f.type,
        status: f.status,
        dateFrom: f.dateFrom,
        dateTo: f.dateTo,
      },
      f.page,
      f.pageSize,
    );
    if (result.success) {
      setNotifications(result.data.notifications);
      setTotal(result.data.total);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Skip first render since we have initialNotifications
    if (filters.page === 1 && !filters.type && !filters.status) return;
    load(filters);
  }, [filters, load]);

  const totalPages = Math.ceil(total / filters.pageSize);

  function handleTypeChange(type: NotificationType | "") {
    setFilters((f) => ({ ...f, type: type || undefined, page: 1 }));
  }

  function handleStatusChange(status: NotificationStatus | "") {
    setFilters((f) => ({ ...f, status: status || undefined, page: 1 }));
  }

  function handlePageChange(page: number) {
    setFilters((f) => ({ ...f, page }));
    load({ ...filters, page });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Notification Log</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Read-only log of all outgoing notifications.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.type ?? ""}
          onChange={(e) =>
            handleTypeChange(e.target.value as NotificationType | "")
          }
        >
          <option value="">All types</option>
          {(Object.keys(NOTIFICATION_TYPE_LABELS) as NotificationType[]).map(
            (t) => (
              <option key={t} value={t}>
                {NOTIFICATION_TYPE_LABELS[t]}
              </option>
            ),
          )}
        </select>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.status ?? ""}
          onChange={(e) =>
            handleStatusChange(e.target.value as NotificationStatus | "")
          }
        >
          <option value="">All statuses</option>
          {(
            Object.keys(NOTIFICATION_STATUS_LABELS) as NotificationStatus[]
          ).map((s) => (
            <option key={s} value={s}>
              {NOTIFICATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600">Failed to load notifications.</p>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Recipient</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Sent At</th>
              <th className="text-left px-4 py-3 font-medium">
                Failure Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : notifications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No notifications found.
                </td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-3">
                    {NOTIFICATION_TYPE_LABELS[n.type] ?? n.type}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {n.recipientEmail}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${NOTIFICATION_STATUS_COLORS[n.status]}`}
                  >
                    {NOTIFICATION_STATUS_LABELS[n.status]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {n.sentAt ? new Date(n.sentAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {n.failureReason ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {total} notifications — page {filters.page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={filters.page >= totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
