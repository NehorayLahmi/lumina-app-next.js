"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput } from "./constants";
import { labelOf } from "./helpers";
import { AdminToggle } from "./AdminToggle";
import { EditProModal } from "./EditProModal";
import { CreateProModal } from "./CreateProModal";
import { DeleteConfirm } from "./DeleteConfirm";
import type { Pro } from "./types";

export function ProsTab({ pros, onRefresh }: { pros: Pro[]; onRefresh: () => void }) {
  const router = useRouter();
  const [search, setSearch]         = useState("");
  const [editing, setEditing]       = useState<Pro | null>(null);
  const [creating, setCreating]     = useState(false);
  const [deleting, setDeleting]     = useState<Pro | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr]   = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [msgProId, setMsgProId]     = useState<string | null>(null);
  const [msgText, setMsgText]       = useState("");
  const [msgBusy, setMsgBusy]       = useState(false);
  const [msgResult, setMsgResult]   = useState("");

  const sendMsg = async (proId: string) => {
    if (!msgText.trim()) return;
    setMsgBusy(true); setMsgResult("");
    try {
      const res  = await fetch(`/api/admin/telegram/send/${proId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText.trim() }),
      });
      const data = await res.json();
      if (res.ok) { setMsgResult("✅ נשלח"); setMsgText(""); }
      else        { setMsgResult(`❌ ${data.message ?? "שגיאה"}`); }
    } catch { setMsgResult("❌ שגיאת חיבור"); }
    setMsgBusy(false);
  };

  const openMsg = (pro: Pro) => {
    setMsgProId(msgProId === pro.id ? null : pro.id);
    setMsgText(""); setMsgResult("");
  };

  const filtered = pros.filter(p => {
    const q = search.toLowerCase();
    return `${p.firstName} ${p.lastName} ${p.user.email} ${p.phone}`.toLowerCase().includes(q) ||
      labelOf(CITIES, p.city).includes(q) || labelOf(PROFESSIONS, p.profession).includes(q);
  });

  async function toggle(pro: Pro) {
    setTogglingId(pro.id);
    await fetch(`/api/admin/pros/${pro.id}/toggle`, { method: "PATCH" });
    onRefresh();
    setTogglingId(null);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true); setDeleteErr("");
    const res = await fetch(`/api/admin/pros/${deleting.id}`, { method: "DELETE" });
    if (res.ok) { setDeleting(null); onRefresh(); }
    else { const d = await res.json(); setDeleteErr(d.message ?? "שגיאה"); }
    setDeleteBusy(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: C.onSurfVar }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש נציג..." style={{ ...adminInput, paddingRight: "2.5rem", height: 40, borderRadius: 12 }} />
        </div>
        <button onClick={() => setCreating(true)} style={{ height: 40, padding: "0 16px", background: `linear-gradient(135deg,#00c46a,${C.tertiary})`, border: "none", borderRadius: 12, color: "#001f28", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          + הוסף נציג
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(pro => (
          <div key={pro.id} className="pro-glass" style={{ borderRadius: 16, padding: "12px 16px", borderRight: `3px solid ${pro.adminLocked ? C.error : pro.isActive ? C.tertiary : C.outlineVar}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: C.onSurface }}>
                    {pro.firstName} {pro.lastName}
                  </span>
                  {pro.adminLocked && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: `${C.error}22`, color: C.error }}>נעול</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: C.onSurfVar, marginTop: 2 }}>{pro.user.email}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: C.onSurfVar }}>{labelOf(CITIES, pro.city)} · {labelOf(PROFESSIONS, pro.profession)}</span>
                  <span style={{ fontSize: 11, color: C.primary }}>₪{pro.pricePerLead}/ליד</span>
                  <span style={{ fontSize: 11, color: C.onSurfVar }}>{pro._count.leads}L · {pro._count.calls}C</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <AdminToggle on={pro.isActive} locked={pro.adminLocked} loading={togglingId === pro.id} onToggle={() => toggle(pro)} />
                <button onClick={() => router.push(`/admin/pros/${pro.id}/dashboard`)} style={{ background: "none", border: "none", cursor: "pointer", color: C.tertiary, fontSize: 11, fontWeight: 700, padding: "4px 6px" }}>דשבורד</button>
                <button onClick={() => setEditing(pro)} style={{ background: "none", border: "none", cursor: "pointer", color: C.onSurfVar, fontSize: 11, fontWeight: 700, padding: "4px 6px" }}>פרטים</button>
                {pro.telegramChatId && (
                  <button onClick={() => openMsg(pro)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }} title="שלח הודעה בטלגרם">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: msgProId === pro.id ? C.primary : C.onSurfVar, fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                )}
                <button onClick={() => { setDeleteErr(""); setDeleting(pro); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.error, fontSize: 11, fontWeight: 700, padding: "4px 6px" }}>מחיקה</button>
              </div>
            </div>
            {msgProId === pro.id && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <textarea
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  placeholder={`הודעה ל-${pro.firstName}...`}
                  rows={2}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.outlineVar}44`, borderRadius: 8, padding: "8px 10px", color: C.onSurface, fontSize: 12, resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => sendMsg(pro.id)}
                    disabled={msgBusy || !msgText.trim()}
                    style={{ background: `${C.primary}22`, border: `1px solid ${C.primary}44`, borderRadius: 8, padding: "5px 14px", color: C.primary, fontSize: 12, fontWeight: 700, cursor: msgBusy ? "not-allowed" : "pointer", opacity: msgBusy ? 0.6 : 1 }}
                  >
                    {msgBusy ? "שולח..." : "שלח"}
                  </button>
                  {msgResult && <span style={{ fontSize: 11, color: msgResult.startsWith("✅") ? C.tertiary : "#ffb4ab" }}>{msgResult}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "32px 0" }}>לא נמצאו נציגים</p>
        )}
      </div>

      {editing  && <EditProModal   pro={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onRefresh(); }} />}
      {creating && <CreateProModal onClose={() => setCreating(false)} onCreated={() => { setCreating(false); onRefresh(); }} />}
      {deleting && <DeleteConfirm  name={`${deleting.firstName} ${deleting.lastName}`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} busy={deleteBusy} errorMsg={deleteErr} />}
    </div>
  );
}
