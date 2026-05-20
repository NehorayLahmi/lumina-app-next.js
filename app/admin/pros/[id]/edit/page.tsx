import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import AdminProEditPage from "./AdminProEditPage";

export default async function AdminProEditWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return <AdminProEditPage proId={id} />;
}
