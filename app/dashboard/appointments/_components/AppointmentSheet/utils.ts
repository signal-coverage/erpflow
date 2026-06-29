import { format } from "date-fns";
import type { Appointment } from "@/core/appointments/types";
import type { AppointmentFormValues } from "./types";

export function getInitialValues(
  appointment?: Appointment,
  defaultDate?: Date,
): AppointmentFormValues {
  if (appointment) {
    return {
      patientId: appointment.patientId,
      professionalId: appointment.professionalId ?? "",
      scheduledStart: format(appointment.scheduledStart, "yyyy-MM-dd'T'HH:mm"),
      scheduledEnd: format(appointment.scheduledEnd, "yyyy-MM-dd'T'HH:mm"),
      reason: appointment.reason ?? "",
      location: appointment.location ?? "",
      notes: appointment.notes ?? "",
    };
  }

  const base = defaultDate ?? new Date();
  const dateStr = format(base, "yyyy-MM-dd");
  return {
    patientId: "",
    professionalId: "",
    scheduledStart: `${dateStr}T09:00`,
    scheduledEnd: `${dateStr}T10:00`,
    reason: "",
    location: "",
    notes: "",
  };
}

export function isPastDateTime(isoString: string): boolean {
  if (!isoString) return false;
  return new Date(isoString) < new Date();
}
