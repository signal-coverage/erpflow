"use client";

import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> =
  {
    ACTIVE: "default",
    INACTIVE: "secondary",
    SUSPENDED: "destructive",
  };

export default function OrganizationSettingsPage() {
  const { organization, loading } = useOrganization();
  const { hasPermission } = usePermission();

  if (loading) return null;
  if (!hasPermission("organization.read")) {
    return (
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
    );
  }
  if (!organization) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Organization</h1>
      <Card>
        <CardHeader>
          <CardTitle>General information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Name" value={organization.name} />
          <Field label="Email" value={organization.email} />
          <Field label="Timezone" value={organization.timezone} />
          <Field label="Currency" value={organization.currency} />
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted-foreground">Plan</span>
            <Badge variant="secondary">{organization.plan}</Badge>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={STATUS_VARIANT[organization.status] ?? "default"}>
              {organization.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
