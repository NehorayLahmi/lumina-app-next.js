import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Rubik } from "next/font/google";
import type { LandingPageData } from "@/types/landing";
import { SITE_URL } from "@/lib/config";
import { LeadForm } from "./_components/LeadForm";
import { GalleryCarousel } from "./_components/GalleryCarousel";
import { CallButton } from "./_components/CallButton";
import { WhatsAppButton } from "./_components/WhatsAppButton";

const rubik = Rubik({ subsets: ["latin", "hebrew"], display: "swap" });

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

// ── Color tokens ──────────────────────────────────────────────────────────────
const BG = "#1e2026";
const SURFACE = "#282a2e";
const SURF_LOW = "#23252a";
const ON_SURF = "#e2e2e7";
const ON_VAR = "#b4b5b5";
const CYAN = "#00f2ff";
const GOLD = "#ffdca1";
const GOLD_CTR = "#ffb800";
const ON_GOLD = "#271900";


const WA_GREEN = "#25D366";
const ON_WA    = "#ffffff";

// ── toInternational מושבת — משתמשים במספר הרגיל ישירות ──────────────────────
// function toInternational(raw: string): string {
//   if (!raw) return "";
//   const digits = raw.replace(/\D/g, "");
//   if (digits.startsWith("972")) return `+${digits}`;
//   if (digits.startsWith("0")) return `+972${digits.slice(1)}`;
//   return `+972${digits}`;
// }


function toDisplay(raw: string): string {
  if (!raw) return "";

  // 1. מנקים הכל חוץ מספרות
  let digits = raw.replace(/\D/g, "");

  // 2. 🇺🇸 הפיכת מספר אמריקאי למראה ישראלי "רגיל"
  if ((digits.startsWith("1") && digits.length === 11) || raw.startsWith("+1")) {
    // מורידים את ה-1 של ארה"ב ושמים 0 בהתחלה כדי שייראה ישראלי
    const cleanIsraelStyle = "0" + digits.slice(1); // הופך ל- 07643390989

    // מעצבים אותו במבנה של מספר קווי/עסקי מיושר
    return `${cleanIsraelStyle.slice(0, 3)}-${cleanIsraelStyle.slice(3, 6)}-${cleanIsraelStyle.slice(6)}`;
  }

  // 3. 🇮🇱 טיפול במספר ישראלי בינלאומי (הופך חזרה ל-0 בהתחלה)
  if (digits.startsWith("972")) {
    digits = "0" + digits.slice(3);
  }

  // 4. 📱 תצוגה למספר נייד ישראלי מלא (10 ספרות) -> 054-457-4700
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // 5. ☎️ תצוגה למספר קווי ישראלי (9 ספרות) -> 072-333-445
  if (digits.length === 9) {
    if (digits.startsWith("07") || digits.startsWith("05")) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  }

  return raw;
}



function parseGalleryUrls(raw: string): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr))
      return arr.map(item => (typeof item === "string" ? item : (item as { url?: string }).url ?? "")).filter(Boolean);
  } catch { }
  return raw.split(",").map(u => u.trim()).filter(Boolean);
}

async function fetchLandingPage(profession: string, city: string): Promise<LandingPageData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/pages/${profession}/${city}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    // Backend returns firstName + lastName separately — combine into name
    if (data?.pro && !data.pro.name) {
      data.pro.name = `${data.pro.firstName ?? ""} ${data.pro.lastName ?? ""}`.trim();
    }
    return data;
  } catch { return null; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string; city: string }>;
}): Promise<Metadata> {
  const { profession, city } = await params;
  const data = await fetchLandingPage(profession, city);
  if (!data) return { title: "עמוד לא נמצא" };
  const canonicalUrl = `${SITE_URL}/${profession.toLowerCase()}/${city.toLowerCase()}`;
  return {
    title: data.mainTitle,
    description: data.subTitle,
    ...(data.isDraft && { robots: { index: false, follow: false } }),
    alternates: data.isDraft ? undefined : { canonical: canonicalUrl },
    openGraph: {
      title: data.mainTitle,
      description: data.subTitle,
      url: data.isDraft ? undefined : canonicalUrl,
      images: data.heroImage ? [data.heroImage] : [],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ profession: string; city: string }>;
}) {
  const { profession, city } = await params;
  const data = await fetchLandingPage(profession, city);
  if (!data) notFound();

  const gallery = parseGalleryUrls(data.galleryImages);
  const phoneIntl = data.twilioNumber; // toInternational מושבת — מספר ישירות מה-DB
  const phoneDisplay = toDisplay(data.twilioNumber);

  const trustBadges = [
    { icon: "schedule", title: "זמינות מיידית", sub: "מענה מהיר לכל פנייה" },
    { icon: "verified", title: "מקצוענות מוכחת", sub: "ניסיון ואמינות מלאה" },
    { icon: "payments", title: "מחיר הוגן", sub: "ללא הפתעות, הכל שקוף" },
  ];

  return (
    <div className={rubik.className} style={{ background: BG, color: ON_SURF, minHeight: "100vh", direction: "rtl", overflowX: "hidden" }}>

      {/* ── Skip Navigation ───────────────────────────────────────────── */}
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>

      {/* ── Fixed Header ──────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50, height: 72,
        background: "rgba(30,32,38,0.85)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label={data.mainTitle}>
          <span className="material-symbols-outlined" style={{ color: GOLD, fontSize: 28, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">diamond</span>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", color: GOLD }}>{data.mainTitle}</span>
        </div>
        <nav aria-label="ניווט ראשי">
          <CallButton href={`tel:${phoneIntl}`} landingPageId={data.id} destinationPhone={data.twilioNumber} ariaLabel={`התקשר עכשיו: ${phoneDisplay}`} className="pulse-gold" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: GOLD_CTR, color: ON_GOLD,
            padding: "8px 16px", borderRadius: 999,
            fontWeight: 700, fontSize: 13, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(255,184,0,0.3)",
            transition: "filter 0.2s", whiteSpace: "nowrap",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">call</span>
            התקשר עכשיו
          </CallButton>
        </nav>
      </header>

      <main id="main-content" style={{ paddingTop: 72 }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* background image */}
          {data.heroImage && (
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <Image src={data.heroImage} alt={data.mainTitle} fill className="object-cover" priority sizes="100vw" style={{ opacity: 0.22, filter: "contrast(1.1)" }} />
            </div>
          )}
          {/* cyan glow blob */}
          <div style={{ position: "absolute", top: "20%", right: -80, width: 400, height: 400, background: `${CYAN}18`, filter: "blur(120px)", borderRadius: "50%", zIndex: 0 }} />

          <div className="hero-grid" style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

            {/* Left — text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, border: `1px solid ${GOLD}33`, background: `${GOLD}0d`, width: "fit-content" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: GOLD }}>{`זמין עכשיו · ${data.pro.city}`}</span>
              </div>

              <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
                צריך{" "}
                <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_CTR}, ${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {data.mainTitle}
                </span>
                {" "}?
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.7, color: ON_VAR, margin: 0, maxWidth: 480 }}>{data.subTitle}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "fit-content" }}>
                <CallButton href={`tel:${phoneIntl}`} landingPageId={data.id} destinationPhone={data.twilioNumber} ariaLabel={`התקשר עכשיו: ${phoneDisplay}`} className="pulse-gold" style={{
                  display: "inline-flex", alignItems: "center", gap: 14,
                  background: GOLD_CTR, color: ON_GOLD,
                  padding: "18px 36px", borderRadius: 18,
                  fontWeight: 800, fontSize: 20, textDecoration: "none",
                  width: "fit-content", boxShadow: `0 8px 32px ${GOLD_CTR}55`,
                  transition: "filter 0.2s",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">call</span>
                  התקשר עכשיו: {phoneDisplay}
                </CallButton>
                <WhatsAppButton phone={data.pro.phone} landingPageId={data.id} ariaLabel="שלח הודעת WhatsApp" style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  background: WA_GREEN, color: ON_WA,
                  padding: "14px 28px", borderRadius: 18,
                  fontWeight: 700, fontSize: 16, textDecoration: "none",
                  width: "fit-content", boxShadow: `0 6px 24px ${WA_GREEN}44`,
                  transition: "filter 0.2s",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </WhatsAppButton>
              </div>
            </div>

            {/* Right — lead form */}
            <div>
              <LeadForm profession={profession} city={city} proName={data.pro.name} />
            </div>
          </div>

          {/* ── Mobile hero layout override ────────────────────────────── */}
          <style>{`
            @media (max-width: 768px) {
              .hero-grid { grid-template-columns: 1fr !important; padding: 48px 20px 40px !important; }
              .trust-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
              .cta-icons  { gap: 24px !important; }
            }
          `}</style>
        </section>

        {/* ── Trust Badges ──────────────────────────────────────────────── */}
        <section aria-label="יתרונות השירות" style={{ background: SURF_LOW, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px" }}>
          <div className="trust-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {trustBadges.map(badge => (
              <div key={badge.icon} style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
                <div className="cyber-glass cyber-glow" style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                  <span className="material-symbols-outlined" style={{ color: CYAN, fontSize: 22 }}>{badge.icon}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: ON_SURF, margin: 0 }}>{badge.title}</p>
                  <p style={{ fontSize: 13, color: ON_VAR, margin: 0, marginTop: 2 }}>{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About / Description ───────────────────────────────────────── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
            {data.profileImage && (
              <div style={{ flexShrink: 0 }}>
                <div className="cyber-glow" style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", position: "relative" }}>
                  <Image src={data.profileImage} alt={data.pro.name} fill className="object-cover" sizes="120px" />
                </div>
                <p style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: ON_SURF, marginTop: 12 }}>{data.pro.name}</p>
                <p style={{ textAlign: "center", fontSize: 12, color: ON_VAR, marginTop: 2 }}>{data.pro.city}</p>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: ON_SURF, margin: 0 }}>אודות השירות</h2>
                <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${CYAN}, transparent)`, borderRadius: 2 }} />
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: ON_VAR, margin: 0 }}>{data.description}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
                <CallButton href={`tel:${phoneIntl}`} landingPageId={data.id} destinationPhone={data.twilioNumber} ariaLabel={`התקשר עכשיו: ${phoneDisplay}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 14,
                  border: `1px solid ${GOLD}44`, background: `${GOLD}0e`,
                  color: GOLD, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  transition: "background 0.2s",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">call</span>
                  התקשר עכשיו
                </CallButton>
                <WhatsAppButton phone={data.pro.phone} landingPageId={data.id} ariaLabel="שלח הודעת WhatsApp" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 14,
                  border: `1px solid ${WA_GREEN}55`, background: `${WA_GREEN}15`,
                  color: WA_GREEN, fontWeight: 700, fontSize: 15, textDecoration: "none",
                  transition: "background 0.2s",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── Gallery ───────────────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section style={{ background: SURF_LOW, padding: "96px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
                <div>
                  <h2 style={{ fontSize: 36, fontWeight: 800, color: ON_SURF, margin: 0, marginBottom: 12 }}>גלריית עבודות</h2>
                  <p style={{ fontSize: 16, color: ON_VAR, margin: 0 }}>הצצה לסטנדרט העבודה שאנו מביאים לכל פרויקט</p>
                </div>
                {/* buttons rendered inside GalleryCarousel */}
              </div>
              <GalleryCarousel images={gallery} />
            </div>
          </section>
        )}

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section style={{ position: "relative", padding: "120px 24px", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: `${CYAN}07`, filter: "blur(140px)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
              אל תחכו לרגע האחרון.<br />
              <span style={{ color: GOLD }}>{data.mainTitle} בידיים בטוחות.</span>
            </h2>
            <CallButton href={`tel:${phoneIntl}`} landingPageId={data.id} destinationPhone={data.twilioNumber} ariaLabel={`התקשר עכשיו: ${phoneDisplay}`} className="pulse-gold" style={{
              display: "inline-flex", alignItems: "center", gap: 16,
              background: GOLD_CTR, color: ON_GOLD,
              padding: "20px 48px", borderRadius: 20,
              fontWeight: 800, fontSize: 22, textDecoration: "none",
              boxShadow: `0 8px 40px ${GOLD_CTR}55`,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">call</span>
              התקשר עכשיו: {phoneDisplay}
            </CallButton>
            <ul className="cta-icons" style={{ display: "flex", gap: 48, color: ON_VAR, listStyle: "none", padding: 0, margin: 0 }}>
              {[["bolt", "פנייה מיידית"], ["security", "אחריות מלאה"], ["badge", "מורשה ומוסמך"]].map(([icon, label]) => (
                <li key={icon} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ color: CYAN, fontSize: 24 }} aria-hidden="true">{icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style={{ background: "#15171c", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: GOLD, fontVariationSettings: "'FILL' 1", fontSize: 22 }} aria-hidden="true">diamond</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: GOLD }}>{data.mainTitle}</span>
            </div>
            <p style={{ fontSize: 14, color: ON_VAR, maxWidth: 420, lineHeight: 1.6 }}>
              {data.subTitle}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "#514532", margin: 0 }}>© {new Date().getFullYear()} · {data.mainTitle} · {data.pro.city}</p>
              <a href="/privacy" style={{ fontSize: 12, color: "#514532", textDecoration: "underline", textUnderlineOffset: 3 }}>מדיניות פרטיות</a>
            </div>
          </div>
        </footer>

      </main>

      {/* ── Sticky Mobile Call + WhatsApp Bar ─────────────────────────── */}
      <div role="region" aria-label="פנייה מהירה" style={{ position: "fixed", bottom: 0, insetInline: 0, zIndex: 50, padding: "10px 12px calc(16px + env(safe-area-inset-bottom))", background: `${SURFACE}ee`, backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10, justifyContent: "center" }}>
        <CallButton href={`tel:${phoneIntl}`} landingPageId={data.id} destinationPhone={data.twilioNumber} ariaLabel={`התקשר עכשיו: ${phoneDisplay}`} className="pulse-gold" style={{
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
          background: GOLD_CTR, color: ON_GOLD,
          flex: 1, maxWidth: 220, padding: "13px 0", borderRadius: 16,
          fontWeight: 800, fontSize: 16, textDecoration: "none",
          boxShadow: `0 4px 20px ${GOLD_CTR}55`,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }} aria-hidden="true">call</span>
          התקשר עכשיו
        </CallButton>
        <WhatsAppButton phone={data.pro.phone} landingPageId={data.id} ariaLabel="שלח הודעת WhatsApp" style={{
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
          background: WA_GREEN, color: ON_WA,
          flex: 1, maxWidth: 160, padding: "13px 0", borderRadius: 16,
          fontWeight: 800, fontSize: 16, textDecoration: "none",
          boxShadow: `0 4px 20px ${WA_GREEN}44`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </WhatsAppButton>
      </div>

      {/* bottom padding so sticky bar doesn't overlap content */}
      <div style={{ height: "calc(80px + env(safe-area-inset-bottom))" }} />
    </div>
  );
}
