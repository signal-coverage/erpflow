"use client";

import { useController } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAY_LABELS, DAY_OPTIONS } from "./consts";
import type { WorkingHoursSectionProps } from "./types";

export function WorkingHoursSection({
  fieldArray,
  control,
}: WorkingHoursSectionProps) {
  const { fields, append, remove } = fieldArray;

  function handleAdd() {
    append({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Working Hours</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add hours
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No working hours defined.</p>
      )}

      {fields.map((field, index) => (
        <WorkingHoursRow
          key={field.id}
          index={index}
          control={control}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
}

interface WorkingHoursRowProps {
  index: number;
  control: WorkingHoursSectionProps["control"];
  onRemove: () => void;
}

function WorkingHoursRow({ index, control, onRemove }: WorkingHoursRowProps) {
  const { field: dayField } = useController({
    name: `workingHours.${index}.dayOfWeek`,
    control,
  });
  const { field: startField } = useController({
    name: `workingHours.${index}.startTime`,
    control,
  });
  const { field: endField } = useController({
    name: `workingHours.${index}.endTime`,
    control,
  });

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Day</Label>
        <Select
          value={String(dayField.value)}
          onValueChange={(v) => dayField.onChange(Number(v))}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map((d) => (
              <SelectItem key={d} value={String(d)}>
                {DAY_LABELS[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Start</Label>
        <Input
          type="time"
          className="h-8 text-sm"
          value={startField.value as string}
          onChange={(e) => startField.onChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">End</Label>
        <Input
          type="time"
          className="h-8 text-sm"
          value={endField.value as string}
          onChange={(e) => endField.onChange(e.target.value)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label="Remove working hours entry"
      >
        <Trash2Icon className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
