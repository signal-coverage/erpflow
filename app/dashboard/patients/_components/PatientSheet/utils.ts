import type { PatientSheetProps } from "./types";
import type { FormValues } from "./types";

export function getInitialValues(patient?: PatientSheetProps["patient"]): FormValues {
  if (!patient) {
    return {
      firstName: "",
      lastName: "",
      documentType: "",
      documentNumber: "",
      gender: "",
      birthDate: "",
      phone: "",
      email: "",
      notes: "",
    };
  }
  return {
    firstName: patient.firstName,
    lastName: patient.lastName,
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    gender: patient.gender ?? "",
    birthDate: patient.birthDate
      ? patient.birthDate.toISOString().split("T")[0]
      : "",
    phone: patient.phone ?? "",
    email: patient.email ?? "",
    notes: patient.notes ?? "",
  };
}
