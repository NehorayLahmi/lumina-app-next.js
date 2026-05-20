"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C } from "./_components/constants";
import { OverviewTab } from "./_components/OverviewTab";
import { ActivityTab } from "./_components/ActivityTab";
import { ProfileTab } from "./_components/ProfileTab";
import type { ProData, ActivityItem, Tab } from "./_components/types";

export default function DashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const [pro, setPro]           = useState<ProData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<Tab>("overview");

  useEffect(() => {
    fetch("/api/pro/dashboard")
      .then((r) => r.json())
      .then((d) => { setPro(d); setLoading(false); })
      .catch(() => { setError("שגיאה בטעינת הנתונים"); setLoading(false); });
  }, []);

  async function toggleStatus() {
    if (!pro) return;
    setToggling(true);
    const res = await fetch("/api/pro/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !pro.isActive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPro((prev) => prev ? { ...prev, isActive: updated.isActive } : prev);
    }
    setToggling(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span className="material-symbols-outlined pro-shimmer" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>diamond</span>
          <span style={{ color: C.onSurfVar, fontSize: 13 }}>טוען נתונים...</span>
        </div>
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div style={{ minHeight: "100dvh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#ffb4ab", fontSize: 14 }}>{error || "שגיאה בטעינת הפרופיל"}</span>
      </div>
    );
  }

  const now = new Date();
  const thisMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };
  const monthlyLeads = pro.leads.filter((l) => thisMonth(l.createdAt)).length;
  const monthlyCalls = pro.calls.filter((c) => thisMonth(c.createdAt)).length;
  const monthlyTotal = (monthlyLeads + monthlyCalls) * pro.pricePerLead;

  const activity: ActivityItem[] = [
    ...pro.leads.map((l): ActivityItem => ({ kind: "lead", ...l })),
    ...pro.calls.map((c): ActivityItem => ({ kind: "call", ...c })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const NAV: { key: Tab; icon: string; label: string }[] = [
    { key: "overview", icon: "dashboard",       label: "ניהול" },
    { key: "activity", icon: "receipt_long",    label: "פעילות" },
    { key: "profile",  icon: "manage_accounts", label: "פרופיל" },
  ];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, direction: "rtl" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(23, 7, 32, 0.65)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 20px", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: C.primary, fontVariationSettings: "'FILL' 1" }}>diamond</span>
          <span className="pro-shimmer" style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>
            LUMINA LEAD
          </span>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1px solid rgba(244, 240, 185, 0.77)",
          background: "rgba(222,185,244,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: C.primary,
          fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
        }}>
          {pro.firstName[0]}{pro.lastName[0]}
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: "24px 20px 100px" }}>
        {tab === "overview" && (
          <OverviewTab
            pro={pro}
            monthlyLeads={monthlyLeads}
            monthlyCalls={monthlyCalls}
            monthlyTotal={monthlyTotal}
            activity={activity}
            onSwitchActivity={() => setTab("activity")}
          />
        )}
        {tab === "activity" && <ActivityTab activity={activity} />}
        {tab === "profile"  && <ProfileTab pro={pro} email={email} toggling={toggling} onToggle={toggleStatus} onLogout={handleLogout} />}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 20px 20px",
        background: "rgba(53, 35, 62, 0.7)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
      }}>
        {NAV.map(({ key, icon, label }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 16px",
              color: active ? C.tertiary : "rgba(205,195,206,0.45)",
              filter: active ? `drop-shadow(0 0 6px ${C.tertiary})` : "none",
              transition: "color 0.2s, filter 0.2s",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
