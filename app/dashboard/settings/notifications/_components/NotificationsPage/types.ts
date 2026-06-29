import type {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@/core/notifications/types";

export interface NotificationsPageProps {
  initialNotifications: Notification[];
  initialTotal: number;
}

export interface NotificationFiltersState {
  type?: NotificationType;
  status?: NotificationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  pageSize: number;
}
