"use client";

import { AppointmentCard } from "@/app/dashboard/appointments/_components/AppointmentCard";
import type { AppointmentListProps } from "./types";

export function AppointmentList({
  appointments,
  isLoading,
  onEdit,
  onCancel,
  onComplete,
  onNoShow,
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
        No appointments for this date.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onCancel={onCancel}
          onComplete={onComplete}
          onNoShow={onNoShow}
        />
      ))}
    </div>
  );
}
