"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { PluginManifest } from "@/core/plugins/types";
import type { PluginRegistryEntry } from "@/core/plugins/types";
import {
  installPlugin,
  enablePlugin,
  disablePlugin,
  uninstallPlugin,
} from "@/app/actions/plugins";

interface PluginCardProps {
  manifest: PluginManifest;
  entry: PluginRegistryEntry | undefined;
  onRefresh: () => void;
}

export function PluginCard({ manifest, entry, onRefresh }: PluginCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleAction(
    action: () => Promise<{ success: boolean; error?: string }>,
    successMessage: string,
  ) {
    setLoading(true);
    const result = await action();
    if (!result.success) {
      toast.error(result.error ?? "Action failed");
    } else {
      toast.success(successMessage);
    }
    onRefresh();
    setLoading(false);
  }

  const isInstalled = entry !== undefined;
  const isEnabled = entry?.enabled ?? false;

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">{manifest.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {manifest.description}
          </p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          v{manifest.version}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isInstalled ? (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isEnabled
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
            Not installed
          </span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {!isInstalled && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => installPlugin(manifest.id), `${manifest.name} installed`)}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Install
          </button>
        )}
        {isInstalled && !isEnabled && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => enablePlugin(manifest.id), `${manifest.name} enabled`)}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Enable
          </button>
        )}
        {isInstalled && isEnabled && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => disablePlugin(manifest.id), `${manifest.name} disabled`)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            Disable
          </button>
        )}
        {isInstalled && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => uninstallPlugin(manifest.id), `${manifest.name} uninstalled`)}
            className="rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            Uninstall
          </button>
        )}
      </div>
    </div>
  );
}
