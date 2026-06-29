"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { checkPermission } from "@/core/permissions/utils";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
} from "@/core/appointments/schemas/appointment.schema";
import {
  listAppointments as _listAppointments,
  getAppointment as _getAppointment,
  createAppointment as _createAppointment,
  updateAppointment as _updateAppointment,
  cancelAppointment as _cancelAppointment,
  completeAppointment as _completeAppointment,
  noShowAppointment as _noShowAppointment,
} from "@/core/appointments/services/appointments.service";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
} from "@/core/appointments/types";
import type { ActionResult } from "@/core/billing/types";

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
  });
  return profile ?? null;
}

export async function getAppointments(filters?: {
  date?: string;
  professionalId?: string;
  status?: AppointmentStatus;
  patientId?: string;
}): Promise<ActionResult<Appointment[]>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.read")) {
      return { success: false, error: "Forbidden" };
    }

    const parsedFilters: AppointmentFilters = {
      date: filters?.date ? new Date(filters.date) : undefined,
      professionalId: filters?.professionalId,
      status: filters?.status,
      patientId: filters?.patientId,
    };

    const data = await _listAppointments(profile.organizationId, parsedFilters);
    return { success: true, data };
  } catch (error) {
    console.error("getAppointments error:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}

export async function getAppointment(
  id: string,
): Promise<ActionResult<Appointment | null>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _getAppointment(profile.organizationId, id);
    return { success: true, data };
  } catch (error) {
    console.error("getAppointment error:", error);
    return { success: false, error: "Failed to fetch appointment" };
  }
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<ActionResult<Appointment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.create")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = createAppointmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    const data = await _createAppointment(
      profile.organizationId,
      profile.id,
      parsed.data,
    );
    return { success: true, data };
  } catch (error) {
    console.error("createAppointment error:", error);
    return { success: false, error: "Failed to create appointment" };
  }
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput,
): Promise<ActionResult<Appointment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.update")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = updateAppointmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    const data = await _updateAppointment(
      profile.organizationId,
      id,
      profile.id,
      parsed.data,
    );
    return { success: true, data };
  } catch (error) {
    console.error("updateAppointment error:", error);
    return { success: false, error: "Failed to update appointment" };
  }
}

export async function cancelAppointment(
  id: string,
): Promise<ActionResult<Appointment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.cancel")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _cancelAppointment(
      profile.organizationId,
      id,
      profile.id,
    );
    return { success: true, data };
  } catch (error) {
    console.error("cancelAppointment error:", error);
    return { success: false, error: "Failed to cancel appointment" };
  }
}

export async function completeAppointment(
  id: string,
): Promise<ActionResult<Appointment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.update")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _completeAppointment(
      profile.organizationId,
      id,
      profile.id,
    );
    return { success: true, data };
  } catch (error) {
    console.error("completeAppointment error:", error);
    return { success: false, error: "Failed to complete appointment" };
  }
}

export async function noShowAppointment(
  id: string,
): Promise<ActionResult<Appointment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "appointments.update")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _noShowAppointment(
      profile.organizationId,
      id,
      profile.id,
    );
    return { success: true, data };
  } catch (error) {
    console.error("noShowAppointment error:", error);
    return { success: false, error: "Failed to mark appointment as no-show" };
  }
}
