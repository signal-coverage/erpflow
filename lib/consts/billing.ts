import type { PaymentMethod } from "@/core/billing/types";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  CARD: "Card",
  TRANSFER: "Transfer",
  DIGITAL: "Digital wallet",
};
