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

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(page => (
          <div key={page.id} className="pro-glass" style={{ borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: C.onSurface }}>{page.mainTitle}</p>
                <p style={{ fontSize: 12, color: C.onSurfVar, marginTop: 2 }}>
                  {labelOf(CITIES, page.city)} / {labelOf(PROFESSIONS, page.profession)} · <span style={{ fontFamily: "monospace" }}>{page.twilioNumber}</span>
                </p>
                <p style={{ fontSize: 11, color: C.primary, marginTop: 3 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, verticalAlign: "middle", marginLeft: 3 }}>engineering</span>
                  {page.pro.firstName} {page.pro.lastName}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <a
                  href={`/${page.profession}/${page.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 36, padding: "0 12px", borderRadius: 10, border: `1px solid ${C.tertiary}44`, background: `${C.tertiary}0e`, color: C.tertiary, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                  צפה באתר
                </a>
                <button
                  onClick={() => router.push(`/admin/pros/${page.pro.id}/edit`)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 36, padding: "0 12px", borderRadius: 10, border: `1px solid ${C.primary}44`, background: `${C.primary}0e`, color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit_square</span>
                  ערוך אתר
                </button>
                <button
                  onClick={() => setAssigning(page)}
                  style={{ height: 36, padding: "0 14px", background: C.surfHigh, border: `1px solid ${C.outlineVar}44`, borderRadius: 10, color: C.onSurfVar, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  שייך נציג
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: C.onSurfVar, padding: "32px 0" }}>לא נמצאו דפי נחיתה</p>
        )}
      </div>

      {assigning && (
        <AssignPageModal page={assigning} pros={pros} onClose={() => setAssigning(null)} onAssigned={handleAssigned} />
      )}
    </div>
  );
}
