import type { Professional, WorkingHours } from "@/core/professionals/types";
import type { ProfessionalFormValues } from "./types";

export function getInitialValues(
  professional?: Professional,
  workingHours?: WorkingHours[],
): ProfessionalFormValues {
  return {
    displayName: professional?.displayName ?? "",
    specialtiesRaw: professional?.specialties.join(", ") ?? "",
    license: professional?.license ?? "",
    phone: professional?.phone ?? "",
    email: professional?.email ?? "",
    calendarColor: professional?.calendarColor ?? "",
    workingHours:
      workingHours?.map((wh) => ({
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
      })) ?? [],
  };
}

export function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
