"use client";

import { CITIES, PROFESSIONS } from "@/lib/options";
import { C } from "./constants";
import { labelOf, formatDate } from "./helpers";
import { StatusBadge } from "./StatusBadge";
import type { ProData, ActivityItem, Call, Lead } from "./types";

interface Props {
  pro: ProData;
  monthlyLeads: number;
  monthlyCalls: number;
  monthlyTotal: number;
  activity: ActivityItem[];
  onSwitchActivity: () => void;
}

export function OverviewTab({ pro, monthlyLeads, monthlyCalls, monthlyTotal, activity, onSwitchActivity }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Hero billing */}
      <section className="pro-glass pro-fade" style={{ borderRadius: 32, padding: "28px 24px", position: "relative", overflow: "hidden", animationDelay: "0.1s" }}>
        <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, background: "rgba(0,218,247,0.15)", filter: "blur(60px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, background: "rgba(255,172,232,0.15)", filter: "blur(60px)", borderRadius: "50%" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.onSurfVar, fontWeight: 700, marginBottom: 6 }}>
          סה&quot;כ לתשלום החודש
        </p>
        <h1 className="pro-shimmer" style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
          ₪{monthlyTotal.toLocaleString()}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.tertiary }}>calculate</span>
          <span style={{ color: C.tertiary, fontSize: 12, fontWeight: 700 }}>
            ({monthlyLeads} + {monthlyCalls}) × ₪{pro.pricePerLead}
          </span>
        </div>
      </section>

      {/* Digital Asset Card */}
      <section className="pro-glass pro-fade" style={{ borderRadius: 24, padding: "16px 20px", animationDelay: "0.15s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 18, fontVariationSettings: "'FILL' 1" }}>language</span>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.onSurface }}>הנכס הדיגיטלי שלך</p>
        </div>
        <p style={{ fontSize: 12, color: C.onSurfVar, fontFamily: "monospace", background: "rgba(0,218,247,0.07)", borderRadius: 8, padding: "6px 10px", marginBottom: 12, letterSpacing: "0.02em" }}>
          /{pro.profession}/{pro.city}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`/${pro.profession}/${pro.city}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, height: 38, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: `linear-gradient(135deg,rgba(0,218,247,0.12),rgba(0,218,247,0.06))`, border: `1px solid ${C.tertiary}44`, borderRadius: 10, color: C.tertiary, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            צפה באתר  ↗
          </a>
          <a
            href="/pro/edit"
            style={{ flex: 1, height: 38, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(222,185,244,0.1)", border: `1px solid ${C.primary}44`, borderRadius: 10, color: C.primary, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit_square</span>
            ערוך את האתר
          </a>
        </div>
      </section>

      {/* Stats grid */}
      <section className="pro-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animationDelay: "0.2s" }}>
        <div className="pro-glass" style={{ borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 22 }}>description</span>
            <span style={{ background: "rgba(222,185,244,0.12)", color: C.primary, padding: "1px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
              {monthlyLeads} החודש
            </span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: C.onSurface }}>{pro.leads.length}</p>
            <p style={{ fontSize: 12, color: C.onSurfVar }}>סה&quot;כ לידים</p>
          </div>
        </div>

        <div className="pro-glass" style={{ borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 22 }}>call</span>
            <span style={{ background: "rgba(0,218,247,0.1)", color: C.tertiary, padding: "1px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
              {monthlyCalls} החודש
            </span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: C.onSurface }}>{pro.calls.length}</p>
            <p style={{ fontSize: 12, color: C.onSurfVar }}>סה&quot;כ שיחות</p>
          </div>
        </div>

        <div className="pro-glass" style={{ gridColumn: "1 / -1", borderRadius: 20, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,172,232,0.1)", border: "1px solid rgba(255,172,232,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: C.secondary, fontSize: 22 }}>engineering</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: C.onSurface }}>
                {pro.firstName} {pro.lastName}
              </p>
              <p style={{ fontSize: 11, color: C.onSurfVar }}>
                {labelOf(CITIES, pro.city)} · {labelOf(PROFESSIONS, pro.profession)}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: pro.isActive ? C.tertiary : C.onSurfVar }}>
              {pro.isActive ? "פעיל" : "לא פעיל"}
            </span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: pro.isActive ? C.tertiary : C.outlineVar, boxShadow: pro.isActive ? `0 0 8px ${C.tertiary}` : "none" }} />
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="pro-glass pro-fade" style={{ borderRadius: 32, padding: "20px 20px 12px", animationDelay: "0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: C.onSurface }}>מגמות תנועה</h3>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.tertiary, boxShadow: `0 0 8px ${C.tertiary}` }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.surfHighest }} />
          </div>
        </div>
        <div style={{ height: 160, width: "100%", position: "relative" }}>
          <svg width="100%" height="100%" viewBox="0 0 400 150" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={C.tertiary} stopOpacity="0.3" />
                <stop offset="100%" stopColor={C.tertiary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M400,120 Q350,110 320,70 T240,50 T160,90 T80,40 T0,20 L0,150 L400,150 Z" fill="url(#cg)" />
            <path d="M400,120 Q350,110 320,70 T240,50 T160,90 T80,40 T0,20" fill="none" stroke={C.tertiary} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="20" r="4" fill={C.tertiary} />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["שני","שלישי","רביעי","חמישי","שישי","שבת","ראשון"].map((d) => (
              <span key={d} style={{ fontSize: 9, fontWeight: 700, color: "rgba(205,195,206,0.4)" }}>{d}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activity preview */}
      <section className="pro-fade" style={{ animationDelay: "0.4s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: C.onSurface }}>פעילות אחרונה</h3>
          <button onClick={onSwitchActivity} style={{ background: "none", border: "none", color: C.tertiary, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
            הצג הכל
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activity.slice(0, 5).map((item) => {
            const isCall = item.kind === "call";
            return (
              <div key={item.id} className="pro-glass" style={{ borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRight: `3px solid ${isCall ? C.tertiary : C.secondary}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: isCall ? "rgba(0,218,247,0.1)" : "rgba(255,172,232,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: isCall ? C.tertiary : C.secondary }}>{isCall ? "call" : "description"}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>
                      {isCall ? (item as Call).callerPhone : (item as Lead).clientName}
                    </p>
                    <p style={{ fontSize: 11, color: C.onSurfVar }}>{formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            );
          })}
          {activity.length === 0 && (
            <p style={{ textAlign: "center", color: C.onSurfVar, fontSize: 13, padding: "24px 0" }}>אין פעילות עדיין</p>
          )}
        </div>
      </section>
    </div>
  );
}
