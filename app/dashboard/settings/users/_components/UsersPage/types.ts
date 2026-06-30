import type { UserProfile } from "@/core/users/types";

export interface UsersPageProps {
  users: UserProfile[];
  currentUserId: string;
  canEdit: boolean;
  canInvite: boolean;
}
