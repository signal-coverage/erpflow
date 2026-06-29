import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BillingPage } from "./_components/BillingPage";

export default async function BillingRoute() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return <BillingPage />;
}
