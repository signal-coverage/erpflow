import { format } from "date-fns";

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
}
