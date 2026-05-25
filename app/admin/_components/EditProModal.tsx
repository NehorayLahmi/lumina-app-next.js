"use client";

import { useState } from "react";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput, adminSelect } from "./constants";
import { Modal, ModalField } from "./Modal";
import type { Pro } from "./types";

export function EditProModal({ pro, onClose, onSaved }: {
  pro: Pro; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    firstName: pro.firstName, lastName: pro.lastName, phone: pro.phone,
    city: pro.city, profession: pro.profession, pricePerLead: pro.pricePerLead,
    telegramChatId: pro.telegramChatId ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(v => ({ ...v, [k]: k === "pricePerLead" ? Number(e.target.value) : e.target.value }));

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault(); setSaving(true); setError("");
    const res = await fetch(`/api/admin/pros/${pro.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) { onSaved(); } else { const d = await res.json(); setError(d.message ?? "שגיאה"); }
    setSaving(false);
  }

  return (
    <Modal title="עריכת נציג" onClose={onClose}>
      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ModalField label="שם פרטי"><input style={adminInput} value={form.firstName} onChange={f("firstName")} required /></ModalField>
          <ModalField label="שם משפחה"><input style={adminInput} value={form.lastName} onChange={f("lastName")} required /></ModalField>
        </div>
        <ModalField label="טלפון"><input style={adminInput} value={form.phone} onChange={f("phone")} required /></ModalField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ModalField label="עיר">
            <select style={adminSelect} value={form.city} onChange={f("city")}>
              {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </ModalField>
          <ModalField label="מקצוע">
            <select style={adminSelect} value={form.profession} onChange={f("profession")}>
              {PROFESSIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </ModalField>
        </div>
        <ModalField label="מחיר לליד (₪)">
          <input style={adminInput} type="number" min="0" value={form.pricePerLead} onChange={f("pricePerLead")} />
        </ModalField>
        <ModalField label="Telegram Chat ID">
          <input style={adminInput} value={form.telegramChatId} onChange={f("telegramChatId")} placeholder="ריק = שלח לברירת מחדל" />
        </ModalField>
        {error && <p style={{ color: C.error, fontSize: 13, marginBottom: 8 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={saving} style={{ flex: 1, height: 44, background: `linear-gradient(135deg,${C.primary},${C.tertiary})`, border: "none", borderRadius: 12, color: C.onPrimary, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "שומר..." : "שמור"}
          </button>
          <button type="button" onClick={onClose} style={{ flex: 1, height: 44, background: `${C.outlineVar}33`, border: "none", borderRadius: 12, color: C.onSurface, fontSize: 14, cursor: "pointer" }}>
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}
