import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import AdminCreatePageForm from "./AdminCreatePageForm";

export default async function NewLandingPagePage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return <AdminCreatePageForm />;
}
