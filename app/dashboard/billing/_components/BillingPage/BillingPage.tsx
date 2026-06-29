"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { getInvoices, issueInvoice, voidInvoice } from "@/app/actions/billing";
import { InvoiceFilters } from "@/app/dashboard/billing/_components/InvoiceFilters";
import { InvoiceTable } from "@/app/dashboard/billing/_components/InvoiceTable";
import { InvoiceSheet } from "@/app/dashboard/billing/_components/InvoiceSheet";
import { PaymentSheet } from "@/app/dashboard/billing/_components/PaymentSheet";
import { DailyCashDialog } from "@/app/dashboard/billing/_components/DailyCashDialog";
import type {
  Invoice,
  InvoiceFilters as InvoiceFiltersType,
} from "@/core/billing/types";
import type { BillingPageProps, SheetMode } from "./types";

export function BillingPage({ patients = [] }: BillingPageProps) {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("billing.create");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<InvoiceFiltersType>({
    page: 1,
    pageSize: 20,
  });
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<Invoice | null>(null);
  const [cashDialogOpen, setCashDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await getInvoices(filters).catch(() => null);
      if (cancelled) return;
      if (!result) {
        toast.error("Failed to load invoices");
        setLoading(false);
        return;
      }
      if (result.success) {
        setInvoices(result.data.invoices);
      } else {
        toast.error(result.error);
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [filters, refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleNewInvoice() {
    setSelectedInvoice(null);
    setSheetMode("create");
  }

  function handleEdit(invoice: Invoice) {
    setSelectedInvoice(invoice);
    setSheetMode("edit");
  }

  async function handleIssue(invoice: Invoice) {
    const result = await issueInvoice(invoice.id).catch(() => null);
    if (!result || !result.success) {
      toast.error(result?.error ?? "Failed to issue invoice");
      return;
    }
    toast.success("Invoice issued");
    refresh();
  }

  async function handleVoid(invoice: Invoice) {
    const result = await voidInvoice(invoice.id).catch(() => null);
    if (!result || !result.success) {
      toast.error(result?.error ?? "Failed to void invoice");
      return;
    }
    toast.success("Invoice voided");
    refresh();
  }

  function handlePay(invoice: Invoice) {
    setPaymentTarget(invoice);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage invoices and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCashDialogOpen(true)}>
            Daily Cash
          </Button>
          {canCreate && <Button onClick={handleNewInvoice}>New Invoice</Button>}
        </div>
      </div>

      <InvoiceFilters filters={filters} onFiltersChange={setFilters} />

      <InvoiceTable
        invoices={invoices}
        isLoading={loading}
        onEdit={handleEdit}
        onIssue={handleIssue}
        onVoid={handleVoid}
        onPay={handlePay}
      />

      <InvoiceSheet
        open={sheetMode !== null}
        onOpenChange={(open) => {
          if (!open) setSheetMode(null);
        }}
        mode={sheetMode ?? "create"}
        invoice={selectedInvoice ?? undefined}
        patients={patients}
        onSuccess={refresh}
      />

      <PaymentSheet
        open={paymentTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPaymentTarget(null);
        }}
        invoice={paymentTarget}
        onSuccess={refresh}
      />

      <DailyCashDialog open={cashDialogOpen} onOpenChange={setCashDialogOpen} />
    </div>
  );
}
