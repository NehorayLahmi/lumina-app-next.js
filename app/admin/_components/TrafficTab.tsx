"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput, adminSelect, STATUS_LABELS } from "./constants";
import { labelOf, formatDate, formatDuration } from "./helpers";
import { Badge } from "./Badge";
import type { Call, Lead, Pro, TrafficSub } from "./types";

const PAGE_SIZE = 10;

export function TrafficTab({ calls, leads, pros }: { calls: Call[]; leads: Lead[]; pros: Pro[] }) {
  const [sub, setSub] = useState<TrafficSub>("calls");
  const [search, setSearch] = useState("");
  const [filterPro, setFilterPro] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function resetPage() { setPage(1); setExpandedId(null); }

  function handleSubChange(s: TrafficSub) { setSub(s); setPage(1); setExpandedId(null); }

  function resetFilters() {
    setSearch(""); setFilterPro(""); setDateFrom(""); setDateTo(""); setPage(1); setExpandedId(null);
  }

  const filteredCalls = useMemo(() => calls.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      const name = c.pro ? `${c.pro.firstName} ${c.pro.lastName}`.toLowerCase() : "";
      if (!c.callerPhone.includes(q) && !c.destinationPhone.includes(q) && !name.includes(q)) return false;
    }
    if (filterPro && c.proId !== filterPro) return false;
    if (dateFrom && c.createdAt.slice(0, 10) < dateFrom) return false;
    if (dateTo && c.createdAt.slice(0, 10) > dateTo) return false;
    return true;
  }), [calls, search, filterPro, dateFrom, dateTo]);

  const filteredLeads = useMemo(() => leads.filter(l => {
    if (search) {
      const q = search.toLowerCase();
      const name = l.pro ? `${l.pro.firstName} ${l.pro.lastName}`.toLowerCase() : "";
      if (!l.clientName.toLowerCase().includes(q) && !l.clientPhone.includes(q) && !name.includes(q)) return false;
    }
    if (filterPro && l.proId !== filterPro) return false;
    if (dateFrom && l.createdAt.slice(0, 10) < dateFrom) return false;
    if (dateTo && l.createdAt.slice(0, 10) > dateTo) return false;
    return true;
  }), [leads, search, filterPro, dateFrom, dateTo]);

  const allItems = sub === "calls" ? filteredCalls : filteredLeads;
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = allItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasFilter = !!(search || filterPro || dateFrom || dateTo);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Sub-tabs row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: `${C.outlineVar}33`, borderRadius: 12, padding: 4, gap: 4 }}>
          {([["calls", `שיחות (${filteredCalls.length})`], ["leads", `לידים (${filteredLeads.length})`]] as [TrafficSub, string][]).map(([key, label]) => (
            <button key={key} onClick={() => handleSubChange(key)} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: sub === key ? C.surfHigh : "transparent", color: sub === key ? C.onSurface : C.onSurfVar, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        {hasFilter && (
          <button onClick={resetFilters} style={{ height: 32, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.error}55`, cursor: "pointer", fontSize: 12, color: C.error, background: `${C.error}11` }}>
            נקה סינון
          </button>
        )}
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "2 1 150px", minWidth: 130 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: C.onSurfVar, pointerEvents: "none" }}>search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} placeholder="חיפוש..." style={{ ...adminInput, paddingRight: "2.2rem", height: 38, borderRadius: 10 }} />
        </div>
        <select value={filterPro} onChange={e => { setFilterPro(e.target.value); resetPage(); }} style={{ ...adminSelect, flex: "2 1 150px", minWidth: 130, height: 38, borderRadius: 10 }}>
          <option value="">כל הנציגים</option>
          {pros.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
<div style={{ display: "flex", gap: 8, flex: "1 1 100%", minWidth: 0 }}>
  <label style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0, overflow: "hidden" }}>
    <span style={{ fontSize: 10, fontWeight: 700, color: C.onSurfVar, letterSpacing: "0.05em" }}>מתאריך</span>
    <input 
      type="date" 
      value={dateFrom} 
      onChange={e => { setDateFrom(e.target.value); resetPage(); }} 
      style={{ 
        ...adminInput, 
        width: "100%", 
        minWidth: 0, 
        height: 38, 
        borderRadius: 10, 
        cursor: "pointer", 
        direction: "ltr",
        // תיקונים לאייפון:
        colorScheme: "dark", 
        WebkitAppearance: "none", 
        appearance: "none",
        padding: "0 10px",
        boxSizing: "border-box"
      }} 
    />
  </label>
  <label style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0, overflow: "hidden" }}>
    <span style={{ fontSize: 10, fontWeight: 700, color: C.onSurfVar, letterSpacing: "0.05em" }}>עד תאריך</span>
    <input 
      type="date" 
      value={dateTo} 
      onChange={e => { setDateTo(e.target.value); resetPage(); }} 
      style={{ 
        ...adminInput, 
        width: "100%", 
        minWidth: 0, 
        height: 38, 
        borderRadius: 10, 
        cursor: "pointer", 
        direction: "ltr",
        // תיקונים לאייפון:
        colorScheme: "dark",
        WebkitAppearance: "none",
        appearance: "none",
        padding: "0 10px",
        boxSizing: "border-box"
      }} 
    />
  </label>
</div>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sub === "calls" && (pageItems as Call[]).map(c => {
          const open = expandedId === c.id;
          const isWa = c.type === "WHATSAPP";
          const accentColor = isWa ? "#25D366" : C.tertiary;
          return (
            <div key={c.id} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${open ? accentColor + "66" : C.outlineVar + "33"}`, transition: "border-color 0.2s" }}>
              <div className="pro-glass" onClick={() => setExpandedId(open ? null : c.id)} style={{ padding: "10px 16px", cursor: "pointer", borderRight: `3px solid ${accentColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {isWa
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }} aria-label="WhatsApp"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    : <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.tertiary }}>call</span>
                  }
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurface, fontFamily: "monospace", margin: 0 }}>{isWa ? c.destinationPhone : (c.callerPhone || "—")}</p>
                    <p style={{ fontSize: 11, color: C.onSurfVar, margin: 0 }}>{formatDate(c.createdAt)}{!isWa && ` · ${formatDuration(c.duration)}`}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                    <Badge status={c.status} />
                    <p style={{ fontSize: 11, color: c.pro ? C.primary : C.onSurfVar, margin: 0 }}>
                      {c.pro ? `${c.pro.firstName} ${c.pro.lastName}` : "—"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.onSurfVar, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>expand_more</span>
                </div>
              </div>
              {open && (
                <div style={{ padding: "12px 16px", background: `${C.surfHigh}99`, borderTop: `1px solid ${C.outlineVar}44`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                  <Detail label="סוג" value={isWa ? "💬 WhatsApp" : "📞 שיחה"} />
                  {!isWa && <Detail label="מתקשר" value={c.callerPhone || "—"} />}
                  <Detail label="יעד" value={c.destinationPhone || "—"} />
                  <Detail label="סטטוס" value={STATUS_LABELS[c.status] ?? c.status} />
                  {!isWa && <Detail label="משך" value={formatDuration(c.duration)} />}
                  <Detail label="תאריך" value={formatDate(c.createdAt)} />
                  <Detail label="מזהה" value={c.id} mono />
                  {c.pro && <>
                    <Detail label="נציג" value={`${c.pro.firstName} ${c.pro.lastName}`} />
                    <Detail label="טלפון נציג" value={c.pro.phone} />
                    <Detail label="עיר" value={labelOf(CITIES, c.pro.city)} />
                    <Detail label="מקצוע" value={labelOf(PROFESSIONS, c.pro.profession)} />
                  </>}
                  {c.recordingUrl && <Detail label="הקלטה" value={c.recordingUrl} />}
                </div>
              )}
            </div>
          );
        })}

        {sub === "leads" && (pageItems as Lead[]).map(l => {
          const open = expandedId === l.id;
          return (
            <div key={l.id} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${open ? C.secondary + "66" : C.outlineVar + "33"}`, transition: "border-color 0.2s" }}>
              <div className="pro-glass" onClick={() => setExpandedId(open ? null : l.id)} style={{ padding: "10px 16px", cursor: "pointer", borderRight: `3px solid ${C.secondary}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurface, margin: 0 }}>{l.clientName}</p>
                  <p style={{ fontSize: 11, color: C.onSurfVar, margin: 0 }}>{l.clientPhone} · {labelOf(CITIES, l.city)} / {labelOf(PROFESSIONS, l.profession)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                    <Badge status={l.status} />
                    <p style={{ fontSize: 11, color: l.pro ? C.primary : C.onSurfVar, margin: 0 }}>
                      {l.pro ? `${l.pro.firstName} ${l.pro.lastName}` : "—"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.onSurfVar, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>expand_more</span>
                </div>
              </div>
              {open && (
                <div style={{ padding: "12px 16px", background: `${C.surfHigh}99`, borderTop: `1px solid ${C.outlineVar}44`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                  <Detail label="שם לקוח" value={l.clientName} />
                  <Detail label="טלפון" value={l.clientPhone} />
                  <Detail label="עיר" value={labelOf(CITIES, l.city)} />
                  <Detail label="מקצוע" value={labelOf(PROFESSIONS, l.profession)} />
                  <Detail label="סטטוס" value={STATUS_LABELS[l.status] ?? l.status} />
                  <Detail label="תאריך" value={formatDate(l.createdAt)} />
                  <Detail label="מזהה" value={l.id} mono />
                  {l.pro && <>
                    <Detail label="נציג" value={`${l.pro.firstName} ${l.pro.lastName}`} />
                    <Detail label="טלפון נציג" value={l.pro.phone} />
                    <Detail label="עיר נציג" value={labelOf(CITIES, l.pro.city)} />
                    <Detail label="מקצוע נציג" value={labelOf(PROFESSIONS, l.pro.profession)} />
                  </>}
                </div>
              )}
            </div>
          );
        })}

        {pageItems.length === 0 && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "32px 0" }}>לא נמצאו רשומות</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 4 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={pagerStyle(safePage === 1)}>הקודם</button>
          <span style={{ fontSize: 13, color: C.onSurfVar }}>{safePage} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={pagerStyle(safePage === totalPages)}>הבא</button>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span style={{ fontSize: 10, color: C.onSurfVar, display: "block", marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.onSurface, fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

function pagerStyle(disabled: boolean): React.CSSProperties {
  return {
    height: 32, padding: "0 16px", borderRadius: 8, border: `1px solid ${C.outlineVar}`,
    cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: 600,
    color: disabled ? C.onSurfVar : C.onSurface,
    background: disabled ? "transparent" : C.surfHigh,
    opacity: disabled ? 0.4 : 1,
    transition: "opacity 0.2s",
  };
}
