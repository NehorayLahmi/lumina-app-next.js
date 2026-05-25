"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ── Color tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           "#15171c",
  primary:      "#d7baff",
  secondary:    "#e0b6ff",
  tertiary:     "#5bd5fc",
  onSurface:    "#e7dff5",
  onSurfaceVar: "#ccc3d3",
  onPrimary:    "#0f1115",
  surface:      "#1c1e24",
  surfaceLow:   "#0f1115",
  outlineVar:   "#2e3139",
};

function LoginForm() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const registered = searchParams.get("registered") === "1";

  const cardRef  = useRef<HTMLElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "ADMIN" ? "/admin" : "/pro/dashboard");
    }
  }, [loading, user, router]);

  // Mouse parallax + cursor glow
  useEffect(() => {
    const glow = glowRef.current;
    const card = cardRef.current;

    function onMove(e: MouseEvent) {
      if (glow) {
        glow.style.opacity = "1";
        glow.style.left    = e.clientX + "px";
        glow.style.top     = e.clientY + "px";
      }
      if (card) {
        const xAxis = (window.innerWidth  / 2 - e.pageX) / 60;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      }
    }
    function onLeave() {
      if (glow) glow.style.opacity = "0";
      if (card) card.style.transform = "rotateY(0deg) rotateX(0deg)";
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const from = searchParams.get("from");
    router.push(from ?? (result.user?.role === "ADMIN" ? "/admin" : "/pro/dashboard"));
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: C.bg, fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}
      >
        <span style={{ color: C.onSurfaceVar, fontSize: 14 }}>טוען...</span>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.bg, fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}
      dir="rtl"
    >
      {/* ── Animated background orbs ──────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(80px)",
          opacity: 0.4, width: 500, height: 500,
          background: C.primary, top: "-10%", right: "-10%",
          animation: "pulse 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(80px)",
          opacity: 0.35, width: 600, height: 600,
          background: C.secondary, bottom: "-20%", left: "-10%",
          animation: "pulse 4s ease-in-out infinite 2s",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(80px)",
          opacity: 0.15, width: 300, height: 300,
          background: C.tertiary, left: "40%", top: "30%",
        }} />
      </div>

      {/* ── Cursor glow ────────────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none"
        aria-hidden="true"
        style={{
          width: 400, height: 400,
          background: "rgba(215,186,255,0.08)",
          borderRadius: "50%",
          filter: "blur(100px)",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          opacity: 0,
          transition: "opacity 0.7s",
        }}
      />

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[480px] px-6 py-12" style={{ perspective: "1000px" }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl shadow-2xl lumina-gradient"
               style={{ flexShrink: 0 }} aria-hidden="true">
            <span
              className="material-symbols-outlined"
              style={{ color: C.onPrimary, fontSize: 48, fontVariationSettings: "'FILL' 1" }}
            >
              diamond
            </span>
          </div>
          <h1
            className="text-5xl font-bold tracking-tighter bg-clip-text"
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary}, ${C.tertiary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            }}
          >
            LUMINA LEADS
          </h1>
          <p style={{
            color: C.onSurfaceVar, fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            fontSize: 14, letterSpacing: "0.15em", fontWeight: 600,
            marginTop: 8, opacity: 0.8, textTransform: "uppercase",
          }}>
            מערכת ניהול לידים
          </p>
        </div>

        {/* Glass card */}
        <section
          ref={cardRef}
          className="lumina-glass rounded-[32px] p-8 md:p-10"
          style={{ transition: "transform 0.1s ease-out" }}
          aria-label="טופס התחברות"
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Welcome */}
            <div className="text-right mb-6">
              <h2 style={{
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontWeight: 600,
                fontSize: 28, color: C.onSurface, marginBottom: 6,
              }}>
                ברוכים הבאים
              </h2>
              <p style={{ color: C.onSurfaceVar, fontSize: 16 }}>
                התחבר לחווית יוקרה דיגיטלית חסרת פשרות
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block", fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                  fontSize: 14, fontWeight: 600, letterSpacing: "0.05em",
                  color: C.onSurfaceVar, marginBottom: 8, marginRight: 4,
                }}
              >
                כתובת אימייל
              </label>
              <div className="relative group">
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    position: "absolute", right: 16, top: "50%",
                    transform: "translateY(-50%)",
                    color: C.onSurfaceVar, fontSize: 22,
                    pointerEvents: "none", transition: "color 0.2s",
                  }}
                >
                  mail
                </span>
                <input
                  id="login-email"
                  className="lumina-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  disabled={submitting}
                  style={{ paddingRight: "3rem", paddingLeft: "1rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                    fontSize: 14, fontWeight: 600, letterSpacing: "0.05em",
                    color: C.onSurfaceVar,
                  }}
                >
                  סיסמה
                </label>
                <Link
                  href="/forgot-password"
                  style={{ color: C.tertiary, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                >
                  שכחת סיסמה?
                </Link>
              </div>
              <div className="relative group">
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    position: "absolute", right: 16, top: "50%",
                    transform: "translateY(-50%)",
                    color: C.onSurfaceVar, fontSize: 22,
                    pointerEvents: "none",
                  }}
                >
                  lock
                </span>
                <input
                  id="login-password"
                  className="lumina-input"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                  style={{ paddingRight: "3rem", paddingLeft: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "הסתר סיסמה" : "הצג סיסמה"}
                  aria-pressed={showPass}
                  style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: C.onSurfaceVar, padding: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Success / error banners */}
            {registered && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  background: "rgba(91,213,252,0.12)", border: "1px solid rgba(91,213,252,0.3)",
                  borderRadius: 12, padding: "10px 14px",
                  color: C.tertiary, fontSize: 14,
                }}
              >
                ההרשמה הושלמה בהצלחה — כעת ניתן להתחבר
              </div>
            )}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                style={{
                  background: "rgba(255,180,171,0.1)", border: "1px solid rgba(255,180,171,0.3)",
                  borderRadius: 12, padding: "10px 14px",
                  color: "#ffb4ab", fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              aria-label={submitting ? "מתחבר, אנא המתן" : "התחברות למערכת"}
              className="lumina-gradient"
              style={{
                width: "100%", height: 64,
                border: "none", borderRadius: 16,
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 20, fontWeight: 500,
                color: C.onPrimary, cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 32px rgba(111,0,180,0.4)",
                transition: "transform 0.2s, opacity 0.2s",
              }}
              onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              onMouseDown={(e)  => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
              onMouseUp={(e)    => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            >
              <span>{submitting ? "מתחבר..." : "התחברות"}</span>
              {!submitting && (
                <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                  arrow_back
                </span>
              )}
            </button>

            {/* Register link */}
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <p style={{ color: C.onSurfaceVar, fontSize: 16 }}>
                עדיין לא חבר?{" "}
                <Link
                  href="/register"
                  style={{ color: C.primary, fontWeight: 700, textDecoration: "none" }}
                >
                  הצטרף עכשיו
                </Link>
              </p>
            </div>

          </form>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 48, textAlign: "center", opacity: 0.4, transition: "opacity 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}>
          <p style={{
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
            letterSpacing: "0.15em", color: C.onSurface,
          }}>
            © 2025 LUMINA LEAD TECHNOLOGY
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
            <Link href="/terms" style={{ color: C.onSurface, fontSize: 14, textDecoration: "none" }}>תנאי שימוש</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }} aria-hidden="true">•</span>
            <Link href="/privacy" style={{ color: C.onSurface, fontSize: 14, textDecoration: "none" }}>פרטיות</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
