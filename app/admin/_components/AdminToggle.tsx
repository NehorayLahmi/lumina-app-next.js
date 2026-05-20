"use client";

import { C } from "./constants";

export function AdminToggle({ on, locked, loading, onToggle }: {
  on: boolean; locked: boolean; loading: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {locked && (
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.error }} title="נעול על ידי מנהל">
          lock
        </span>
      )}
      <button
        onClick={onToggle}
        disabled={loading}
        style={{
          width: 42, height: 22, borderRadius: 999,
          background: on ? C.tertiary : C.outlineVar,
          border: locked ? `1px solid ${C.error}55` : "none",
          cursor: loading ? "not-allowed" : "pointer",
          position: "relative", transition: "background 0.2s",
          opacity: loading ? 0.5 : 1, flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 2, left: on ? 21 : 2,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}
