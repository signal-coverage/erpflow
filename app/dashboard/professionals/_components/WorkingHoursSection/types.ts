import type { UseFieldArrayReturn, Control } from "react-hook-form";
import type { ProfessionalFormValues } from "@/app/dashboard/professionals/_components/ProfessionalSheet/types";

export interface WorkingHoursSectionProps {
  fieldArray: UseFieldArrayReturn<ProfessionalFormValues, "workingHours">;
  control: Control<ProfessionalFormValues>;
}
