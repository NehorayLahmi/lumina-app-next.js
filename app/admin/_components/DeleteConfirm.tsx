"use client";

import { C } from "./constants";
import { Modal } from "./Modal";

export function DeleteConfirm({ name, onConfirm, onCancel, busy, errorMsg }: {
  name: string; onConfirm: () => void; onCancel: () => void; busy: boolean; errorMsg: string;
}) {
  return (
    <Modal title="מחיקת נציג" onClose={onCancel}>
      <p style={{ fontSize: 14, color: C.onSurfVar, marginBottom: 20, textAlign: "center" }}>
        האם למחוק את <strong style={{ color: C.onSurface }}>{name}</strong>? פעולה זו אינה הפיכה.
      </p>
      {errorMsg && <p style={{ color: C.error, fontSize: 13, marginBottom: 12, textAlign: "center" }}>{errorMsg}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onConfirm} disabled={busy} style={{ flex: 1, height: 44, background: `${C.error}22`, border: `1px solid ${C.error}44`, borderRadius: 12, color: C.error, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
          {busy ? "מוחק..." : "מחק"}
        </button>
        <button onClick={onCancel} style={{ flex: 1, height: 44, background: `${C.outlineVar}33`, border: "none", borderRadius: 12, color: C.onSurface, fontSize: 14, cursor: "pointer" }}>
          ביטול
        </button>
      </div>
    </Modal>
  );
}
