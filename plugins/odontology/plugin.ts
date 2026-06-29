import { Stethoscope } from "lucide-react";
import type { PluginManifest } from "@/core/plugins/types";

const odontologyManifest: PluginManifest = {
  id: "odontology",
  name: "Odontology",
  version: "1.0.0",
  description:
    "Dental clinic management — treatments, odontogram, prescriptions.",
  navigation: [
    { title: "Odontology", href: "/dashboard/odontology", icon: Stethoscope },
  ],
  permissions: ["odontology.view", "odontology.write", "odontology.delete"],
  requiredPermissions: [],
};

export default odontologyManifest;
