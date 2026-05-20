"use client";

import { C, STATUS_CLR, STATUS_LABELS } from "./constants";

export function Badge({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
      background: `${STATUS_CLR[status] ?? C.onSurfVar}18`,
      color: STATUS_CLR[status] ?? C.onSurfVar,
    }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
