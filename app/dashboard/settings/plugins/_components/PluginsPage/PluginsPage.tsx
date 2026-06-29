"use client";

import { useCallback, useEffect, useState } from "react";
import { PLUGIN_REGISTRY } from "@/plugins";
import { getInstalledPlugins } from "@/app/actions/plugins";
import type { PluginRegistryEntry } from "@/core/plugins/types";
import { PluginCard } from "@/app/dashboard/settings/plugins/_components/PluginCard";

export function PluginsPage() {
  const [installedPlugins, setInstalledPlugins] = useState<
    PluginRegistryEntry[]
  >([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await getInstalledPlugins();
    if (result.success) {
      setInstalledPlugins(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pluginList = Object.values(PLUGIN_REGISTRY);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Plugins</h2>
        <p className="text-sm text-muted-foreground">
          Manage the plugins installed for your organization.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pluginList.map((manifest) => {
            const entry = installedPlugins.find(
              (p) => p.pluginId === manifest.id,
            );
            return (
              <PluginCard
                key={manifest.id}
                manifest={manifest}
                entry={entry}
                onRefresh={refresh}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
