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
    <div className="flex items-start gap-4 py-3">
      <div className="w-24 shrink-0 pt-0.5">
        <p className="text-sm font-medium tabular-nums">
          {formatTimeRange(
            appointment.scheduledStart,
            appointment.scheduledEnd,
          )}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{appointment.patientName}</p>
        {appointment.professionalName && (
          <p className="text-xs text-muted-foreground">
            {appointment.professionalName}
          </p>
        )}
        {appointment.reason && (
          <p className="text-xs text-muted-foreground truncate">
            {appointment.reason}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <AppointmentStatusBadge status={appointment.status} />
        {isActive && (
          <div className="flex items-center gap-0.5">
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(appointment.id)}
                aria-label="Edit appointment"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onComplete(appointment.id)}
                aria-label="Mark as complete"
              >
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </Button>
            )}
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onNoShow(appointment.id)}
                aria-label="Mark as no-show"
              >
                <ClockIcon className="h-4 w-4 text-yellow-600" />
              </Button>
            )}
            {canCancel && (
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
        )}
      </div>
    </div>
  );
}
