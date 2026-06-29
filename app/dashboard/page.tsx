"use client";

import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CalendarDays, CreditCard, Puzzle } from "lucide-react";

const PLAN_LABEL: Record<string, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PROFESSIONAL: "Professional",
  ENTERPRISE: "Enterprise",
};

const PLAN_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  FREE: "outline",
  STARTER: "secondary",
  PROFESSIONAL: "default",
  ENTERPRISE: "default",
};

export default function DashboardPage() {
  const { organization, userProfile } = useOrganization();

  const greeting = getGreeting();
  const name = userProfile?.displayName ?? "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {organization?.name} ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Organization"
          value={organization?.name ?? "—"}
          sub={organization?.status ?? ""}
          subVariant={
            organization?.status === "ACTIVE" ? "default" : "secondary"
          }
        />
        <StatCard
          icon={CreditCard}
          label="Plan"
          value={
            PLAN_LABEL[organization?.plan ?? ""] ?? organization?.plan ?? "—"
          }
          sub={organization?.currency ?? ""}
        />
        <StatCard
          icon={Puzzle}
          label="Modules enabled"
          value={String(organization?.enabledPlugins?.length ?? 0)}
          sub={
            organization?.enabledPlugins?.length === 1 ? "module" : "modules"
          }
        />
        <StatCard
          icon={CalendarDays}
          label="Member since"
          value={
            organization?.createdAt
              ? organization.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
          sub={organization?.timezone ?? ""}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  subVariant,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  subVariant?: "default" | "secondary" | "outline";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {sub &&
          (subVariant ? (
            <Badge variant={subVariant} className="mt-1 text-xs">
              {sub}
            </Badge>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          ))}
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
