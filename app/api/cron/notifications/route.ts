import { addHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { render } from "@react-email/render";
import * as React from "react";
import { prisma } from "@/infrastructure/db/client";
import {
  getPendingReminders,
  getPendingBirthdays,
} from "@/core/notifications/services/notifications.service";
import { dispatch } from "@/lib/notifications/dispatcher";
import { AppointmentReminder } from "@/lib/email/templates/AppointmentReminder";
import { PatientBirthday } from "@/lib/email/templates/PatientBirthday";

export async function GET(request: Request) {
  // Validate CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace("Bearer ", "");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowEnd = addHours(now, 24);

  let processed = 0;

  // --- Appointment reminders ---
  const pendingReminders = await getPendingReminders(now, windowEnd);

  for (const reminder of pendingReminders) {
    const html = await render(
      React.createElement(AppointmentReminder, {
        patientName: reminder.patientName,
        scheduledStart: reminder.scheduledStart,
        professionalName: reminder.professionalName ?? undefined,
        location: reminder.location ?? undefined,
      }),
    );

    await dispatch({
      type: "APPOINTMENT_REMINDER",
      organizationId: reminder.organizationId,
      recipientId: reminder.patientId,
      recipientEmail: reminder.patientEmail ?? null,
      recipientName: reminder.patientName,
      subject: "Appointment reminder for tomorrow",
      html,
    });

    processed++;
  }

  // --- Patient birthdays ---
  // Fetch all organizations to iterate per-org timezone
  const organizations = await prisma.organization.findMany({
    select: { id: true, timezone: true },
  });

  for (const org of organizations) {
    const zonedNow = toZonedTime(now, org.timezone);
    const month = zonedNow.getMonth() + 1;
    const day = zonedNow.getDate();

    const pendingBirthdays = await getPendingBirthdays(
      org.id,
      month,
      day,
      org.timezone,
    );

    for (const birthday of pendingBirthdays) {
      const html = await render(
        React.createElement(PatientBirthday, {
          patientFirstName: birthday.patientFirstName,
        }),
      );

      await dispatch({
        type: "PATIENT_BIRTHDAY",
        organizationId: birthday.organizationId,
        recipientId: birthday.patientId,
        recipientEmail: birthday.patientEmail ?? null,
        recipientName: birthday.patientName,
        subject: `Happy Birthday, ${birthday.patientFirstName}!`,
        html,
      });

      processed++;
    }
  }

  return Response.json({ processed }, { status: 200 });
}
