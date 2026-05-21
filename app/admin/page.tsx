import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import AdminClient from "./AdminClient";

export const metadata = { title: "פאנל ניהול — מערכת לידים" };

export default async function AdminPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">פאנל ניהול</h1>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
            מנהל מערכת
          </span>
          <LogoutButton />
        </div>
      </header>

      <AdminClient />
    </main>
  );
}
