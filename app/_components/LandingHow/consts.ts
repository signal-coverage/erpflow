import { Settings, Users, LayoutDashboard } from "lucide-react";

export { ease } from "@/lib/consts/animation";

export const steps = [
  {
    number: "01",
    icon: Settings,
    title: "Set up your practice",
    description:
      "Create your organization, configure clinic settings, and customize your workflows in minutes.",
  },
  {
    number: "02",
    icon: Users,
    title: "Add your team and patients",
    description:
      "Invite staff with role-based access. Import existing patient records or start completely fresh.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Run everything from one place",
    description:
      "Schedules, billing, and records all connected. No more switching between separate tools.",
  },
];
