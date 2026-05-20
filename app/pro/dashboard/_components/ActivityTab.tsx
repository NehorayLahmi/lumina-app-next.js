"use client";

import { CITIES, PROFESSIONS } from "@/lib/options";
import { C } from "./constants";
import { labelOf, formatDate, formatDuration } from "./helpers";
import { StatusBadge } from "./StatusBadge";
import { AudioPlayer } from "./AudioPlayer";
import type { ActivityItem, Call, Lead } from "./types";

export function ActivityTab({ activity }: { activity: ActivityItem[] }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: C.onSurface, marginBottom: 16 }}>
        כל הפעילות
        <span style={{ fontSize: 12, fontWeight: 400, color: C.onSurfVar, marginRight: 8 }}>({activity.length} רשומות)</span>
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activity.map((item) => {
          const isCall = item.kind === "call";
          return (
            <div key={item.id} className="pro-glass" style={{ borderRadius: 16, padding: "14px 16px", borderRight: `3px solid ${isCall ? C.tertiary : C.secondary}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: isCall ? C.tertiary : C.secondary }}>{isCall ? "call" : "description"}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>
                    {isCall ? (item as Call).callerPhone : (item as Lead).clientName}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.onSurfVar }}>{formatDate(item.createdAt)}</span>
                {isCall
                  ? (item as Call).recordingUrl
                    ? <AudioPlayer url={(item as Call).recordingUrl!} />
                    : <span style={{ fontSize: 11, color: C.onSurfVar }}>{formatDuration((item as Call).duration)}</span>
                  : <span style={{ fontSize: 11, color: C.onSurfVar }}>
                      {labelOf(CITIES, (item as Lead).city)} · {labelOf(PROFESSIONS, (item as Lead).profession)}
                    </span>
                }
              </div>
            </div>
          );
        })}
        {activity.length === 0 && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "40px 0" }}>אין פעילות עדיין</p>
        )}
      </div>
    </div>
  );
}
