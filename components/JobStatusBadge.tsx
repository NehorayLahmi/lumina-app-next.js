"use client";

import { useState } from "react";

// סטטוס "האם נסגרה עסקה" של ליד / שיחה — מתעדכן מכפתורי ההודעה בטלגרם או מהאפליקציה
const JOB_STATUS = {
  closed:  { label: "נסגרה עסקה",   icon: "check_circle", color: "#7ee2a8" },
  open:    { label: "לא נסגרה",     icon: "cancel",       color: "#ffb4ab" },
  pending: { label: "ממתין לעדכון", icon: "schedule",     color: "#cdc3ce" },
} as const;

function statusOf(jobClosed: boolean | null | undefined) {
  return JOB_STATUS[jobClosed === true ? "closed" : jobClosed === false ? "open" : "pending"];
}

export function jobStatusLabel(jobClosed: boolean | null | undefined): string {
  return statusOf(jobClosed).label;
}

export function JobStatusBadge({ jobClosed }: { jobClosed: boolean | null | undefined }) {
  const s = statusOf(jobClosed);
  return (
    <span
      title="האם נסגרה עסקה"
      style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
        background: `${s.color}1f`, color: s.color, whiteSpace: "nowrap",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

export type JobKind = "lead" | "call";

/**
 * כפתורי אישור "נסגרה עסקה / לא נסגרה" באפליקציה.
 * לחיצה על האפשרות שכבר מסומנת מאפסת ל"ממתין לעדכון".
 * apiBase: "/api/pro/job-status" (בעל מקצוע) או "/api/admin/job-status" (מנהל)
 */
export function JobStatusToggle({ kind, id, jobClosed, apiBase, onChange }: {
  kind: JobKind;
  id: string;
  jobClosed: boolean | null | undefined;
  apiBase: string;
  onChange: (jobClosed: boolean | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function choose(value: boolean) {
    const next = jobClosed === value ? null : value;
    const prev = jobClosed ?? null;
    setBusy(true);
    setError("");
    onChange(next); // עדכון אופטימי
    try {
      const res = await fetch(`${apiBase}/${kind}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobClosed: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      onChange(prev);
      setError("העדכון נכשל");
    } finally {
      setBusy(false);
    }
  }

  const btn = (value: boolean) => {
    const s = value ? JOB_STATUS.closed : JOB_STATUS.open;
    const active = jobClosed === value;
    return (
      <button
        type="button"
        disabled={busy}
        onClick={(e) => { e.stopPropagation(); choose(value); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 30, padding: "0 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
          cursor: busy ? "default" : "pointer", fontFamily: "inherit",
          border: `1px solid ${active ? s.color : "rgba(205,195,206,0.25)"}`,
          background: active ? `${s.color}22` : "transparent",
          color: active ? s.color : "#cdc3ce",
          opacity: busy ? 0.6 : 1, transition: "all 0.15s",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
          {active ? "check_box" : "check_box_outline_blank"}
        </span>
        {value ? "נסגרה עסקה" : "לא נסגרה"}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {btn(true)}
      {btn(false)}
      {error && <span style={{ fontSize: 11, color: "#ffb4ab" }}>{error}</span>}
    </div>
  );
}
