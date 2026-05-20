"use client";

import { C, STATUS_BG, STATUS_CLR, STATUS_LABELS } from "./constants";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
      background: STATUS_BG[status] ?? "rgba(255,255,255,0.08)",
      color: STATUS_CLR[status] ?? C.onSurfVar,
    }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
