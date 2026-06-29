"use client";

import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { OrgSettingsForm } from "./_components/OrgSettingsForm";

export default function OrganizationSettingsPage() {
  const { loading } = useOrganization();
  const { hasPermission } = usePermission();

  if (loading) return null;

  if (!hasPermission("organization.read")) {
    return (
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
    );
  }

  const canEdit = hasPermission("organization.update");

  return <OrgSettingsForm readOnly={!canEdit} />;
}
