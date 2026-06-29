"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/core/organizations/hooks/use-organization";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardGuardProps } from "./types";

export function DashboardGuard({ children }: DashboardGuardProps) {
  const { loading, needsOnboarding } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && needsOnboarding) {
      router.replace("/onboarding");
    }
  }, [loading, needsOnboarding, router]);

  if (loading) return <DashboardSkeleton />;
  if (needsOnboarding) return null;

  return <>{children}</>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
