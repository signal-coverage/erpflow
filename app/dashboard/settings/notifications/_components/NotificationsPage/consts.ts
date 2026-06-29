import type {
  NotificationType,
  NotificationStatus,
} from "@/core/notifications/types";

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  APPOINTMENT_REMINDER: "Appointment Reminder",
  APPOINTMENT_CANCELLED: "Appointment Cancelled",
  INVOICE_PAID: "Invoice Paid",
  PATIENT_BIRTHDAY: "Patient Birthday",
};

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
};

export const NOTIFICATION_STATUS_COLORS: Record<NotificationStatus, string> = {
  PENDING: "text-yellow-600",
  SENT: "text-green-600",
  FAILED: "text-red-600",
};

export const PAGE_SIZE = 20;
