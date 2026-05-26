"use client";

import { useState, useEffect } from "react";
import { C } from "./constants";
import type { Stats } from "./types";

export function OverviewTab({ stats }: { stats: Stats | null }) {
  const [adminNotifyAll, setAdminNotifyAll] = useState<boolean | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [broadcastMsg, setBroadcastMsg]     = useState("");
  const [broadcastOpen, setBroadcastOpen]   = useState(false);
  const [broadcastBusy, setBroadcastBusy]   = useState(false);
  const [broadcastResult, setBroadcastResult] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => setAdminNotifyAll(d.adminNotifyAll ?? true))
      .catch(() => {});
  }, []);

  const toggle = async () => {
    if (adminNotifyAll === null) return;
    setSaving(true);
    const next = !adminNotifyAll;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotifyAll: next }),
      });
      if (res.ok) setAdminNotifyAll(next);
    } finally { setSaving(false); }
  };

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    setBroadcastBusy(true); setBroadcastResult("");
    try {
      const res  = await fetch("/api/admin/telegram/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMsg.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBroadcastResult(`✅ נשלח ל-${data.sent} נציגים`);
        setBroadcastMsg("");
      } else {
        setBroadcastResult(`❌ ${data.message ?? "שגיאה"}`);
      }
    } catch { setBroadcastResult("❌ שגיאת חיבור"); }
    setBroadcastBusy(false);
  };

  if (!stats) return null;

  const cards = [
    { icon: "description", label: 'סה"כ לידים', value: stats.totalLeads.toLocaleString(), color: C.primary },
    { icon: "call", label: 'סה"כ שיחות', value: stats.totalCalls.toLocaleString(), color: C.tertiary },
    { icon: "warning", label: "שיחות Fallback", value: stats.fallbackCalls.toLocaleString(), color: C.secondary },
    { icon: "group", label: "נציגים פעילים", value: stats.activePros.toLocaleString(), color: C.tertiary },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero revenue */}
      <section className="pro-glass pro-fade" style={{ borderRadius: 32, padding: "28px 24px", position: "relative", overflow: "hidden", transform: "translateZ(0)", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, background: "rgba(0,218,247,0.12)", filter: "blur(60px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, background: "rgba(255,172,232,0.12)", filter: "blur(60px)", borderRadius: "50%" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.onSurfVar, fontWeight: 700, marginBottom: 6 }}>הכנסה כוללת</p>
        <h1 className="pro-shimmer" style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 42, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
          ₪{stats.totalRevenue.toLocaleString()}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.tertiary }}>trending_up</span>
          <span style={{ color: C.tertiary, fontSize: 12, fontWeight: 700 }}>מכלל הנציגים</span>
        </div>
      </section>

      {/* Stats grid */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {cards.map((card) => (
          <div key={card.label} className="pro-glass" style={{ borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: card.color }}>{card.icon}</span>
            <p style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 24, fontWeight: 700, color: C.onSurface }}>{card.value}</p>
            <p style={{ fontSize: 12, color: C.onSurfVar }}>{card.label}</p>
          </div>
        ))}
      </section>

      {/* Telegram settings */}
      <section className="pro-glass" style={{ borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: adminNotifyAll ? C.tertiary : C.onSurfVar, fontVariationSettings: "'FILL' 1" }}>send</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.onSurface, margin: 0 }}>קבלת עדכונים מכל נציג</p>
            <p style={{ fontSize: 11, color: adminNotifyAll ? C.tertiary : C.onSurfVar, margin: 0 }}>
              {adminNotifyAll === null ? "טוען..." : adminNotifyAll ? "פעיל — מקבל עדכונים מכולם" : "כבוי — כל נציג מקבל רק אליו"}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={saving || adminNotifyAll === null}
          style={{
            width: 48, height: 26, borderRadius: 999,
            background: adminNotifyAll ? C.tertiary : C.outlineVar,
            border: "none", cursor: (saving || adminNotifyAll === null) ? "not-allowed" : "pointer",
            position: "relative", transition: "background 0.2s",
            opacity: saving ? 0.6 : 1, flexShrink: 0,
          }}
        >
          <span style={{ position: "absolute", top: 3, left: adminNotifyAll ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", transition: "left 0.2s" }} />
        </button>
      </section>

      {/* Telegram broadcast */}
      <section className="pro-glass" style={{ borderRadius: 20, padding: "14px 18px" }}>
        <button onClick={() => { setBroadcastOpen(o => !o); setBroadcastResult(""); }} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.primary, fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>שלח הודעה לכל הנציגים</span>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.onSurfVar, transition: "transform 0.2s", transform: broadcastOpen ? "rotate(180deg)" : "none" }}>expand_more</span>
        </button>
        {broadcastOpen && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              placeholder="כתוב הודעה לכל הנציגים המחוברים לטלגרם..."
              rows={3}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.outlineVar}44`, borderRadius: 10, padding: "10px 12px", color: C.onSurface, fontSize: 13, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <button
              onClick={sendBroadcast}
              disabled={broadcastBusy || !broadcastMsg.trim()}
              style={{ alignSelf: "flex-end", background: `linear-gradient(135deg,${C.primary},${C.tertiary})`, border: "none", borderRadius: 10, padding: "8px 20px", color: "#001f28", fontSize: 13, fontWeight: 700, cursor: broadcastBusy ? "not-allowed" : "pointer", opacity: broadcastBusy ? 0.6 : 1 }}
            >
              {broadcastBusy ? "שולח..." : "שלח לכולם"}
            </button>
            {broadcastResult && <p style={{ fontSize: 12, color: broadcastResult.startsWith("✅") ? C.tertiary : "#ffb4ab", margin: 0 }}>{broadcastResult}</p>}
          </div>
        )}
      </section>

      {/* Chart */}
      <section className="pro-glass" style={{ borderRadius: 32, padding: "20px 20px 12px" }}>
        <h3 style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: C.onSurface, marginBottom: 12 }}>מגמות תנועה</h3>
        <svg width="100%" height="120" viewBox="0 0 400 100" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={C.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,80 Q50,60 100,40 T200,50 T300,20 T400,35 L400,100 L0,100 Z" fill="url(#ag)" />
          <path d="M0,80 Q50,60 100,40 T200,50 T300,20 T400,35" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M0,90 Q80,70 160,60 T320,40 T400,55 L400,100 L0,100 Z" fill={`${C.tertiary}18`} />
          <path d="M0,90 Q80,70 160,60 T320,40 T400,55" fill="none" stroke={C.tertiary} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
        </svg>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 2, background: C.primary, borderRadius: 99 }} />
            <span style={{ fontSize: 10, color: C.onSurfVar }}>לידים</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 2, background: C.tertiary, borderRadius: 99 }} />
            <span style={{ fontSize: 10, color: C.onSurfVar }}>שיחות</span>
          </div>
        </div>
      </section>
    </div>
  );
}
