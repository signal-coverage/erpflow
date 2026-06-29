"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermission } from "@/core/permissions/hooks/use-permission";

interface NavItem {
  label: string;
  href: string;
  permission:
    | "organization.read"
    | "users.read"
    | "settings.manage"
    | "notifications.read";
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Organization",
    href: "/dashboard/settings/organization",
    permission: "organization.read",
  },
  {
    label: "Users",
    href: "/dashboard/settings/users",
    permission: "users.read",
  },
  {
    label: "Roles & Permissions",
    href: "/dashboard/settings/roles",
    permission: "settings.manage",
  },
  {
    label: "Notifications",
    href: "/dashboard/settings/notifications",
    permission: "notifications.read",
  },
  {
    label: "Plugins",
    href: "/dashboard/settings/plugins",
    permission: "settings.manage",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { hasPermission } = usePermission();

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasPermission(item.permission),
  );

  return (
    <div className="space-y-6">
      <nav className="flex gap-1 border-b pb-0">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div>{children}</div>
    </div>
  );
}
