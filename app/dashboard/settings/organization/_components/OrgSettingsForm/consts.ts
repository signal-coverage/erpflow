import { TIMEZONES, CURRENCIES } from "@/lib/consts";
import type { UpdateOrganizationInput } from "@/core/organizations/schemas/organization.schema";

export { TIMEZONES, CURRENCIES };

export const DEFAULT_FORM_VALUES: UpdateOrganizationInput = {
  name: "",
  email: "",
  phone: "",
  timezone: "America/Argentina/Buenos_Aires",
  currency: "ARS",
  legalName: "",
  taxId: "",
};
