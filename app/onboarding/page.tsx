"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { createOrganization } from "@/app/actions/organizations";
import { createUserProfile } from "@/app/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONES, CURRENCIES } from "@/lib/consts";
import { onboardingFormSchema, type OnboardingFormValues } from "./types";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      name: "",
      email: user?.email ?? "",
      timezone: "America/Argentina/Buenos_Aires",
      currency: "ARS",
    },
  });

  async function onSubmit(data: OnboardingFormValues) {
    if (!user) return;

    const orgResult = await createOrganization(
      {
        name: data.name,
        email: data.email,
        timezone: data.timezone,
        currency: data.currency,
        plan: "FREE",
        status: "ACTIVE",
        enabledPlugins: [],
        createdBy: user.id,
        updatedBy: user.id,
      },
      user.id,
    );

    if (!orgResult.success) {
      toast.error(orgResult.error ?? "Failed to create organization.");
      return;
    }

    const profileResult = await createUserProfile(user.id, {
      organizationId: orgResult.data.id,
      roleId: "admin",
      displayName: user.displayName ?? data.email.split("@")[0],
      email: data.email,
      status: "ACTIVE",
      createdBy: user.id,
      updatedBy: user.id,
    });

    if (!profileResult.success) {
      toast.error(profileResult.error ?? "Failed to create user profile.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set up your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Clínica San Martín"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.timezone && (
                <p className="text-sm text-destructive">
                  {errors.timezone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">
                  {errors.currency.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
