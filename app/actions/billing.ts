"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/infrastructure/db/client";
import { checkPermission } from "@/core/permissions/utils";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  recordPaymentSchema,
} from "@/core/billing/schemas/billing.schema";
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
  RecordPaymentInput,
} from "@/core/billing/types";
import {
  listInvoices as _listInvoices,
  getInvoice as _getInvoice,
  createInvoice as _createInvoice,
  updateInvoice as _updateInvoice,
  issueInvoice as _issueInvoice,
  voidInvoice as _voidInvoice,
  recordPayment as _recordPayment,
  getDailyCash as _getDailyCash,
} from "@/core/billing/services/billing.service";
import type {
  Invoice,
  Payment,
  InvoiceFilters,
  PaginatedInvoices,
  DailyCashSummary,
  ActionResult,
} from "@/core/billing/types";

async function resolveProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: { organization: true },
  });
  return profile ?? null;
}

export async function getInvoices(
  filters?: InvoiceFilters,
): Promise<ActionResult<PaginatedInvoices>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.read")) {
      return { success: false, error: "Forbidden" };
    }
    const f = filters ?? {};
    const data = await _listInvoices(
      profile.organizationId,
      f,
      f.page,
      f.pageSize,
    );
    return { success: true, data };
  } catch (error) {
    console.error("getInvoices error:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getInvoice(id: string): Promise<ActionResult<Invoice>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.read")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _getInvoice(profile.organizationId, id);
    return { success: true, data };
  } catch (error) {
    console.error("getInvoice error:", error);
    return { success: false, error: "Failed to fetch invoice" };
  }
}

export async function createInvoice(
  input: CreateInvoiceInput,
): Promise<ActionResult<Invoice>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.create")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = createInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    const data = await _createInvoice(
      profile.organizationId,
      profile.id,
      parsed.data as CreateInvoiceInput,
    );
    return { success: true, data };
  } catch (error) {
    console.error("createInvoice error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invoice",
    };
  }
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput,
): Promise<ActionResult<Invoice>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.update")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = updateInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    const data = await _updateInvoice(
      profile.organizationId,
      id,
      profile.id,
      parsed.data as UpdateInvoiceInput,
    );
    return { success: true, data };
  } catch (error) {
    console.error("updateInvoice error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update invoice",
    };
  }
}

export async function issueInvoice(id: string): Promise<ActionResult<Invoice>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.update")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _issueInvoice(profile.organizationId, id, profile.id);
    return { success: true, data };
  } catch (error) {
    console.error("issueInvoice error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to issue invoice",
    };
  }
}

export async function voidInvoice(id: string): Promise<ActionResult<Invoice>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.update")) {
      return { success: false, error: "Forbidden" };
    }
    const data = await _voidInvoice(profile.organizationId, id, profile.id);
    return { success: true, data };
  } catch (error) {
    console.error("voidInvoice error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to void invoice",
    };
  }
}

export async function recordPayment(
  input: RecordPaymentInput,
): Promise<ActionResult<Payment>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.update")) {
      return { success: false, error: "Forbidden" };
    }
    const parsed = recordPaymentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation error",
      };
    }
    const data = await _recordPayment(
      profile.organizationId,
      profile.id,
      parsed.data as RecordPaymentInput,
    );
    return { success: true, data };
  } catch (error) {
    console.error("recordPayment error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to record payment",
    };
  }
}

export async function getDailyCash(): Promise<ActionResult<DailyCashSummary>> {
  try {
    const profile = await resolveProfile();
    if (!profile) return { success: false, error: "Unauthorized" };
    if (!checkPermission(profile.roleId, "billing.read")) {
      return { success: false, error: "Forbidden" };
    }
    const timezone = profile.organization.timezone;
    const data = await _getDailyCash(profile.organizationId, timezone);
    return { success: true, data };
  } catch (error) {
    console.error("getDailyCash error:", error);
    return { success: false, error: "Failed to fetch daily cash summary" };
  }
}
