"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  createProfessional,
  updateProfessional,
  createWorkingHours,
  deleteWorkingHours,
  getWorkingHours,
} from "@/app/actions/professionals";
import { WorkingHoursSection } from "@/app/dashboard/professionals/_components/WorkingHoursSection";
import { getInitialValues, parseSpecialties } from "./utils";
import type { ProfessionalSheetProps, ProfessionalFormValues } from "./types";

const professionalFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  specialtiesRaw: z.string(),
  license: z.string(),
  phone: z.string(),
  email: z.string(),
  calendarColor: z.string(),
  workingHours: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
});

export function ProfessionalSheet({
  open,
  onOpenChange,
  professional,
  existingWorkingHours,
  onSuccess,
}: ProfessionalSheetProps) {
  const isEdit = !!professional;

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: getInitialValues(professional, existingWorkingHours),
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "workingHours",
  });

  useEffect(() => {
    if (open) {
      if (isEdit && professional && !existingWorkingHours) {
        getWorkingHours(professional.id).then((result) => {
          if (result.success) {
            form.reset(getInitialValues(professional, result.data));
          }
        });
      } else {
        form.reset(getInitialValues(professional, existingWorkingHours));
      }
    }
  }, [open, professional, existingWorkingHours, isEdit, form]);

  async function handleSubmit(values: ProfessionalFormValues) {
    const specialties = parseSpecialties(values.specialtiesRaw);

    const payload = {
      displayName: values.displayName,
      specialties,
      license: values.license || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      calendarColor: values.calendarColor || undefined,
    };

    try {
      let professionalId: string;

      if (isEdit && professional) {
        const result = await updateProfessional(professional.id, payload);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        professionalId = professional.id;

        // Sync working hours: delete all existing, re-create current entries
        const existing = await getWorkingHours(professionalId);
        if (existing.success) {
          await Promise.all(
            existing.data.map((wh) => deleteWorkingHours(wh.id)),
          );
        }
      } else {
        const result = await createProfessional(payload);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        professionalId = result.data.id;
      }

      // Create all working hours entries
      await Promise.all(
        values.workingHours.map((wh) =>
          createWorkingHours(professionalId, {
            dayOfWeek: wh.dayOfWeek,
            startTime: wh.startTime,
            endTime: wh.endTime,
            active: true,
          }),
        ),
      );

      toast.success(isEdit ? "Professional updated" : "Professional created");
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
            {isEdit ? "Edit Professional" : "New Professional"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the professional's information."
              : "Fill in the details to create a new professional."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="displayName">Display name *</Label>
            <Input
              id="displayName"
              {...form.register("displayName")}
              aria-invalid={!!form.formState.errors.displayName}
            />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="specialtiesRaw">Specialties</Label>
            <Input
              id="specialtiesRaw"
              {...form.register("specialtiesRaw")}
              placeholder="e.g. Cardiology, Internal Medicine"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple specialties with commas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="license">License</Label>
              <Input id="license" {...form.register("license")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="calendarColor">Calendar color</Label>
              <Input
                id="calendarColor"
                {...form.register("calendarColor")}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <WorkingHoursSection
              fieldArray={fieldArray}
              control={form.control}
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
                  : "Create professional"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
