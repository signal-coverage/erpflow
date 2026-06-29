"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createPatient, updatePatient } from "@/app/actions/patients";
import type { PatientSheetProps, PatientFormValues } from "./types";
import { patientFormSchema } from "./types";
import { getInitialValues } from "./utils";

export function PatientSheet({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: PatientSheetProps) {
  const isEdit = !!patient;
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: getInitialValues(patient),
  });

  useEffect(() => {
    if (open) {
      reset(getInitialValues(patient));
    }
  }, [open, patient, reset]);

  async function onSubmit(values: PatientFormValues) {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      documentType: values.documentType as
        "DNI" | "PASSPORT" | "CUIL" | "OTHER",
      documentNumber: values.documentNumber,
      gender:
        (values.gender as
          "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | undefined) ||
        undefined,
      birthDate: values.birthDate || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      notes: values.notes || undefined,
    };

    const result = isEdit
      ? await updatePatient(patient!.id, payload)
      : await createPatient(payload as Parameters<typeof createPatient>[0]);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Patient updated" : "Patient created");
    onOpenChange(false);
    onSuccess();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Patient" : "New Patient"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the patient's information."
              : "Fill in the details to create a new patient."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="firstName">First name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="lastName">Last name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="documentType">Document type *</Label>
            <Controller
              control={control}
              name="documentType"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="documentType"
                    aria-invalid={!!errors.documentType}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="PASSPORT">Passport</SelectItem>
                    <SelectItem value="CUIL">CUIL</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.documentType && (
              <p className="text-xs text-destructive">
                {errors.documentType.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="documentNumber">Document number *</Label>
            <Input
              id="documentNumber"
              {...register("documentNumber")}
              aria-invalid={!!errors.documentNumber}
            />
            {errors.documentNumber && (
              <p className="text-xs text-destructive">
                {errors.documentNumber.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="gender">Gender</Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Birth date</Label>
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => {
                const selected = field.value
                  ? new Date(field.value + "T12:00:00")
                  : undefined;
                return (
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? format(selected!, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : "",
                          );
                          setCalendarOpen(false);
                        }}
                        captionLayout="dropdown"
                        defaultMonth={selected}
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {errors.birthDate && (
              <p className="text-xs text-destructive">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register("notes")}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create patient"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
