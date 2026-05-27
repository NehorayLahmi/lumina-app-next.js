import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import AdminClient from "./AdminClient";
import { C } from "./_components/constants";

export const metadata = { title: "פאנל ניהול מערכת לידים" };

export default async function AdminPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.bg, direction: "rtl" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(37, 41, 43, 0.65)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.outlineVar}44`,
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 22, color: C.primary,
            fontVariationSettings: "'FILL' 1",
          }}>admin_panel_settings</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.onSurface }}>
              ניהול נתונים
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: C.onSurfVar }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            background: `${C.tertiary}22`,
            color: C.tertiary,
            border: `1px solid ${C.tertiary}55`,
            padding: "3px 10px", borderRadius: 999,
          }}>
            מנהל על
          </span>
          <LogoutButton />
        </div>
      </header>

      <AdminClient />
    </main>
  );
}
