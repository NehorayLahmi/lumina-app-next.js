"use client";

import { useState } from "react";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput } from "./constants";
import { labelOf, formatDate, formatDuration } from "./helpers";
import { Badge } from "./Badge";
import type { Call, Lead, TrafficSub } from "./types";

export function TrafficTab({ calls, leads }: { calls: Call[]; leads: Lead[] }) {
  const [sub, setSub]       = useState<TrafficSub>("calls");
  const [search, setSearch] = useState("");

  const filteredCalls = calls.filter(c => {
    const q = search.toLowerCase();
    return c.callerPhone.includes(q) ||
      (c.pro ? `${c.pro.firstName} ${c.pro.lastName}`.toLowerCase().includes(q) : false);
  });

  const filteredLeads = leads.filter(l => {
    const q = search.toLowerCase();
    return l.clientName.toLowerCase().includes(q) ||
      l.clientPhone.includes(q) ||
      labelOf(CITIES, l.city).includes(q);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: `${C.outlineVar}33`, borderRadius: 12, padding: 4, gap: 4 }}>
          {([["calls", `שיחות (${calls.length})`], ["leads", `לידים (${leads.length})`]] as [TrafficSub, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSub(key)} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: sub === key ? C.surfHigh : "transparent", color: sub === key ? C.onSurface : C.onSurfVar, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: C.onSurfVar }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש..." style={{ ...adminInput, paddingRight: "2.2rem", height: 40, borderRadius: 12 }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sub === "calls" && filteredCalls.map(c => (
          <div key={c.id} className="pro-glass" style={{ borderRadius: 14, padding: "12px 16px", borderRight: `3px solid ${C.tertiary}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurface, fontFamily: "monospace" }}>{c.callerPhone}</p>
                <p style={{ fontSize: 11, color: C.onSurfVar }}>{formatDate(c.createdAt)} · {formatDuration(c.duration)}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <Badge status={c.status} />
                <p style={{ fontSize: 11, color: c.pro ? C.primary : C.secondary }}>
                  {c.pro ? `${c.pro.firstName} ${c.pro.lastName}` : "fallback"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {sub === "leads" && filteredLeads.map(l => (
          <div key={l.id} className="pro-glass" style={{ borderRadius: 14, padding: "12px 16px", borderRight: `3px solid ${C.secondary}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurface }}>{l.clientName}</p>
                <p style={{ fontSize: 11, color: C.onSurfVar }}>{l.clientPhone} · {labelOf(CITIES, l.city)} / {labelOf(PROFESSIONS, l.profession)}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <Badge status={l.status} />
                <p style={{ fontSize: 11, color: l.pro ? C.primary : C.onSurfVar }}>
                  {l.pro ? `${l.pro.firstName} ${l.pro.lastName}` : "—"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {((sub === "calls" && filteredCalls.length === 0) || (sub === "leads" && filteredLeads.length === 0)) && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "32px 0" }}>לא נמצאו רשומות</p>
        )}
      </div>
    </div>
  );
}
