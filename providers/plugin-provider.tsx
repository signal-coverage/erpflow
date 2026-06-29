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
import { PLUGIN_REGISTRY } from "@/plugins";
import { getInstalledPlugins } from "@/app/actions/plugins";

interface PluginContextValue {
  installedPlugins: PluginRegistryEntry[];
  enabledManifests: PluginManifest[];
  pluginNavItems: PluginNavItem[];
  pluginPermissions: string[];
  isLoading: boolean;
  refetch: () => void;
}

const PluginContext = createContext<PluginContextValue>({
  installedPlugins: [],
  enabledManifests: [],
  pluginNavItems: [],
  pluginPermissions: [],
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlugins = useCallback(async () => {
    setIsLoading(true);
    const result = await getInstalledPlugins();
    if (result.success) setInstalledPlugins(result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlugins();
  }, [fetchPlugins]);

  const enabledManifests = installedPlugins
    .filter((p) => p.enabled)
    .map((p) => PLUGIN_REGISTRY[p.pluginId])
    .filter((m): m is PluginManifest => m !== undefined);

  const pluginNavItems = enabledManifests.flatMap((m) => m.navigation);
  const pluginPermissions = enabledManifests.flatMap((m) => m.permissions);

  return (
    <PluginContext.Provider
      value={{
        installedPlugins,
        enabledManifests,
        pluginNavItems,
        pluginPermissions,
        isLoading,
        refetch: fetchPlugins,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
}
