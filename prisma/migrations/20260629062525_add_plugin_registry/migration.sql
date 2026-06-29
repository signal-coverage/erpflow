-- CreateTable
CREATE TABLE "PluginRegistry" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installedBy" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PluginRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PluginRegistry_organizationId_idx" ON "PluginRegistry"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "PluginRegistry_organizationId_pluginId_key" ON "PluginRegistry"("organizationId", "pluginId");
