"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { C } from "./_components/constants";
import { OverviewTab } from "./_components/OverviewTab";
import { ProsTab } from "./_components/ProsTab";
import { PagesTab } from "./_components/PagesTab";
import { TrafficTab } from "./_components/TrafficTab";
import type { Stats, Pro, LandingPage, Call, Lead, Tab } from "./_components/types";

const VALID_TABS: Tab[] = ["overview", "pros", "pages", "traffic"];

export default function AdminClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") ?? "overview") as Tab;
  const [tab, setTab]     = useState<Tab>(VALID_TABS.includes(initialTab) ? initialTab : "overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [pros, setPros]   = useState<Pro[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sR, pR, pgR, cR, lR] = await Promise.all([
        fetch("/api/admin/stats"), fetch("/api/admin/pros"), fetch("/api/admin/landing-pages"),
        fetch("/api/admin/calls"), fetch("/api/admin/leads"),
      ]);
      const [s, p, pg, c, l] = await Promise.all([sR.json(), pR.json(), pgR.json(), cR.json(), lR.json()]);
      setStats(s);
      setPros(Array.isArray(p) ? p : []);
      setPages(Array.isArray(pg) ? pg : []);
      setCalls(Array.isArray(c) ? c : []);
      setLeads(Array.isArray(l) ? l : []);
    } catch { setError("שגיאה בטעינת הנתונים"); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const TABS: { key: Tab; icon: string; label: string }[] = [
    { key: "overview", icon: "dashboard", label: "סקירה" },
    { key: "pros",     icon: "group",     label: `נציגים (${pros.length})` },
    { key: "pages",    icon: "web",       label: `דפים (${pages.length})` },
    { key: "traffic",  icon: "analytics", label: "תנועה" },
  ];

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span className="material-symbols-outlined pro-shimmer" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>diamond</span>
        <span style={{ color: C.onSurfVar, fontSize: 13 }}>טוען נתונים...</span>
      </div>
    </div>
  );
  if (error) return <div style={{ textAlign: "center", color: C.error, padding: 40 }}>{error}</div>;

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", direction: "rtl" }}>
      {/* Tab bar */}
      <div className="pwa-tab-sticky" style={{ position: "sticky", top: 60, zIndex: 40, background: "rgba(21,23,28,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.outlineVar}44`, padding: "8px 20px 0" }}>
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(({ key, icon, label }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px 10px",
                background: "none", border: "none", cursor: "pointer",
                color: active ? C.tertiary : C.onSurfVar, whiteSpace: "nowrap",
                borderBottom: `2px solid ${active ? C.tertiary : "transparent"}`,
                fontWeight: active ? 700 : 500, fontSize: 13, transition: "all 0.2s",
                filter: active ? `drop-shadow(0 0 6px ${C.tertiary})` : "none",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px 40px", maxWidth: 900, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab stats={stats} />}
        {tab === "pros"     && <ProsTab pros={pros} onRefresh={loadAll} />}
        {tab === "pages"    && <PagesTab pages={pages} pros={pros} />}
        {tab === "traffic"  && <TrafficTab calls={calls} leads={leads} pros={pros} />}
      </div>
    </div>
  );
}
