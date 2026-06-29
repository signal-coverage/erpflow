"use client";

import {
  PencilIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge } from "@/app/dashboard/appointments/_components/AppointmentStatusBadge";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { formatTimeRange } from "./utils";
import type { AppointmentCardProps } from "./types";

export function AppointmentCard({
  appointment,
  onEdit,
  onCancel,
  onComplete,
  onNoShow,
}: AppointmentCardProps) {
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("appointments.update");
  const canCancel = hasPermission("appointments.cancel");

  const isActive =
    appointment.status === "SCHEDULED" || appointment.status === "CONFIRMED";

  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4 gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-medium truncate">{appointment.patientName}</p>
        {appointment.professionalName && (
          <p className="text-sm text-muted-foreground">
            {appointment.professionalName}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {formatTimeRange(
            appointment.scheduledStart,
            appointment.scheduledEnd,
          )}
        </p>
        {appointment.reason && (
          <p className="text-xs text-muted-foreground truncate">
            {appointment.reason}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <AppointmentStatusBadge status={appointment.status} />
        <div className="flex items-center gap-1">
          {canUpdate && isActive && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(appointment.id)}
              aria-label="Edit appointment"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          {canUpdate && isActive && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onComplete(appointment.id)}
              aria-label="Mark as complete"
            >
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </Button>
          )}
          {canUpdate && isActive && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onNoShow(appointment.id)}
              aria-label="Mark as no-show"
            >
              <ClockIcon className="h-4 w-4 text-yellow-600" />
            </Button>
          )}
          {canCancel && isActive && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onCancel(appointment.id)}
              aria-label="Cancel appointment"
            >
              <XCircleIcon className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
