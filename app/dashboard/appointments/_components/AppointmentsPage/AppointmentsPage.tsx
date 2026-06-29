"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/core/permissions/hooks/use-permission";
import {
  getAppointments,
  cancelAppointment,
  completeAppointment,
  noShowAppointment,
} from "@/app/actions/appointments";
import { AppointmentCalendar } from "@/app/dashboard/appointments/_components/AppointmentCalendar";
import { AppointmentList } from "@/app/dashboard/appointments/_components/AppointmentList";
import { AppointmentSheet } from "@/app/dashboard/appointments/_components/AppointmentSheet";
import type { Appointment } from "@/core/appointments/types";

export function AppointmentsPage() {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("appointments.create");

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<
    Appointment | undefined
  >(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const result = await getAppointments({ date: dateStr }).catch(() => null);
      if (cancelled) return;
      if (!result) {
        toast.error("Failed to load appointments");
        setLoading(false);
        return;
      }
      if (result.success) {
        setAppointments(result.data);
      } else {
        toast.error(result.error);
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, refreshKey]);

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
  }

  function handleNew() {
    setEditingAppointment(undefined);
    setSheetOpen(true);
  }

  function handleEdit(id: string) {
    const appt = appointments.find((a) => a.id === id);
    setEditingAppointment(appt);
    setSheetOpen(true);
  }

  async function handleCancel(id: string) {
    const result = await cancelAppointment(id).catch(() => null);
    if (!result) {
      toast.error("Failed to cancel appointment");
      return;
    }
    if (result.success) {
      toast.success("Appointment cancelled");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error(result.error);
    }
  }

  async function handleComplete(id: string) {
    const result = await completeAppointment(id).catch(() => null);
    if (!result) {
      toast.error("Failed to complete appointment");
      return;
    }
    if (result.success) {
      toast.success("Appointment completed");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error(result.error);
    }
  }

  async function handleNoShow(id: string) {
    const result = await noShowAppointment(id).catch(() => null);
    if (!result) {
      toast.error("Failed to mark appointment as no-show");
      return;
    }
    if (result.success) {
      toast.success("Appointment marked as no-show");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error(result.error);
    }
  }

  function handleSheetSuccess() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleNew}>New appointment</Button>
        )}
      </div>

      <div className="flex gap-6">
        <div className="shrink-0">
          <AppointmentCalendar
            selected={selectedDate}
            onSelect={handleDateSelect}
          />
        </div>

        <div className="flex-1 min-w-0">
          <AppointmentList
            appointments={appointments}
            isLoading={loading}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onComplete={handleComplete}
            onNoShow={handleNoShow}
          />
        </div>
      </div>

      <AppointmentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        appointment={editingAppointment}
        defaultDate={selectedDate}
        onSuccess={handleSheetSuccess}
      />
    </div>
  );
}
