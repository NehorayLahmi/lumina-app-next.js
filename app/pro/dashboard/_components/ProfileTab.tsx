"use client";

import { CITIES, PROFESSIONS } from "@/lib/options";
import { C } from "./constants";
import { labelOf } from "./helpers";
import type { ProData } from "./types";

interface Props {
  pro: ProData;
  email: string;
  toggling: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function ProfileTab({ pro, email, toggling, onToggle, onLogout }: Props) {
  const fields = [
    { icon: "person",      label: "שם מלא",    value: `${pro.firstName} ${pro.lastName}` },
    { icon: "mail",        label: "אימייל",     value: email },
    { icon: "call",        label: "טלפון",      value: pro.phone },
    { icon: "location_on", label: "עיר",        value: labelOf(CITIES, pro.city) },
    { icon: "category",    label: "מקצוע",      value: labelOf(PROFESSIONS, pro.profession) },
    { icon: "sell",        label: "מחיר לליד",  value: `₪${pro.pricePerLead}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Avatar */}
      <div className="pro-glass" style={{ borderRadius: 24, padding: "28px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 120, height: 120, background: "rgba(222,185,244,0.1)", filter: "blur(40px)", borderRadius: "50%" }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.tertiary})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 22, fontWeight: 700, color: C.onPrimary, fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
          {pro.firstName[0]}{pro.lastName[0]}
        </div>
        <p style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: C.onSurface }}>{pro.firstName} {pro.lastName}</p>
        <p style={{ fontSize: 12, color: C.onSurfVar, marginTop: 2 }}>{email}</p>
      </div>

      {/* Toggle */}
      <div className="pro-glass" style={{ borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurface }}>קבלת לידים</p>
          <p style={{ fontSize: 11, color: pro.adminLocked ? "#ffb4ab" : pro.isActive ? C.tertiary : C.onSurfVar }}>
            {pro.adminLocked ? "הושבת על ידי מנהל המערכת" : pro.isActive ? "פעיל — מקבל לידים" : "לא פעיל"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {pro.adminLocked && (
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#ffb4ab" }} title="נעול על ידי מנהל">lock</span>
          )}
          <button onClick={onToggle} disabled={toggling || pro.adminLocked} style={{
            width: 48, height: 26, borderRadius: 999,
            background: pro.isActive ? C.tertiary : C.outlineVar,
            border: pro.adminLocked ? "1px solid rgba(255,180,171,0.4)" : "none",
            cursor: (toggling || pro.adminLocked) ? "not-allowed" : "pointer",
            position: "relative", transition: "background 0.2s",
            opacity: (toggling || pro.adminLocked) ? 0.45 : 1,
          }}>
            <span style={{ position: "absolute", top: 3, left: pro.isActive ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", transition: "left 0.2s" }} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pro-glass" style={{ borderRadius: 20, overflow: "hidden" }}>
        {fields.map((f, i) => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < fields.length - 1 ? `1px solid ${C.outlineVar}22` : "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primary, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 10, color: C.onSurfVar, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{f.label}</p>
              <p style={{ fontSize: 14, color: C.onSurface, fontWeight: 500 }}>{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{ background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", borderRadius: 16, padding: 14, color: "#ffb4ab", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,180,171,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,180,171,0.08)"; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
        התנתקות
      </button>
    </div>
  );
}
