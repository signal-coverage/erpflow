"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { ROLE_PERMISSIONS } from "@/core/permissions/permissions";
import type { PermissionKey } from "@/core/permissions/types";
import {
  createPatientSchema,
  updatePatientSchema,
  type CreatePatientInput,
  type UpdatePatientInput,
} from "@/core/patients/schemas/patient.schema";
import {
  listPatients as _listPatients,
  getPatient as _getPatient,
  createPatient as _createPatient,
  updatePatient as _updatePatient,
  deletePatient as _deletePatient,
} from "@/core/patients/services/patients.service";
import { syncPatientNameOnAppointments } from "@/core/appointments/services/appointments.service";
import type { PatientFilters, PaginatedPatients, Patient } from "@/core/patients/types";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({ where: { id: userId } });
  return profile ?? null;
}

function checkPermission(
  roleId: string,
  permission: PermissionKey,
): boolean {
  const perms = ROLE_PERMISSIONS[roleId as keyof typeof ROLE_PERMISSIONS];
  if (!perms) return false;
  return perms.includes(permission);
}

export async function getPatients(
  filters?: PatientFilters,
): Promise<ActionResult<PaginatedPatients>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "patients.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _listPatients(profile.organizationId, filters ?? {});
    return { success: true, data };
  } catch (error) {
    console.error("getPatients error:", error);
    return { success: false, error: "Failed to fetch patients" };
  }
}

export async function getPatient(
  id: string,
): Promise<ActionResult<Patient | null>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "patients.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _getPatient(profile.organizationId, id);
    return { success: true, data };
  } catch (error) {
    console.error("getPatient error:", error);
    return { success: false, error: "Failed to fetch patient" };
  }
}

export async function createPatient(
  input: CreatePatientInput,
): Promise<ActionResult<Patient>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "patients.create")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = createPatientSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
    }
    const data = await _createPatient(profile.organizationId, parsed.data, profile.id);
    return { success: true, data };
  } catch (error) {
    console.error("createPatient error:", error);
    return { success: false, error: "Failed to create patient" };
  }
}

export async function updatePatient(
  id: string,
  input: UpdatePatientInput,
): Promise<ActionResult<Patient>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "patients.update")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = updatePatientSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
    }
    const data = await _updatePatient(profile.organizationId, id, parsed.data, profile.id);
    if (parsed.data.firstName !== undefined || parsed.data.lastName !== undefined) {
      const newName = `${data.firstName} ${data.lastName}`.trim();
      await syncPatientNameOnAppointments(profile.organizationId, id, newName);
    }
    return { success: true, data };
  } catch (error) {
    console.error("updatePatient error:", error);
    return { success: false, error: "Failed to update patient" };
  }
}

export async function deletePatient(
  id: string,
): Promise<ActionResult<void>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "patients.delete")) {
      return { success: false, error: "Forbidden" };
    }
    await _deletePatient(profile.organizationId, id, profile.id);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("deletePatient error:", error);
    return { success: false, error: "Failed to delete patient" };
  }
}
