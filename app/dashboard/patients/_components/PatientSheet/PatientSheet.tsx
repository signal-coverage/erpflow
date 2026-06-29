"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPatient,
  updatePatient,
} from "@/app/actions/patients";
import { createPatientSchema, updatePatientSchema } from "@/core/patients/schemas/patient.schema";
import type { PatientSheetProps, FormValues } from "./types";
import { getInitialValues } from "./utils";

export function PatientSheet({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: PatientSheetProps) {
  const isEdit = !!patient;
  const [form, setForm] = useState<FormValues>(() => getInitialValues(patient));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when patient prop changes (open for different patient)
  const handleOpenChange = (value: boolean) => {
    if (value) {
      setForm(getInitialValues(patient));
      setErrors({});
    }
    onOpenChange(value);
  };

  function updateField(field: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      documentType: form.documentType as "DNI" | "PASSPORT" | "CUIL" | "OTHER",
      documentNumber: form.documentNumber,
      gender: form.gender as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | undefined || undefined,
      birthDate: form.birthDate || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      notes: form.notes || undefined,
    };

    const schema = isEdit ? updatePatientSchema : createPatientSchema;
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = isEdit
        ? await updatePatient(patient!.id, parsed.data)
        : await createPatient(parsed.data as Parameters<typeof createPatient>[0]);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEdit ? "Patient updated" : "Patient created");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Patient" : "New Patient"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the patient's information."
              : "Fill in the details to create a new patient."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="documentType">Document type *</Label>
              <Select
                value={form.documentType}
                onValueChange={(v) => updateField("documentType", v)}
              >
                <SelectTrigger id="documentType" aria-invalid={!!errors.documentType}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASSPORT">Passport</SelectItem>
                  <SelectItem value="CUIL">CUIL</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-xs text-destructive">{errors.documentType}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="documentNumber">Document number *</Label>
              <Input
                id="documentNumber"
                value={form.documentNumber}
                onChange={(e) => updateField("documentNumber", e.target.value)}
                aria-invalid={!!errors.documentNumber}
              />
              {errors.documentNumber && (
                <p className="text-xs text-destructive">{errors.documentNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => updateField("gender", v)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="birthDate">Birth date</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
                aria-invalid={!!errors.birthDate}
              />
              {errors.birthDate && (
                <p className="text-xs text-destructive">{errors.birthDate}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              placeholder="Optional notes..."
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create patient"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
