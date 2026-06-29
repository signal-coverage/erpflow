"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  createAppointment,
  updateAppointment,
} from "@/app/actions/appointments";
import { getPatients } from "@/app/actions/patients";
import { getProfessionals } from "@/app/actions/professionals";
import type { Patient } from "@/core/patients/types";
import type { Professional } from "@/core/professionals/types";
import { getInitialValues, isPastDateTime } from "./utils";
import type { AppointmentSheetProps, AppointmentFormValues } from "./types";

const appointmentFormSchema = z
  .object({
    patientId: z.string().min(1, "Patient is required"),
    professionalId: z.string(),
    scheduledStart: z.string().min(1, "Start date/time is required"),
    scheduledEnd: z.string().min(1, "End date/time is required"),
    reason: z.string(),
    location: z.string(),
    notes: z.string(),
  })
  .refine(
    (data) => {
      if (!data.scheduledStart || !data.scheduledEnd) return true;
      return new Date(data.scheduledEnd) > new Date(data.scheduledStart);
    },
    {
      message: "End date/time must be after start date/time",
      path: ["scheduledEnd"],
    },
  );

export function AppointmentSheet({
  open,
  onOpenChange,
  appointment,
  defaultDate,
  onSuccess,
}: AppointmentSheetProps) {
  const isEdit = !!appointment;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getInitialValues(appointment, defaultDate),
  });

  const scheduledStart = useWatch({
    control: form.control,
    name: "scheduledStart",
  });
  const showPastWarning = isPastDateTime(scheduledStart);

  useEffect(() => {
    if (!open) return;
    form.reset(getInitialValues(appointment, defaultDate));

    getPatients({ status: "ACTIVE", pageSize: 100 })
      .then((r) => r.success && setPatients(r.data.data))
      .catch(() => null);

    getProfessionals({ active: true, pageSize: 100 })
      .then((r) => r.success && setProfessionals(r.data.data))
      .catch(() => null);
  }, [open, appointment, defaultDate, form]);

  async function handleSubmit(values: AppointmentFormValues) {
    const payload = {
      patientId: values.patientId,
      professionalId: values.professionalId || undefined,
      scheduledStart: values.scheduledStart,
      scheduledEnd: values.scheduledEnd,
      reason: values.reason || undefined,
      location: values.location || undefined,
      notes: values.notes || undefined,
    };

    try {
      const result = isEdit
        ? await updateAppointment(appointment!.id, payload)
        : await createAppointment(payload);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEdit ? "Appointment updated" : "Appointment created");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Appointment" : "New Appointment"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the appointment details."
              : "Schedule a new appointment."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="patientId">Patient *</Label>
            <select
              id="patientId"
              {...form.register("patientId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={!!form.formState.errors.patientId}
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
            {form.formState.errors.patientId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.patientId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="professionalId">Professional</Label>
            <select
              id="professionalId"
              {...form.register("professionalId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">None</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="scheduledStart">Start *</Label>
              <Input
                id="scheduledStart"
                type="datetime-local"
                {...form.register("scheduledStart")}
                aria-invalid={!!form.formState.errors.scheduledStart}
              />
              {form.formState.errors.scheduledStart && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.scheduledStart.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="scheduledEnd">End *</Label>
              <Input
                id="scheduledEnd"
                type="datetime-local"
                {...form.register("scheduledEnd")}
                aria-invalid={!!form.formState.errors.scheduledEnd}
              />
              {form.formState.errors.scheduledEnd && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.scheduledEnd.message}
                </p>
              )}
            </div>
          </div>

          {showPastWarning && (
            <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
              The start time is in the past. You can still save the appointment.
            </p>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" {...form.register("reason")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...form.register("notes")}
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
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create appointment"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
