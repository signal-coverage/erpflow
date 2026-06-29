"use client";

import { ROLE_PERMISSIONS } from "@/core/permissions/permissions";
import type { SystemRole } from "@/core/users/types";
import type { PermissionKey } from "@/core/permissions/types";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLES: SystemRole[] = ["admin", "staff", "professional"];

const ROLE_LABEL: Record<SystemRole, string> = {
  admin: "Admin",
  staff: "Staff",
  professional: "Professional",
};

function groupPermissions(
  allPermissions: PermissionKey[],
): Record<string, PermissionKey[]> {
  const groups: Record<string, PermissionKey[]> = {};
  for (const perm of allPermissions) {
    const module = perm.split(".")[0];
    if (!groups[module]) groups[module] = [];
    groups[module].push(perm);
  }
  return groups;
}

const ALL_PERMISSIONS: PermissionKey[] = Array.from(
  new Set(Object.values(ROLE_PERMISSIONS).flatMap((perms) => perms)),
) as PermissionKey[];

const PERMISSION_GROUPS = groupPermissions(ALL_PERMISSIONS);

export function RolesMatrix() {
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">Roles &amp; Permissions</h1>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-45">Permission</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center min-w-30">
                  {ROLE_LABEL[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(PERMISSION_GROUPS).map(([module, permissions]) => (
              <React.Fragment key={module}>
                <TableRow className="bg-muted/50">
                  <TableCell
                    colSpan={ROLES.length + 1}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2"
                  >
                    {module}
                  </TableCell>
                </TableRow>
                {permissions.map((perm) => (
                  <TableRow key={perm}>
                    <TableCell className="text-sm text-muted-foreground pl-6">
                      {perm.split(".")[1]}
                    </TableCell>
                    {ROLES.map((role) => (
                      <TableCell key={role} className="text-center">
                        {ROLE_PERMISSIONS[role].includes(perm) ? (
                          <span
                            className="text-primary font-semibold"
                            aria-label="granted"
                          >
                            ✓
                          </span>
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
