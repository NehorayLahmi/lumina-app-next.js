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
          const isWa = isCall && (item as Call).type === "WHATSAPP";
          const borderColor = isWa ? "#25D366" : isCall ? C.tertiary : C.secondary;
          return (
            <div key={item.id} className="pro-glass" style={{ borderRadius: 16, padding: "14px 16px", borderRight: `3px solid ${borderColor}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isWa
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-label="WhatsApp"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    : <span className="material-symbols-outlined" style={{ fontSize: 18, color: isCall ? C.tertiary : C.secondary }}>{isCall ? "call" : "description"}</span>
                  }
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>
                    {isWa
                      ? `WhatsApp · ${(item as Call).destinationPhone}`
                      : isCall
                        ? (item as Call).callerPhone
                        : (item as Lead).clientName
                    }
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.onSurfVar }}>{formatDate(item.createdAt)}</span>
                {isCall
                  ? (item as Call).recordingUrl
                    ? <AudioPlayer url={(item as Call).recordingUrl!} />
                    : <span style={{ fontSize: 11, color: C.onSurfVar }}>{isWa ? "💬 WhatsApp" : formatDuration((item as Call).duration)}</span>
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
