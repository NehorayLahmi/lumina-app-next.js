import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "לוח בקרה — מערכת לידים" };

export default async function ProDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "PRO") redirect("/login");
  return <DashboardClient email={user.email} />;
}
