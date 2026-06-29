"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  createInvoiceSchema,
  type CreateInvoiceSchemaOutput,
} from "@/core/billing/schemas/billing.schema";
import { createInvoice, updateInvoice } from "@/app/actions/billing";
import { InvoiceItemsEditor } from "@/app/dashboard/billing/_components/InvoiceItemsEditor";
import { DEFAULT_INVOICE_VALUES } from "./consts";
import type { InvoiceSheetProps } from "./types";

function computeTotal(
  items: CreateInvoiceSchemaOutput["items"],
  tax: number,
  discount: number,
): number {
  const subtotal =
    Math.round(
      items.reduce((acc, it) => {
        const qty = Number(it.quantity) || 0;
        const price = Number(it.unitPrice) || 0;
        return acc + qty * price;
      }, 0) * 100,
    ) / 100;
  return Math.round((subtotal + (tax || 0) - (discount || 0)) * 100) / 100;
}

export function InvoiceSheet({
  open,
  onOpenChange,
  mode,
  invoice,
  patients,
  onSuccess,
}: InvoiceSheetProps) {
  const isEdit = mode === "edit";

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceSchemaOutput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: DEFAULT_INVOICE_VALUES,
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];
  const watchedTax = useWatch({ control, name: "tax" }) ?? 0;
  const watchedDiscount = useWatch({ control, name: "discount" }) ?? 0;
  const total = computeTotal(watchedItems, watchedTax, watchedDiscount);

  useEffect(() => {
    if (open) {
      if (isEdit && invoice) {
        reset({
          patientId: invoice.patientId,
          appointmentId: invoice.appointmentId,
          currency: invoice.currency,
          items:
            invoice.items.length > 0
              ? invoice.items
              : DEFAULT_INVOICE_VALUES.items,
          tax: invoice.tax,
          discount: invoice.discount,
          notes: invoice.notes ?? "",
        });
      } else {
        reset(DEFAULT_INVOICE_VALUES);
      }
    }
  }, [open, isEdit, invoice, reset]);

  async function onSubmit(data: CreateInvoiceSchemaOutput) {
    try {
      const result =
        isEdit && invoice
          ? await updateInvoice(invoice.id, {
              items: data.items,
              tax: data.tax,
              discount: data.discount,
              notes: data.notes,
            })
          : await createInvoice(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEdit ? "Invoice updated" : "Invoice created");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Invoice" : "New Invoice"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the invoice details."
              : "Fill in the details to create a new invoice."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 py-2"
        >
          {!isEdit && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="patientId">Patient *</Label>
              <select
                id="patientId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("patientId")}
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-xs text-destructive">
                  {errors.patientId.message}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="currency">Currency *</Label>
            <Select
              defaultValue="USD"
              onValueChange={(v) =>
                setValue("currency", v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-xs text-destructive">
                {errors.currency.message}
              </p>
            )}
          </div>

          <InvoiceItemsEditor
            control={control}
            errors={errors}
            setValue={setValue}
          />

          <div className="flex flex-col gap-1">
            <Label htmlFor="tax">Tax</Label>
            <Input
              id="tax"
              type="number"
              min={0}
              step={0.01}
              {...register("tax", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              step={0.01}
              {...register("discount", { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end">
            <span className="text-sm font-semibold">
              Total: {total.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              {...register("notes")}
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
                  : "Create invoice"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
