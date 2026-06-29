import { prisma } from "@/infrastructure/db/client";
import type { PluginRegistryEntry } from "@/core/plugins/types";

export async function installPlugin(
  orgId: string,
  pluginId: string,
  version: string,
  installedBy: string,
): Promise<PluginRegistryEntry> {
  const result = await prisma.$transaction(async (tx) => {
    const entry = await tx.pluginRegistry.create({
      data: {
        organizationId: orgId,
        pluginId,
        version,
        installedBy,
        enabled: true,
        config: {},
      },
    });

    await tx.organization.update({
      where: { id: orgId },
      data: {
        enabledPlugins: {
          push: pluginId,
        },
      },
    });

    return entry;
  });

  return {
    id: result.id,
    organizationId: result.organizationId,
    pluginId: result.pluginId,
    version: result.version,
    enabled: result.enabled,
    installedAt: result.installedAt,
    installedBy: result.installedBy,
    config: result.config as Record<string, unknown>,
  };
}

export async function enablePlugin(
  orgId: string,
  pluginId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.pluginRegistry.update({
      where: {
        organizationId_pluginId: { organizationId: orgId, pluginId },
      },
      data: { enabled: true },
    });

    const org = await tx.organization.findUnique({
      where: { id: orgId },
      select: { enabledPlugins: true },
    });

    const current = org?.enabledPlugins ?? [];
    if (!current.includes(pluginId)) {
      await tx.organization.update({
        where: { id: orgId },
        data: { enabledPlugins: { push: pluginId } },
      });
    }
  });
}

export async function disablePlugin(
  orgId: string,
  pluginId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.pluginRegistry.update({
      where: {
        organizationId_pluginId: { organizationId: orgId, pluginId },
      },
      data: { enabled: false },
    });

    const org = await tx.organization.findUnique({
      where: { id: orgId },
      select: { enabledPlugins: true },
    });

    const updated = (org?.enabledPlugins ?? []).filter((p) => p !== pluginId);
    await tx.organization.update({
      where: { id: orgId },
      data: { enabledPlugins: { set: updated } },
    });
  });
}

export async function uninstallPlugin(
  orgId: string,
  pluginId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.pluginRegistry.delete({
      where: {
        organizationId_pluginId: { organizationId: orgId, pluginId },
      },
    });

    const org = await tx.organization.findUnique({
      where: { id: orgId },
      select: { enabledPlugins: true },
    });

    const updated = (org?.enabledPlugins ?? []).filter((p) => p !== pluginId);
    await tx.organization.update({
      where: { id: orgId },
      data: { enabledPlugins: { set: updated } },
    });
  });
}

export async function getInstalledPlugins(
  orgId: string,
): Promise<PluginRegistryEntry[]> {
  const rows = await prisma.pluginRegistry.findMany({
    where: { organizationId: orgId },
    orderBy: { installedAt: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organizationId,
    pluginId: row.pluginId,
    version: row.version,
    enabled: row.enabled,
    installedAt: row.installedAt,
    installedBy: row.installedBy,
    config: row.config as Record<string, unknown>,
  }));
}

export async function isPluginEnabled(
  orgId: string,
  pluginId: string,
): Promise<boolean> {
  const row = await prisma.pluginRegistry.findUnique({
    where: {
      organizationId_pluginId: { organizationId: orgId, pluginId },
    },
    select: { enabled: true },
  });
  return row?.enabled ?? false;
}
