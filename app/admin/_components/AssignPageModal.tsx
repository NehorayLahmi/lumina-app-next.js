"use client";

import { useState } from "react";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminSelect } from "./constants";
import { Modal, ModalField } from "./Modal";
import { labelOf } from "./helpers";
import type { LandingPage, Pro } from "./types";

export function AssignPageModal({ page, pros, onClose, onAssigned }: {
  page: LandingPage; pros: Pro[]; onClose: () => void;
  onAssigned: (pageId: string, proId: string) => void;
}) {
  const [proId, setProId] = useState(page.pro.id);
  const [saving, setSaving] = useState(false);

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault(); setSaving(true);
    const res = await fetch(`/api/admin/landing-pages/${page.id}/assign`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proId }),
    });
    if (res.ok) onAssigned(page.id, proId);
    setSaving(false);
  }

  return (
    <Modal title="שיוך דף נחיתה" onClose={onClose}>
      <p style={{ fontSize: 13, color: C.onSurfVar, marginBottom: 16 }}>{page.mainTitle}</p>
      <form onSubmit={submit}>
        <ModalField label="בחר נציג">
          <select style={adminSelect} value={proId} onChange={e => setProId(e.target.value)}>
            {pros.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {labelOf(CITIES, p.city)} / {labelOf(PROFESSIONS, p.profession)}
              </option>
            ))}
          </select>
        </ModalField>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={saving} style={{ flex: 1, height: 44, background: `linear-gradient(135deg,${C.primary},${C.tertiary})`, border: "none", borderRadius: 12, color: C.onPrimary, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "שומר..." : "שייך"}
          </button>
          <button type="button" onClick={onClose} style={{ flex: 1, height: 44, background: `${C.outlineVar}33`, border: "none", borderRadius: 12, color: C.onSurface, fontSize: 14, cursor: "pointer" }}>
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}
