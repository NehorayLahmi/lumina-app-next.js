"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, PROFESSIONS } from "@/lib/options";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryItem { url: string; publicId: string; }
interface ProOption   { id: string; firstName: string; lastName: string; phone: string; city: string; profession: string; }

interface FormState {
  mainTitle: string;
  subTitle: string;
  description: string;
  twilioNumber: string;
  city: string;
  profession: string;
  proId: string;
  heroImage: string;
  heroPublicId: string;
  profileImage: string;
  profilePublicId: string;
  gallery: GalleryItem[];
  isDraft: boolean;
}

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#15171c", surface: "#1c1e24", surfaceVar: "#21242b",
  primary: "#deb9f4", secondary: "#c89af0", tertiary: "#00daf7",
  error: "#ffb4ab", success: "#6df5b8",
  onSurface: "#f0deff", outlineVar: "#3a3d46",
  overlay: "rgba(15,17,20,0.92)", adminAccent: "#fface8",
};

// ─── Shared UI ────────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.outlineVar}44`, borderRadius: 20, padding: "20px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 20 }}>{icon}</span>
        <span style={{ color: C.onSurface, fontWeight: 700, fontSize: 15 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%", background: `${C.surfaceVar}cc`, border: `1px solid ${C.outlineVar}88`,
  borderRadius: 12, color: C.onSurface, fontSize: 14, padding: "12px 14px",
  direction: "rtl", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};

function StyledInput({ label, value, onChange, multiline, rows, placeholder, type }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows ?? 4} placeholder={placeholder} style={{ ...baseInput, resize: "vertical" }} />
        : <input type={type ?? "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={baseInput} />
      }
    </div>
  );
}

function StyledSelect({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...baseInput, appearance: "none", cursor: "pointer" }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ImageUploadSlot({ label, imageUrl, uploading, onUpload, onDelete }: {
  label: string; imageUrl: string; uploading: boolean;
  onUpload: (f: File) => void; onDelete: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.secondary, fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>{label}</label>
      <div
        style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: 14, overflow: "hidden", border: imageUrl ? `1px solid ${C.outlineVar}55` : `2px dashed ${C.outlineVar}88`, background: imageUrl ? "transparent" : `${C.surfaceVar}88`, cursor: uploading ? "default" : "pointer" }}
        onClick={() => !uploading && ref.current?.click()}
      >
        {imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={imageUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: C.outlineVar, fontSize: 36 }}>add_photo_alternate</span>
              <span style={{ color: C.outlineVar, fontSize: 12 }}>לחץ להעלאת תמונה</span>
            </div>
          )
        }
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, border: `2.5px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: C.tertiary, fontSize: 13 }}>מעלה...</span>
          </div>
        )}
        {imageUrl && !uploading && (
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => ref.current?.click()} style={actionBtn(C.tertiary)}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span></button>
            <button onClick={onDelete} style={actionBtn(C.error)}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span></button>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
    </div>
  );
}

function actionBtn(color: string): React.CSSProperties {
  return { width: 32, height: 32, borderRadius: 8, border: "none", background: C.overlay, backdropFilter: "blur(8px)", color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
}

function GalleryGrid({ items, onAdd, onDelete, addingIdx }: {
  items: GalleryItem[]; onAdd: (f: File) => void; onDelete: (i: number) => void; addingIdx: number | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {items.map((item, idx) => (
        <div key={item.publicId || idx} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.outlineVar}44` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={`gallery-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button onClick={() => onDelete(idx)} style={{ position: "absolute", top: 5, right: 5, width: 28, height: 28, borderRadius: 7, border: "none", background: C.overlay, backdropFilter: "blur(8px)", color: C.error, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
      ))}
      {addingIdx !== null && (
        <div style={{ aspectRatio: "1/1", borderRadius: 12, border: `1px dashed ${C.tertiary}66`, background: `${C.surfaceVar}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 20, height: 20, border: `2px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}
      {items.length < 10 && addingIdx === null && (
        <button onClick={() => ref.current?.click()} style={{ aspectRatio: "1/1", borderRadius: 12, border: `2px dashed ${C.outlineVar}88`, background: `${C.surfaceVar}55`, color: C.outlineVar, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>add_photo_alternate</span>
          <span style={{ fontSize: 11 }}>{10 - items.length} נותרו</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onAdd(f); e.target.value = ""; }} />
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", background: type === "success" ? "linear-gradient(135deg,#1f3a2e,#0d2b22)" : "linear-gradient(135deg,#3a1f1f,#2b0d0d)", border: `1px solid ${type === "success" ? C.success : C.error}44`, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, zIndex: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, color: type === "success" ? C.success : C.error }}>{type === "success" ? "check_circle" : "error"}</span>
      <span style={{ color: C.onSurface, fontSize: 13 }}>{msg}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminCreatePageForm() {
  const router = useRouter();

  const [pros, setPros]             = useState<ProOption[]>([]);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [heroUploading, setHeroUploading]       = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [galleryAddingIdx, setGalleryAddingIdx] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    mainTitle: "", subTitle: "", description: "",
    twilioNumber: "", city: "", profession: "", proId: "",
    heroImage: "", heroPublicId: "",
    profileImage: "", profilePublicId: "",
    gallery: [],
    isDraft: false,
  });

  useEffect(() => {
    fetch("/api/admin/pros")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPros(d); })
      .catch(() => {});
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Upload helpers ────────────────────────────────────────────────────────
  async function uploadFile(file: File): Promise<{ secure_url: string; public_id: string } | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("proId", form.proId || "new");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) { showToast("שגיאה בהעלאת תמונה", "error"); return null; }
    return res.json();
  }

  async function deleteFile(publicId: string) {
    if (!publicId) return;
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, proId: form.proId || "new" }),
    });
  }

  async function handleHeroUpload(file: File) {
    setHeroUploading(true);
    const old = form.heroPublicId;
    const result = await uploadFile(file);
    if (result) {
      if (old) await deleteFile(old);
      setForm(f => ({ ...f, heroImage: result.secure_url, heroPublicId: result.public_id }));
    }
    setHeroUploading(false);
  }
  async function handleHeroDelete() {
    if (form.heroPublicId) await deleteFile(form.heroPublicId);
    setForm(f => ({ ...f, heroImage: "", heroPublicId: "" }));
  }

  async function handleProfileUpload(file: File) {
    setProfileUploading(true);
    const old = form.profilePublicId;
    const result = await uploadFile(file);
    if (result) {
      if (old) await deleteFile(old);
      setForm(f => ({ ...f, profileImage: result.secure_url, profilePublicId: result.public_id }));
    }
    setProfileUploading(false);
  }
  async function handleProfileDelete() {
    if (form.profilePublicId) await deleteFile(form.profilePublicId);
    setForm(f => ({ ...f, profileImage: "", profilePublicId: "" }));
  }

  async function handleGalleryAdd(file: File) {
    setGalleryAddingIdx(form.gallery.length);
    const result = await uploadFile(file);
    if (result) setForm(f => ({ ...f, gallery: [...f.gallery, { url: result.secure_url, publicId: result.public_id }] }));
    setGalleryAddingIdx(null);
  }
  async function handleGalleryDelete(idx: number) {
    const item = form.gallery[idx];
    if (item.publicId) await deleteFile(item.publicId);
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.mainTitle.trim() || !form.twilioNumber.trim() || !form.city || !form.profession || !form.proId) {
      showToast("נא למלא את כל שדות החובה", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainTitle: form.mainTitle,
          subTitle: form.subTitle,
          description: form.description,
          twilioNumber: form.twilioNumber,
          city: form.city,
          profession: form.profession,
          proId: form.proId,
          heroImage: form.heroImage || "",
          profileImage: form.profileImage || null,
          galleryImages: JSON.stringify(form.gallery),
          isDraft: form.isDraft,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.message ?? "שגיאה ביצירת הדף", "error");
      } else {
        router.push("/admin?tab=pages");
      }
    } finally {
      setSaving(false);
    }
  }

  const Spinner = () => (
    <div style={{ width: 18, height: 18, border: `2.5px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  );

  function handleProChange(proId: string) {
    const pro = pros.find(p => p.id === proId);
    setForm(f => ({
      ...f,
      proId,
      city:         pro?.city       ?? f.city,
      profession:   pro?.profession ?? f.profession,
      twilioNumber: pro?.phone      ?? f.twilioNumber,
    }));
  }

  const proOptions = pros.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName} · ${p.city}` }));

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        textarea:focus, input:focus, select:focus { box-shadow: 0 0 0 2px ${C.tertiary}44; }
        select option { background: ${C.surface}; color: ${C.onSurface}; }
      `}</style>

      <div dir="rtl" style={{ minHeight: "100svh", background: C.bg, fontFamily: "var(--font-outfit, sans-serif)" }}>

        {/* ── Header ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: `${C.bg}e8`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.outlineVar}33`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
          <button onClick={() => router.push("/admin?tab=pages")} style={{ background: "none", border: "none", color: C.adminAccent, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            דפים
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-outlined" style={{ color: C.adminAccent, fontSize: 16, fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <span style={{ color: C.onSurface, fontWeight: 700, fontSize: 15 }}>יצירת דף נחיתה חדש</span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: saving ? C.outlineVar : `linear-gradient(135deg,${C.adminAccent},${C.primary})`, color: "#150830", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving ? <><Spinner />שומר...</> : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>שמור</>}
          </button>
        </div>

        {/* Admin badge */}
        <div style={{ padding: "10px 20px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.adminAccent}11`, border: `1px solid ${C.adminAccent}33`, borderRadius: 20, padding: "5px 12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.adminAccent, fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span style={{ color: C.adminAccent, fontSize: 11, fontWeight: 700 }}>מצב מנהל — יצירת דף חדש</span>
          </div>
        </div>

        {/* ── Form ── */}
        <div style={{ padding: "16px 16px 100px" }}>

          {/* Assign Pro — first so selecting a pro auto-fills city/profession/phone */}
          <SectionCard title="שיוך נציג" icon="engineering">
            <StyledSelect
              label="נציג *"
              value={form.proId}
              onChange={handleProChange}
              options={proOptions}
              placeholder={pros.length === 0 ? "טוען נציגים..." : "בחר נציג..."}
            />

          </SectionCard>

          {/* Content */}
          <SectionCard title="תוכן הדף" icon="text_fields">
            <StyledInput label="כותרת ראשית *" value={form.mainTitle} onChange={v => setForm(f => ({ ...f, mainTitle: v }))} placeholder="למשל: שירות אינסטלציה מקצועי בתל אביב" />
            <StyledInput label="כותרת משנה" value={form.subTitle} onChange={v => setForm(f => ({ ...f, subTitle: v }))} placeholder="למשל: זמין 24/7 · מחירים הוגנים" />
            <StyledInput label="תיאור" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline rows={5} placeholder="תיאור מפורט של השירותים..." />
          </SectionCard>

          {/* Settings — auto-filled from pro, editable if needed */}
          <SectionCard title="הגדרות עמוד" icon="settings">
            <StyledSelect label="עיר *" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} options={CITIES} placeholder="בחר עיר..." />
            <StyledSelect label="מקצוע *" value={form.profession} onChange={v => setForm(f => ({ ...f, profession: v }))} options={PROFESSIONS} placeholder="בחר מקצוע..." />
          </SectionCard>

          {/* Phone — auto-filled from pro, editable */}
          <SectionCard title="מספר טלפון" icon="call">
            <StyledInput label="מספר טלפון *" value={form.twilioNumber} onChange={v => setForm(f => ({ ...f, twilioNumber: v }))} placeholder="לדוגמה: 0539596094" />
            <p style={{ color: `${C.onSurface}66`, fontSize: 11, margin: "-8px 0 0", lineHeight: 1.5 }}>
              המספר יוצג בדף הנחיתה ולקוחות יוכלו להתקשר ישירות.
            </p>
            {/* twilioNumber — השדה שמור עם שם זה ב-DB, מכיל כרגע מספר אמיתי של הנציג */}
          </SectionCard>

          {/* Hero image */}
          <SectionCard title="תמונת כיסוי" icon="panorama">
            <ImageUploadSlot label="תמונה ראשית (Hero) — PNG / JPEG / WEBP עד 5MB" imageUrl={form.heroImage} uploading={heroUploading} onUpload={handleHeroUpload} onDelete={handleHeroDelete} />
          </SectionCard>

          {/* Profile image */}
          <SectionCard title="תמונת פרופיל" icon="account_circle">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{ position: "relative", width: 100, height: 100, borderRadius: 16, overflow: "hidden", border: form.profileImage ? `1px solid ${C.outlineVar}55` : `2px dashed ${C.outlineVar}88`, background: `${C.surfaceVar}88`, flexShrink: 0, cursor: profileUploading ? "default" : "pointer" }}
                onClick={() => !profileUploading && document.getElementById("createProfileInput")?.click()}
              >
                {form.profileImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={form.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ color: C.outlineVar, fontSize: 32 }}>add_a_photo</span></div>
                }
                {profileUploading && (
                  <div style={{ position: "absolute", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, border: `2px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: `${C.onSurface}99`, fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>תמונת הפרופיל מוצגת על דף הנחיתה לצד המידע של הנציג.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => document.getElementById("createProfileInput")?.click()} disabled={profileUploading} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.tertiary}66`, background: `${C.tertiary}11`, color: C.tertiary, fontSize: 12, cursor: "pointer" }}>
                    {form.profileImage ? "שנה תמונה" : "העלה תמונה"}
                  </button>
                  {form.profileImage && (
                    <button onClick={handleProfileDelete} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.error}44`, background: `${C.error}11`, color: C.error, fontSize: 12, cursor: "pointer" }}>מחק</button>
                  )}
                </div>
              </div>
            </div>
            <input id="createProfileInput" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleProfileUpload(f); e.target.value = ""; }} />
          </SectionCard>

          {/* Draft toggle */}
          <SectionCard title="הגדרות פרסום" icon="visibility">
            <div
              onClick={() => setForm(f => ({ ...f, isDraft: !f.isDraft }))}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 14px", borderRadius: 12, border: `1px solid ${form.isDraft ? "rgba(255,184,0,0.35)" : C.outlineVar + "55"}`, background: form.isDraft ? "rgba(255,184,0,0.06)" : `${C.surfaceVar}55`, transition: "all 0.2s" }}
            >
              <div>
                <p style={{ color: C.onSurface, fontWeight: 700, fontSize: 14, margin: 0 }}>מצב טיוטה</p>
                <p style={{ color: `${C.onSurface}77`, fontSize: 12, margin: "2px 0 0" }}>
                  {form.isDraft ? "הדף לא יופיע בחיפוש גוגל ולא ב-sitemap" : "הדף יהיה פעיל ויסרוק על ידי גוגל"}
                </p>
              </div>
              <div style={{ width: 44, height: 26, borderRadius: 999, background: form.isDraft ? "rgba(255,184,0,0.4)" : C.outlineVar, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, width: 20, height: 20, borderRadius: "50%", background: form.isDraft ? "#ffb800" : C.onSurfVar, transition: "all 0.2s", right: form.isDraft ? 3 : 21 }} />
              </div>
            </div>
          </SectionCard>

          {/* Gallery */}
          <SectionCard title={`גלריה (${form.gallery.length}/10)`} icon="collections">
            <p style={{ color: `${C.onSurface}77`, fontSize: 12, margin: "0 0 14px", lineHeight: 1.5 }}>הוסף עד 10 תמונות לגלריה. לחץ ✕ למחיקת תמונה.</p>
            <GalleryGrid items={form.gallery} onAdd={handleGalleryAdd} onDelete={handleGalleryDelete} addingIdx={galleryAddingIdx} />
          </SectionCard>

          {/* Floating save bar */}
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: `${C.bg}e8`, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.outlineVar}33`, zIndex: 50 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: saving ? C.outlineVar : `linear-gradient(135deg,${C.adminAccent},${C.primary})`, color: "#150830", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {saving
                ? <><Spinner />יוצר דף...</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span>צור דף נחיתה</>}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}
