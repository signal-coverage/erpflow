import {
  LayoutDashboard,
  Users,
  Activity,
  Calendar,
  CreditCard,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Patients", href: "/dashboard/patients", icon: Users },
  { title: "Professionals", href: "/dashboard/professionals", icon: Activity },
  { title: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
];
