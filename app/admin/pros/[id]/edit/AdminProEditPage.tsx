"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryItem { url: string; publicId: string; }

interface LandingPage {
  id: string;
  city: string;
  profession: string;
  mainTitle: string;
  subTitle: string;
  description: string;
  heroImage: string;
  profileImage: string | null;
  galleryImages: string;
  twilioNumber: string;
  updatedAt: string;
}

interface ProInfo {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  profession: string;
}

interface FormState {
  mainTitle: string;
  subTitle: string;
  description: string;
  twilioNumber: string;
  heroImage: string;
  heroPublicId: string;
  profileImage: string;
  profilePublicId: string;
  gallery: GalleryItem[];
}

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#15171c",
  surface: "#1c1e24",
  surfaceVar: "#21242b",
  primary: "#deb9f4",
  secondary: "#c89af0",
  tertiary: "#00daf7",
  error: "#ffb4ab",
  success: "#6df5b8",
  onSurface: "#f0deff",
  outlineVar: "#3a3d46",
  overlay: "rgba(15,17,20,0.92)",
  adminAccent: "#fface8",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseGallery(raw: string): GalleryItem[] {
  try {
    const arr = JSON.parse(raw || "[]");
    if (!Array.isArray(arr)) return [];
    return arr.map((item) =>
      typeof item === "string" ? { url: item, publicId: "" } : (item as GalleryItem)
    );
  } catch { return []; }
}

function publicIdFromUrl(url: string): string {
  if (!url || !url.includes("cloudinary.com")) return "";
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?(?:\?.*)?$/i);
  return match?.[1] ?? "";
}

// ─── Shared UI sub-components ─────────────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.outlineVar}44`, borderRadius: 20, padding: "20px 20px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 20 }}>{icon}</span>
        <span style={{ color: C.onSurface, fontWeight: 700, fontSize: 15 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function StyledInput({ label, value, onChange, multiline, rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string;
}) {
  const base: React.CSSProperties = {
    width: "100%", background: `${C.surfaceVar}cc`, border: `1px solid ${C.outlineVar}88`,
    borderRadius: 12, color: C.onSurface, fontSize: 14, padding: "12px 14px",
    direction: "rtl", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 4} placeholder={placeholder} style={base} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function ImageUploadSlot({ label, imageUrl, uploading, onUpload, onDelete }: {
  label: string; imageUrl: string; uploading: boolean;
  onUpload: (f: File) => void; onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.secondary, fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>{label}</label>
      <div
        style={{ position: "relative", width: "100%", aspectRatio: "16/7", borderRadius: 14, overflow: "hidden", border: imageUrl ? `1px solid ${C.outlineVar}55` : `2px dashed ${C.outlineVar}88`, background: imageUrl ? "transparent" : `${C.surfaceVar}88`, cursor: uploading ? "default" : "pointer" }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: C.outlineVar, fontSize: 36 }}>add_photo_alternate</span>
            <span style={{ color: C.outlineVar, fontSize: 12 }}>לחץ להעלאת תמונה</span>
          </div>
        )}
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, border: `2.5px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: C.tertiary, fontSize: 13 }}>מעלה...</span>
          </div>
        )}
        {imageUrl && !uploading && (
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => inputRef.current?.click()} style={actionBtn(C.tertiary)}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span></button>
            <button onClick={onDelete} style={actionBtn(C.error)}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span></button>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
    </div>
  );
}

function actionBtn(color: string): React.CSSProperties {
  return { width: 32, height: 32, borderRadius: 8, border: "none", background: C.overlay, backdropFilter: "blur(8px)", color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
}

function GalleryGrid({ items, onAdd, onDelete, addingIdx }: {
  items: GalleryItem[]; onAdd: (f: File) => void; onDelete: (i: number) => void; addingIdx: number | null;
}) {
  const addRef = useRef<HTMLInputElement>(null);
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
        <button onClick={() => addRef.current?.click()} style={{ aspectRatio: "1/1", borderRadius: 12, border: `2px dashed ${C.outlineVar}88`, background: `${C.surfaceVar}55`, color: C.outlineVar, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>add_photo_alternate</span>
          <span style={{ fontSize: 11 }}>{10 - items.length} נותרו</span>
        </button>
      )}
      <input ref={addRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onAdd(f); e.target.value = ""; }} />
    </div>
  );
}

function PageTabs({ pages, selected, onSelect }: { pages: LandingPage[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ overflowX: "auto", display: "flex", gap: 8, padding: "0 20px 12px", scrollbarWidth: "none" }}>
      {pages.map((p) => {
        const active = p.id === selected;
        return (
          <button key={p.id} onClick={() => onSelect(p.id)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1px solid ${active ? C.primary : C.outlineVar}66`, background: active ? `${C.primary}22` : "transparent", color: active ? C.primary : C.onSurface, fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
            {p.profession} · {p.city}
          </button>
        );
      })}
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
export default function AdminProEditPage({ proId }: { proId: string }) {
  const router = useRouter();

  const [pro, setPro]           = useState<ProInfo | null>(null);
  const [pages, setPages]       = useState<LandingPage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [heroUploading, setHeroUploading]       = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [galleryAddingIdx, setGalleryAddingIdx] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    mainTitle: "", subTitle: "", description: "",
    twilioNumber: "",
    heroImage: "", heroPublicId: "",
    profileImage: "", profilePublicId: "",
    gallery: [],
  });

  // ── Load pro info + pages on mount ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [proRes, pagesRes] = await Promise.all([
          fetch(`/api/admin/pros/${proId}`),
          fetch(`/api/admin/pros/${proId}/landing-pages`),
        ]);
        const [proData, pagesData] = await Promise.all([proRes.json(), pagesRes.json()]);
        if (proRes.ok) setPro(proData);
        if (pagesRes.ok && Array.isArray(pagesData)) {
          setPages(pagesData);
          if (pagesData.length > 0) selectPage(pagesData[0]);
        } else {
          showToast("שגיאה בטעינת הדפים", "error");
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proId]);

  function selectPage(page: LandingPage) {
    setSelectedId(page.id);
    setForm({
      mainTitle: page.mainTitle,
      subTitle: page.subTitle,
      description: page.description,
      twilioNumber: page.twilioNumber,
      heroImage: page.heroImage,
      heroPublicId: publicIdFromUrl(page.heroImage),
      profileImage: page.profileImage ?? "",
      profilePublicId: publicIdFromUrl(page.profileImage ?? ""),
      gallery: parseGallery(page.galleryImages),
    });
  }

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Upload helpers (admin routes include proId) ────────────────────────────
  async function uploadFile(file: File): Promise<{ secure_url: string; public_id: string } | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("proId", proId);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const d = await res.json();
      showToast(d.message ?? "שגיאה בהעלאה", "error");
      return null;
    }
    return res.json();
  }

  async function deleteFile(publicId: string) {
    if (!publicId) return;
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, proId }),
    });
  }

  async function handleHeroUpload(file: File) {
    setHeroUploading(true);
    const old = form.heroPublicId;
    const result = await uploadFile(file);
    if (result) {
      if (old) await deleteFile(old);
      setForm((f) => ({ ...f, heroImage: result.secure_url, heroPublicId: result.public_id }));
    }
    setHeroUploading(false);
  }
  async function handleHeroDelete() {
    if (form.heroPublicId) await deleteFile(form.heroPublicId);
    setForm((f) => ({ ...f, heroImage: "", heroPublicId: "" }));
  }

  async function handleProfileUpload(file: File) {
    setProfileUploading(true);
    const old = form.profilePublicId;
    const result = await uploadFile(file);
    if (result) {
      if (old) await deleteFile(old);
      setForm((f) => ({ ...f, profileImage: result.secure_url, profilePublicId: result.public_id }));
    }
    setProfileUploading(false);
  }
  async function handleProfileDelete() {
    if (form.profilePublicId) await deleteFile(form.profilePublicId);
    setForm((f) => ({ ...f, profileImage: "", profilePublicId: "" }));
  }

  async function handleGalleryAdd(file: File) {
    setGalleryAddingIdx(form.gallery.length);
    const result = await uploadFile(file);
    if (result) {
      setForm((f) => ({ ...f, gallery: [...f.gallery, { url: result.secure_url, publicId: result.public_id }] }));
    }
    setGalleryAddingIdx(null);
  }
  async function handleGalleryDelete(idx: number) {
    const item = form.gallery[idx];
    if (item.publicId) await deleteFile(item.publicId);
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pros/${proId}/landing-pages/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainTitle: form.mainTitle,
          subTitle: form.subTitle,
          description: form.description,
          twilioNumber: form.twilioNumber,
          heroImage: form.heroImage,
          profileImage: form.profileImage || null,
          galleryImages: JSON.stringify(form.gallery),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.message ?? "שגיאה בשמירה", "error");
      } else {
        await res.json();
        router.push("/admin?tab=pages");
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Spinner util ───────────────────────────────────────────────────────────
  const Spinner = () => (
    <div style={{ width: 18, height: 18, border: `2.5px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div dir="rtl" style={{ minHeight: "100svh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Spinner />
        <span style={{ color: C.onSurface, fontSize: 15 }}>טוען נתוני נציג...</span>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div dir="rtl" style={{ minHeight: "100svh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 56, color: C.outlineVar }}>web_asset_off</span>
        <p style={{ color: C.onSurface, fontSize: 17, fontWeight: 700, margin: 0 }}>אין דפי נחיתה לנציג זה</p>
        {pro && <p style={{ color: `${C.onSurface}88`, fontSize: 14, margin: 0 }}>{pro.firstName} {pro.lastName}</p>}
        <button onClick={() => router.push(`/admin/pros/${proId}/dashboard`)} style={{ marginTop: 8, padding: "10px 24px", borderRadius: 12, border: `1px solid ${C.outlineVar}`, background: "transparent", color: C.primary, fontSize: 14, cursor: "pointer" }}>
          חזרה לדשבורד
        </button>
      </div>
    );
  }

  const currentPage = pages.find((x) => x.id === selectedId);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        textarea:focus, input:focus { box-shadow: 0 0 0 2px ${C.tertiary}44; }
      `}</style>

      <div dir="rtl" style={{ minHeight: "100svh", background: C.bg, fontFamily: "var(--font-outfit, sans-serif)" }}>

        {/* ── Header ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(30,32,40,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.outlineVar}55`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>

          {/* Back to admin */}
          <button onClick={() => router.push(`/admin/pros/${proId}/dashboard`)} style={{ background: "none", border: "none", color: C.adminAccent, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            ניהול
          </button>

          {/* Title + pro name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="material-symbols-outlined" style={{ color: C.adminAccent, fontSize: 16, fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
              <span style={{ color: C.onSurface, fontWeight: 700, fontSize: 15 }}>עריכת אתר נציג</span>
            </div>
            {pro && (
              <span style={{ color: `${C.onSurface}77`, fontSize: 11 }}>{pro.firstName} {pro.lastName}</span>
            )}
          </div>

          {/* Actions: view site + save */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {currentPage && (
              <a
                href={`/${currentPage.profession}/${currentPage.city}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: 36, padding: "0 12px", borderRadius: 10, border: `1px solid ${C.tertiary}55`, background: `${C.tertiary}11`, color: C.tertiary, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                צפה באתר
              </a>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !selectedId}
              style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: saving ? C.outlineVar : `linear-gradient(135deg,${C.adminAccent},${C.primary})`, color: "#150830", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              {saving ? <><Spinner />שומר...</> : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>שמור</>}
            </button>
          </div>
        </div>

        {/* Admin badge */}
        <div style={{ padding: "10px 20px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.adminAccent}11`, border: `1px solid ${C.adminAccent}33`, borderRadius: 20, padding: "5px 12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.adminAccent, fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span style={{ color: C.adminAccent, fontSize: 11, fontWeight: 700 }}>מצב עריכת מנהל — שינויים מיידיים</span>
          </div>
        </div>

        {/* ── Page tabs ── */}
        {pages.length > 1 && selectedId && (
          <div style={{ paddingTop: 12 }}>
            <PageTabs pages={pages} selected={selectedId} onSelect={(id) => { const p = pages.find((x) => x.id === id); if (p) selectPage(p); }} />
          </div>
        )}

        {/* ── Page info chip ── */}
        {currentPage && (
          <div style={{ padding: "8px 20px 0" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.surfaceVar, border: `1px solid ${C.outlineVar}44`, borderRadius: 20, padding: "5px 12px", marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.tertiary }}>language</span>
              <span style={{ color: `${C.onSurface}bb`, fontSize: 12 }}>{currentPage.profession} · {currentPage.city}</span>
            </div>
          </div>
        )}

        {/* ── Form ── */}
        <div style={{ padding: "4px 16px 100px" }}>

          <SectionCard title="תוכן הדף" icon="text_fields">
            <StyledInput label="כותרת ראשית" value={form.mainTitle} onChange={(v) => setForm((f) => ({ ...f, mainTitle: v }))} placeholder="למשל: שירות אינסטלציה מקצועי בתל אביב" />
            <StyledInput label="כותרת משנה" value={form.subTitle} onChange={(v) => setForm((f) => ({ ...f, subTitle: v }))} placeholder="למשל: זמין 24/7 · מחירים הוגנים" />
            <StyledInput label="תיאור" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} multiline rows={5} placeholder="תיאור מפורט של השירותים..." />
          </SectionCard>

          <SectionCard title="מספר טויליו" icon="call">
            <StyledInput
              label="מספר טויליו (מספר הטלפון שמקבל שיחות)"
              value={form.twilioNumber}
              onChange={(v) => setForm((f) => ({ ...f, twilioNumber: v }))}
              placeholder="לדוגמה: 0723334455"
            />
            <p style={{ color: `${C.onSurface}66`, fontSize: 11, margin: "-8px 0 0", lineHeight: 1.5 }}>
              המספר ישמש לניתוב שיחות ולהצגה בדף הנחיתה. הזן בפורמט ישראלי (0XXXXXXXXX).
            </p>
          </SectionCard>

          <SectionCard title="תמונת כיסוי" icon="panorama">
            <ImageUploadSlot label="תמונה ראשית (Hero) — PNG / JPEG / WEBP עד 5MB" imageUrl={form.heroImage} uploading={heroUploading} onUpload={handleHeroUpload} onDelete={handleHeroDelete} />
          </SectionCard>

          <SectionCard title="תמונת פרופיל" icon="account_circle">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{ position: "relative", width: 100, height: 100, borderRadius: 16, overflow: "hidden", border: form.profileImage ? `1px solid ${C.outlineVar}55` : `2px dashed ${C.outlineVar}88`, background: `${C.surfaceVar}88`, flexShrink: 0, cursor: profileUploading ? "default" : "pointer" }}
                onClick={() => !profileUploading && document.getElementById("adminProfileInput")?.click()}
              >
                {form.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: C.outlineVar, fontSize: 32 }}>add_a_photo</span>
                  </div>
                )}
                {profileUploading && (
                  <div style={{ position: "absolute", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, border: `2px solid ${C.outlineVar}`, borderTopColor: C.tertiary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: `${C.onSurface}99`, fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>תמונת הפרופיל מוצגת על דף הנחיתה לצד המידע של הנציג.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => document.getElementById("adminProfileInput")?.click()} disabled={profileUploading} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.tertiary}66`, background: `${C.tertiary}11`, color: C.tertiary, fontSize: 12, cursor: "pointer" }}>
                    {form.profileImage ? "שנה תמונה" : "העלה תמונה"}
                  </button>
                  {form.profileImage && (
                    <button onClick={handleProfileDelete} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.error}44`, background: `${C.error}11`, color: C.error, fontSize: 12, cursor: "pointer" }}>מחק</button>
                  )}
                </div>
              </div>
            </div>
            <input id="adminProfileInput" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProfileUpload(f); e.target.value = ""; }} />
          </SectionCard>

          <SectionCard title={`גלריה (${form.gallery.length}/10)`} icon="collections">
            <p style={{ color: `${C.onSurface}77`, fontSize: 12, margin: "0 0 14px", lineHeight: 1.5 }}>
              הוסף עד 10 תמונות לגלריה. לחץ ✕ למחיקת תמונה ספציפית.
            </p>
            <GalleryGrid items={form.gallery} onAdd={handleGalleryAdd} onDelete={handleGalleryDelete} addingIdx={galleryAddingIdx} />
          </SectionCard>

          {/* Floating save */}
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "rgba(30,32,40,0.92)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.outlineVar}55`, zIndex: 50 }}>
            <button
              onClick={handleSave}
              disabled={saving || !selectedId}
              style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: saving ? C.outlineVar : `linear-gradient(135deg,${C.adminAccent},${C.primary})`, color: "#150830", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {saving
                ? <><Spinner />שומר שינויים...</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>cloud_upload</span>שמור שינויים</>}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}
