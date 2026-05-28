"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, PROFESSIONS } from "@/lib/options";
import { C, adminInput } from "./constants";
import { labelOf } from "./helpers";
import { AssignPageModal } from "./AssignPageModal";
import type { LandingPage, Pro } from "./types";

export function PagesTab({ pages: initPages, pros }: { pages: LandingPage[]; pros: Pro[] }) {
  const router = useRouter();
  const [search, setSearch]       = useState("");
  const [pages, setPages]         = useState(initPages);
  const [assigning, setAssigning] = useState<LandingPage | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LandingPage | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleDelete(page: LandingPage) {
    setDeleting(page.id);
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.id}`, { method: "DELETE" });
      if (res.ok) { setPages(prev => prev.filter(p => p.id !== page.id)); setExpandedId(null); }
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  }

  const filtered = pages.filter((p) => {
    const q = search.toLowerCase();
    return p.mainTitle.toLowerCase().includes(q) ||
      labelOf(CITIES, p.city).includes(q) ||
      `${p.pro.firstName} ${p.pro.lastName}`.toLowerCase().includes(q);
  });

  function handleAssigned(pageId: string, proId: string) {
    const newPro = pros.find(p => p.id === proId);
    if (!newPro) return;
    setPages(prev => prev.map(p =>
      p.id === pageId
        ? { ...p, pro: { id: newPro.id, firstName: newPro.firstName, lastName: newPro.lastName, phone: newPro.phone } }
        : p
    ));
    setAssigning(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: C.onSurfVar }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש דפי נחיתה..." style={{ ...adminInput, paddingRight: "2.5rem", height: 40, borderRadius: 12 }} />
        </div>
        <button
          onClick={() => router.push("/admin/landing-pages/new")}
          style={{ flexShrink: 0, height: 40, padding: "0 16px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.secondary},${C.primary})`, color: "#150830", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          הוסף דף
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(page => {
          const open = expandedId === page.id;
          return (
            <div key={page.id} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${open ? C.primary + "55" : C.outlineVar + "33"}`, transition: "border-color 0.2s" }}>
              {/* Summary row — clickable */}
              <div
                className="pro-glass"
                onClick={() => setExpandedId(open ? null : page.id)}
                style={{ padding: "12px 16px", cursor: "pointer", borderRight: `3px solid ${C.primary}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: C.onSurface, margin: 0 }}>{page.mainTitle}</p>
                  <p style={{ fontSize: 12, color: C.onSurfVar, margin: "3px 0 0" }}>
                    {labelOf(CITIES, page.city)} · {labelOf(PROFESSIONS, page.profession)}
                  </p>
                  <p style={{ fontSize: 11, color: C.primary, margin: "2px 0 0", display: "flex", alignItems: "center", gap: 3 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>engineering</span>
                    {page.pro.firstName} {page.pro.lastName}
                  </p>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.onSurfVar, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>expand_more</span>
              </div>

              {/* Expanded actions */}
              {open && (
                <div style={{ padding: "14px 16px", background: `${C.surfHigh}99`, borderTop: `1px solid ${C.outlineVar}33`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <p style={{ width: "100%", fontSize: 11, color: C.onSurfVar, margin: "0 0 4px", fontFamily: "monospace" }}>
                    {page.twilioNumber}
                  </p>
                  <a
                    href={`/${page.profession}/${page.city}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.tertiary}44`, background: `${C.tertiary}0e`, color: C.tertiary, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                    צפה באתר
                  </a>
                  <button
                    onClick={e => { e.stopPropagation(); router.push(`/admin/pros/${page.pro.id}/edit`); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.primary}44`, background: `${C.primary}0e`, color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit_square</span>
                    ערוך אתר
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setAssigning(page); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.outlineVar}44`, background: C.surfHigh, color: C.onSurfVar, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>swap_horiz</span>
                    שייך נציג
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteConfirm(page); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.error}44`, background: `${C.error}0e`, color: C.error, fontSize: 12, fontWeight: 700, cursor: "pointer", marginRight: "auto" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "32px 0" }}>לא נמצאו דפי נחיתה</p>
        )}
      </div>

      {assigning && (
        <AssignPageModal page={assigning} pros={pros} onClose={() => setAssigning(null)} onAssigned={handleAssigned} />
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div className="pro-glass" style={{ borderRadius: 20, padding: "28px 24px", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: C.error, fontVariationSettings: "'FILL' 1" }}>delete_forever</span>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.onSurface, margin: "12px 0 6px" }}>מחיקת דף נחיתה</p>
            <p style={{ fontSize: 13, color: C.onSurfVar, marginBottom: 24 }}>
              האם למחוק את <b style={{ color: C.onSurface }}>{deleteConfirm.mainTitle}</b>?<br />פעולה זו אינה ניתנת לביטול.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, height: 40, borderRadius: 10, border: `1px solid ${C.outlineVar}44`, background: C.surfHigh, color: C.onSurfVar, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                ביטול
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting === deleteConfirm.id}
                style={{ flex: 1, height: 40, borderRadius: 10, border: "none", background: C.error, color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}
              >
                {deleting === deleteConfirm.id ? "מוחק..." : "מחק"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
