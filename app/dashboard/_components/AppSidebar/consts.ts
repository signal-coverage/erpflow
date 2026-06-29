import {
  LayoutDashboard,
  Users,
  Activity,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Patients", href: "/dashboard/patients", icon: Users },
  { title: "Professionals", href: "/dashboard/professionals", icon: Activity },
  { title: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export const footerItems = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Help", href: "/dashboard/help", icon: HelpCircle },
];
