export type OrganizationStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type Plan = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export interface Organization {
  id: string;
  name: string;
  legalName?: string;
  taxId?: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  timezone: string;
  currency: string;
  plan: Plan;
  status: OrganizationStatus;
  enabledPlugins: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
