import { Users, CalendarCheck, CreditCard, Puzzle } from "lucide-react";

export { ease } from "@/lib/consts/animation";

export const features = [
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Complete digital records with history, insurance, and emergency contacts. All in one place.",
    bg: "bg-white",
    textColor: "text-[#111111]",
    bodyColor: "text-[#6B7280]",
    iconWrap: "bg-[#EAF4EF]",
    iconColor: "text-[#1F7A5C]",
    span: "md:col-span-3",
  },
  {
    icon: CalendarCheck,
    title: "Smart Scheduling",
    description:
      "Intelligent booking with conflict detection and multi-provider calendar views.",
    bg: "bg-[#EAF4EF]",
    textColor: "text-[#111111]",
    bodyColor: "text-[#374151]",
    iconWrap: "bg-white",
    iconColor: "text-[#1F7A5C]",
    span: "md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Billing and Invoices",
    description:
      "Automated invoices, payment tracking, and real-time financial reporting.",
    bg: "bg-white",
    textColor: "text-[#111111]",
    bodyColor: "text-[#6B7280]",
    iconWrap: "bg-[#EAF4EF]",
    iconColor: "text-[#1F7A5C]",
    span: "md:col-span-2",
  },
  {
    icon: Puzzle,
    title: "Specialty Plugins",
    description:
      "Add any specialty module without touching the core. Dental, nutrition, psychology, and more.",
    bg: "bg-[#1F7A5C]",
    textColor: "text-white",
    bodyColor: "text-white/70",
    iconWrap: "bg-white/15",
    iconColor: "text-white",
    span: "md:col-span-3",
  },
];
