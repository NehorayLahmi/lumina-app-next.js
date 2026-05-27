"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROFESSIONS, CITIES } from "@/lib/options";
import { isValidEmail, isValidPhone, isValidName, isValidPassword } from "@/lib/validate";

const C = {
  bg:           "#15171c",
  primary:      "#d7baff",
  secondary:    "#e0b6ff",
  tertiary:     "#5bd5fc",
  onSurface:    "#e7dff5",
  onSurfaceVar: "#ccc3d3",
  outline:      "#968e9c",
  outlineVar:   "#2e3139",
  onPrimary:    "#0f1115",
  surfaceLow:   "#0f1115",
};

// ── Reusable field wrapper ────────────────────────────────────────────────────
function Field({
  label, icon, children, colSpan2 = false, fieldId,
}: {
  label: string; icon: string; children: React.ReactNode; colSpan2?: boolean; fieldId?: string;
}) {
  return (
    <div className={`flex flex-col${colSpan2 ? " md:col-span-2" : ""}`} style={{ gap: 8 }}>
      <label htmlFor={fieldId} style={{
        fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
        fontSize: 14, fontWeight: 600, letterSpacing: "0.05em",
        color: C.primary, paddingRight: 8,
      }}>
        {label}
      </label>
      <div className="relative group" style={{ transition: "transform 0.15s" }}
           onFocus={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
           onBlur={(e)  => (e.currentTarget.style.transform = "scale(1)")}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute", right: 16, top: "50%",
            transform: "translateY(-50%)",
            color: C.outline, fontSize: 22,
            pointerEvents: "none", transition: "color 0.2s",
            zIndex: 1,
          }}
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [city,       setCity]       = useState("");
  const [profession, setProfession] = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [terms,      setTerms]      = useState(false);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  // Orb parallax
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    }
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isValidName(firstName.trim())) {
      setError("שם פרטי לא תקין — יש להזין שם בעברית או באנגלית (2–50 תווים)");
      return;
    }
    if (!isValidName(lastName.trim())) {
      setError("שם משפחה לא תקין — יש להזין שם בעברית או באנגלית (2–50 תווים)");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("כתובת אימייל לא תקינה");
      return;
    }
    if (!isValidPhone(phone.trim())) {
      setError("מספר טלפון לא תקין — יש להזין מספר ישראלי (לדוגמה: 050-1234567)");
      return;
    }
    if (!isValidPassword(password)) {
      setError("הסיסמה חייבת להכיל בין 6 ל-100 תווים");
      return;
    }
    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    if (!terms) {
      setError("יש לאשר את תנאי השימוש");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, city, profession, password }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.message ?? "ההרשמה נכשלה");
      return;
    }

    router.push("/login?registered=1");
  }

  const inputStyle = (extraPadding?: string) => ({
    paddingRight: extraPadding ?? "3rem",
    paddingLeft: "1rem",
  });

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{ backgroundColor: C.bg, fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}
      dir="rtl"
    >
      {/* ── Glow orbs ─────────────────────────────────────────────────── */}
      <div
        ref={orb1Ref}
        style={{
          position: "fixed", borderRadius: "50%", filter: "blur(120px)",
          zIndex: 0, opacity: 0.4, width: 600, height: 600,
          background: "#6f00b4", top: -200, right: -100,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        ref={orb2Ref}
        style={{
          position: "fixed", borderRadius: "50%", filter: "blur(120px)",
          zIndex: 0, opacity: 0.35, width: 500, height: 500,
          background: "#2eb5db", bottom: -100, left: -100,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="relative z-10 text-center mb-10">
        <h1
          className="font-bold tracking-tighter bg-clip-text"
          style={{
            fontSize: 48, lineHeight: 1.1,
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary}, ${C.tertiary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
          }}
        >
          LUMINA LEADS
        </h1>
        <p style={{
          color: C.onSurfaceVar, fontSize: 18, fontWeight: 500, marginTop: 8,
        }}>
          הצטרפו לקהילת המקצוענים המובילה בישראל
        </p>
      </header>

      {/* ── Registration card ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-2xl">
        <div
          className="lumina-glass rounded-[2rem] relative overflow-hidden"
          style={{ padding: "2.5rem" }}
        >
          {/* Decorative top accent */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: 128, height: 2,
            background: `linear-gradient(to left, ${C.tertiary}, transparent)`,
          }} />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>

              {/* שם פרטי */}
              <Field label="שם פרטי" icon="person" fieldId="reg-first-name">
                <input
                  id="reg-first-name"
                  className="lumina-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ישראל"
                  autoComplete="given-name"
                  required
                  disabled={submitting}
                  style={inputStyle()}
                />
              </Field>

              {/* שם משפחה */}
              <Field label="שם משפחה" icon="badge" fieldId="reg-last-name">
                <input
                  id="reg-last-name"
                  className="lumina-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="ישראלי"
                  autoComplete="family-name"
                  required
                  disabled={submitting}
                  style={inputStyle()}
                />
              </Field>

              {/* אימייל */}
              <Field label="אימייל" icon="mail" fieldId="reg-email">
                <input
                  id="reg-email"
                  className="lumina-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pro@lumina.io"
                  autoComplete="email"
                  required
                  disabled={submitting}
                  style={inputStyle()}
                />
              </Field>

              {/* טלפון */}
              <Field label="טלפון" icon="call" fieldId="reg-phone">
                <input
                  id="reg-phone"
                  className="lumina-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05X-XXXXXXX"
                  autoComplete="tel"
                  required
                  disabled={submitting}
                  style={inputStyle()}
                />
              </Field>

              {/* מקצוע */}
              <Field label="מקצוע" icon="category" colSpan2 fieldId="reg-profession">
                <select
                  id="reg-profession"
                  className="lumina-select"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="" disabled>בחר תחום התמחות</option>
                  {PROFESSIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    color: C.outline, fontSize: 22, pointerEvents: "none",
                  }}
                >
                  expand_more
                </span>
              </Field>

              {/* עיר פעילות */}
              <Field label="עיר פעילות" icon="location_on" colSpan2 fieldId="reg-city">
                <select
                  id="reg-city"
                  className="lumina-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="" disabled>בחר עיר</option>
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    color: C.outline, fontSize: 22, pointerEvents: "none",
                  }}
                >
                  expand_more
                </span>
              </Field>

              {/* סיסמה */}
              <Field label="סיסמה (לפחות 6 תווים)" icon="lock" colSpan2 fieldId="reg-password">
                <input
                  id="reg-password"
                  className="lumina-input"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={submitting}
                  style={{ paddingRight: "3rem", paddingLeft: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "הסתר סיסמה" : "הצג סיסמה"}
                  aria-pressed={showPass}
                  aria-controls="reg-password"
                  style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", color: C.outline, padding: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </Field>

              {/* אימות סיסמה */}
              <Field label="אימות סיסמה" icon="lock_reset" colSpan2 fieldId="reg-confirm">
                <input
                  id="reg-confirm"
                  className="lumina-input"
                  type={showConf ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={submitting}
                  style={{ paddingRight: "3rem", paddingLeft: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((v) => !v)}
                  aria-label={showConf ? "הסתר אימות סיסמה" : "הצג אימות סיסמה"}
                  aria-pressed={showConf}
                  aria-controls="reg-confirm"
                  style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", color: C.outline, padding: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                    {showConf ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </Field>

            </div>

            {/* תנאי שימוש */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 8px", marginBottom: 16 }}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                style={{
                  width: 20, height: 20, accentColor: C.primary,
                  cursor: "pointer", flexShrink: 0,
                }}
              />
              <label
                htmlFor="terms"
                style={{
                  fontSize: 14, fontWeight: 600, letterSpacing: "0.05em",
                  color: C.onSurfaceVar, cursor: "pointer",
                }}
              >
                אני מסכים לתנאי השימוש ולמדיניות הפרטיות של{" "}
                <span style={{ color: C.tertiary }}>Lumina Elite</span>
              </label>
            </div>

            {/* שגיאה */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                style={{
                  background: "rgba(255,180,171,0.1)",
                  border: "1px solid rgba(255,180,171,0.3)",
                  borderRadius: 12, padding: "10px 14px",
                  color: "#ffb4ab", fontSize: 14, marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            {/* כפתור שליחה */}
            <button
              type="submit"
              disabled={submitting}
              className="lumina-gradient"
              style={{
                width: "100%", height: 64,
                border: "none", borderRadius: 16,
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                fontSize: 20, fontWeight: 500,
                color: C.onPrimary,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 32px rgba(111,0,180,0.4)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.transform = "scale(1.02) translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
              onMouseDown={(e)  => { e.currentTarget.style.transform = "scale(0.95)"; }}
              onMouseUp={(e)    => { e.currentTarget.style.transform = "scale(1.02) translateY(-2px)"; }}
            >
              <span>{submitting ? "נרשם..." : "ליצירת חשבון פרימיום"}</span>
              {!submitting && (
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                  arrow_back
                </span>
              )}
            </button>
          </form>

          {/* קישור לכניסה */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.onSurfaceVar }}>
              כבר רשום?{" "}
              <Link
                href="/login"
                style={{ color: C.secondary, fontWeight: 700, textDecoration: "none" }}
              >
                התחבר כאן
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{ marginTop: 32, opacity: 0.4, display: "flex", alignItems: "center", gap: 16, transition: "opacity 0.3s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
      >
        <div style={{ height: 1, width: 48, background: "linear-gradient(to left, #2e3139, transparent)" }} />
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.2em", color: C.onSurfaceVar }}>
          SECURITY ENCRYPTED
        </span>
        <div style={{ height: 1, width: 48, background: "linear-gradient(to right, #2e3139, transparent)" }} />
      </footer>
    </div>
  );
}
