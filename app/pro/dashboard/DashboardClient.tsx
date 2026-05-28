"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { C } from "./_components/constants";
import { OverviewTab } from "./_components/OverviewTab";
import { ActivityTab } from "./_components/ActivityTab";
import { ProfileTab } from "./_components/ProfileTab";
import type { ProData, ActivityItem, Tab } from "./_components/types";

interface Props {
  email: string;
  /** כשמסופק — מצב צפייה של מנהל בדשבורד נציג ספציפי */
  proId?: string;
}

export default function DashboardClient({ email, proId }: Props) {
  const router = useRouter();
  const isAdminView = Boolean(proId);
  const [pro, setPro]           = useState<ProData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<Tab>("overview");

  const loadData = useCallback(async (initial = false) => {
    const url = isAdminView ? `/api/admin/pros/${proId}/dashboard` : "/api/pro/dashboard";
    try {
      const r = await fetch(url);
      if (r.status === 401) {
        router.push("/login");
        router.refresh();
        return;
      }
      if (!r.ok) {
        if (initial) setError("שגיאה בטעינת הנתונים");
        return;
      }
      const d = await r.json();
      setPro(d);
    } catch {
      if (initial) setError("שגיאה בטעינת הנתונים");
    } finally {
      if (initial) setLoading(false);
    }
  }, [proId, isAdminView, router]);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(), 30_000);
    const onVisible = () => { if (document.visibilityState === "visible") loadData(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, [loadData]);

  async function toggleStatus() {
    if (!pro) return;
    setToggling(true);
    if (isAdminView) {
      await fetch(`/api/admin/pros/${proId}/toggle`, { method: "PATCH" });
      const updated = await fetch(`/api/admin/pros/${proId}/dashboard`).then(r => r.json());
      setPro(updated);
    } else {
      const res = await fetch("/api/pro/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pro.isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPro((prev) => prev ? { ...prev, isActive: updated.isActive } : prev);
      }
    }
    setToggling(false);
  }

  async function handleLogout() {
    if (isAdminView) {
      router.push("/admin?tab=pros");
      return;
    }
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
        background: "rgba(30,32,40,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div className="pwa-status-spacer" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", height: 60 }}>
        {isAdminView ? (
          <button type="button" onClick={() => router.push("/admin?tab=pros")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.onSurfVar, fontSize: 13, padding: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">arrow_forward</span>
            חזרה לנציגים
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: C.primary, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">diamond</span>
            <span className="pro-shimmer" style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>
              LUMINA LEAD
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAdminView && (
            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 999, background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}33`, color: C.tertiary }}>
              תצוגת מנהל
            </span>
          )}
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid rgba(244,240,185,0.77)",
            background: "rgba(222,185,244,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: C.primary,
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
          }}>
            {pro.firstName[0]}{pro.lastName[0]}
          </div>
        </div>
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
            editHref={isAdminView ? `/admin/pros/${proId}/edit` : "/pro/edit"}
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
        background: "rgba(37, 41, 43, 0.65)",
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
              color: active ? C.tertiary : "rgba(195, 206, 206, 0.78)",
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
