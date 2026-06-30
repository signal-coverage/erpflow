"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type {
  PluginManifest,
  PluginNavItem,
  PluginRegistryEntry,
} from "@/core/plugins/types";
import type { SystemRole } from "@/core/users/types";
import { PLUGIN_REGISTRY } from "@/plugins";
import {
  getInstalledPlugins,
  getMyProfileContext,
} from "@/app/actions/plugins";

interface PluginContextValue {
  installedPlugins: PluginRegistryEntry[];
  enabledManifests: PluginManifest[];
  pluginNavItems: PluginNavItem[];
  pluginPermissions: string[];
  userRole: SystemRole | null;
  isLoading: boolean;
  refetch: () => void;
}

const PluginContext = createContext<PluginContextValue>({
  installedPlugins: [],
  enabledManifests: [],
  pluginNavItems: [],
  pluginPermissions: [],
  userRole: null,
  isLoading: true,
  refetch: () => {},
});

export function usePlugins() {
  return useContext(PluginContext);
}

export function PluginProvider({ children }: { children: React.ReactNode }) {
  const [installedPlugins, setInstalledPlugins] = useState<
    PluginRegistryEntry[]
  >([]);
  const [userRole, setUserRole] = useState<SystemRole | null>(null);
  const [userSpecialties, setUserSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlugins = useCallback(async () => {
    setIsLoading(true);
    const [pluginsResult, profileResult] = await Promise.all([
      getInstalledPlugins(),
      getMyProfileContext(),
    ]);
    if (pluginsResult.success) setInstalledPlugins(pluginsResult.data);
    if (profileResult.success) {
      setUserRole(profileResult.data.roleId);
      setUserSpecialties(profileResult.data.specialties);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlugins();
  }, [fetchPlugins]);

  const enabledManifests = installedPlugins
    .filter((p) => p.enabled)
    .map((p) => PLUGIN_REGISTRY[p.pluginId])
    .filter((m): m is PluginManifest => m !== undefined);

  const allPluginNavItems = enabledManifests.flatMap((m) => m.navigation);

  const pluginNavItems =
    userRole === "professional"
      ? enabledManifests
          .filter((m) => userSpecialties.includes(m.id))
          .flatMap((m) => m.navigation)
      : allPluginNavItems;

  const pluginPermissions = enabledManifests.flatMap((m) => m.permissions);

  return (
    <PluginContext.Provider
      value={{
        installedPlugins,
        enabledManifests,
        pluginNavItems,
        pluginPermissions,
        userRole,
        isLoading,
        refetch: fetchPlugins,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
}
