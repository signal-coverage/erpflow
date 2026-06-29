import type { Patient } from "@/core/patients/types";

export interface PatientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  onSuccess: () => void;
}

export type FormValues = {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  notes: string;
};
