import type { LucideIcon } from "lucide-react";
import type { CorePermissionKey } from "@/core/permissions/types";

export interface PluginNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  navigation: PluginNavItem[];
  permissions: string[];
  requiredPermissions: CorePermissionKey[];
}

export interface PluginRegistryEntry {
  id: string;
  organizationId: string;
  pluginId: string;
  version: string;
  enabled: boolean;
  installedAt: Date;
  installedBy: string;
  config: Record<string, unknown>;
}
