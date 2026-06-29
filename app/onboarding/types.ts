import { z } from "zod";

export const onboardingFormSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  email: z.string().email("Invalid email address"),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
