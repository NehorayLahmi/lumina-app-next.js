import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import DashboardClient from "@/app/pro/dashboard/DashboardClient";

export default async function AdminProDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return <DashboardClient email={user.email} proId={id} />;
}
