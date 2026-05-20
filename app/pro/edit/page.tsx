import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import ProEditPage from "./ProEditPage";

export default async function EditPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  if (user.role !== "PRO") redirect("/login");
  return <ProEditPage />;
}
