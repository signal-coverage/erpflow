import type { PluginManifest } from "@/core/plugins/types";
import odontologyManifest from "./odontology/plugin";

export const PLUGIN_REGISTRY: Record<string, PluginManifest> = {
  odontology: odontologyManifest,
};
