"use client";

import { C } from "./constants";
import type { Stats } from "./types";

export function OverviewTab({ stats }: { stats: Stats | null }) {
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
