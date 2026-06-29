import type { Invoice, InvoiceFilters } from "@/core/billing/types";
import type { PatientOption } from "@/app/dashboard/billing/_components/InvoiceSheet";

export type SheetMode = "create" | "edit" | null;

export interface BillingPageProps {
  patients?: PatientOption[];
}

export interface BillingPageState {
  invoices: Invoice[];
  loading: boolean;
  filters: InvoiceFilters;
  sheetMode: SheetMode;
  selectedInvoice: Invoice | null;
  paymentTarget: Invoice | null;
  cashDialogOpen: boolean;
}
