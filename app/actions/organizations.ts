"use server";

import {
  getOrganization as _getOrganization,
  createOrganization as _createOrganization,
  updateOrganization as _updateOrganization,
} from "@/core/organizations/services/organizations.service";
import type { Organization } from "@/core/organizations/types";

export async function getOrganization(id: string) {
  return _getOrganization(id);
}

export async function createOrganization(
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">,
  createdBy: string,
) {
  return _createOrganization(data, createdBy);
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<Organization, "id" | "createdAt" | "createdBy">>,
  updatedBy: string,
) {
  return _updateOrganization(id, data, updatedBy);
}
