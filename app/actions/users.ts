"use server";

import {
  getUserProfile as _getUserProfile,
  createUserProfile as _createUserProfile,
  updateUserProfile as _updateUserProfile,
} from "@/core/users/services/users.service";
import type { UserProfile } from "@/core/users/types";

export async function getUserProfile(uid: string) {
  return _getUserProfile(uid);
}

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
) {
  return _createUserProfile(uid, data);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<
    Omit<UserProfile, "id" | "organizationId" | "createdAt" | "createdBy">
  >,
  updatedBy: string,
) {
  return _updateUserProfile(uid, data, updatedBy);
}
