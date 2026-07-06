"use client";

import { useState } from "react";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput, adminSelect } from "./constants";
import { Modal, ModalField } from "./Modal";

function toSlug(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function ComboField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [custom, setCustom] = useState(() => value !== "" && !options.some(o => o.value === value));
  return (
    <ModalField label={label}>
      <select
        style={adminSelect}
        value={custom ? "__custom__" : value}
        onChange={e => {
          if (e.target.value === "__custom__") { setCustom(true); onChange(""); }
          else { setCustom(false); onChange(e.target.value); }
        }}
      >
        <option value="">בחר...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        <option value="__custom__">✏️ אחר...</option>
      </select>
      {custom && (
        <input
          style={{ ...adminInput, marginTop: 6, direction: "ltr" }}
          dir="ltr"
          value={value}
          onChange={e => onChange(toSlug(e.target.value))}
          placeholder="slug באנגלית, לדוגמה: herzliya-pituah"
        />
      )}
    </ModalField>
  );
}

export function CreateProModal({ onClose, onCreated }: {
  onClose: () => void; onCreated: () => void;
}) {
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "", phone: "",
    city: CITIES[0].value, profession: PROFESSIONS[0].value, pricePerLead: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(v => ({ ...v, [k]: k === "pricePerLead" ? Number(e.target.value) : e.target.value }));

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault(); setSaving(true); setError("");
    const res = await fetch("/api/admin/pros", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) { onCreated(); } else { const d = await res.json(); setError(d.message ?? "שגיאה"); }
    setSaving(false);
  }

  return (
    <Modal title="הוספת נציג חדש" onClose={onClose}>
      <form onSubmit={submit}>
        <ModalField label="אימייל"><input style={adminInput} type="email" value={form.email} onChange={f("email")} required /></ModalField>
        <ModalField label="סיסמה"><input style={adminInput} type="password" value={form.password} onChange={f("password")} required minLength={6} /></ModalField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ModalField label="שם פרטי"><input style={adminInput} value={form.firstName} onChange={f("firstName")} required /></ModalField>
          <ModalField label="שם משפחה"><input style={adminInput} value={form.lastName} onChange={f("lastName")} required /></ModalField>
        </div>
        <ModalField label="טלפון"><input style={adminInput} value={form.phone} onChange={f("phone")} required /></ModalField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ComboField label="עיר" value={form.city} onChange={v => setForm(fv => ({ ...fv, city: v }))} options={CITIES} />
          <ComboField label="מקצוע" value={form.profession} onChange={v => setForm(fv => ({ ...fv, profession: v }))} options={PROFESSIONS} />
        </div>
        <ModalField label="מחיר לליד (₪)">
          <input style={adminInput} type="number" min="0" value={form.pricePerLead} onChange={f("pricePerLead")} />
        </ModalField>
        {error && <p style={{ color: C.error, fontSize: 13, marginBottom: 8 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={saving} style={{ flex: 1, height: 44, background: `linear-gradient(135deg,#00c46a,${C.tertiary})`, border: "none", borderRadius: 12, color: "#001f28", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "יוצר..." : "צור נציג"}
          </button>
          <button type="button" onClick={onClose} style={{ flex: 1, height: 44, background: `${C.outlineVar}33`, border: "none", borderRadius: 12, color: C.onSurface, fontSize: 14, cursor: "pointer" }}>
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}
