import type { Metadata } from "next";
import { BackButton } from "./BackButton";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של האתר",
};

const BG       = "#1e2026";
const ON_SURF  = "#e2e2e7";
const ON_VAR   = "#b4b5b5";
const GOLD     = "#ffdca1";

export default function PrivacyPage() {
  return (
    <div style={{ background: BG, color: ON_SURF, minHeight: "100vh", direction: "rtl", padding: "80px 24px 120px" }}>
      <main style={{ maxWidth: 760, margin: "0 auto" }}>
        <BackButton />

        <h1 style={{ fontSize: 36, fontWeight: 800, color: GOLD, marginBottom: 12 }}>מדיניות פרטיות</h1>
        <p style={{ fontSize: 14, color: ON_VAR, marginBottom: 48 }}>עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>

        <section aria-labelledby="intro-heading" style={{ marginBottom: 40 }}>
          <h2 id="intro-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>כללי</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            אנו מכבדים את פרטיותך ומחויבים להגן על המידע האישי שאתה מוסר לנו. מסמך זה מסביר
            אילו נתונים נאספים, כיצד הם מנוהלים ומהן זכויותיך.
          </p>
        </section>

        <section aria-labelledby="data-heading" style={{ marginBottom: 40 }}>
          <h2 id="data-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>איזה מידע אנו אוספים</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR, paddingRight: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>שם מלא ומספר טלפון שמוזנים בטופס יצירת הקשר</li>
            <li>נתוני שיחות טלפון (מספר מתקשר, שעה, משך) לצורך מעקב פניות</li>
            <li>נתוני גלישה בסיסיים (כתובת IP, סוג דפדפן) לצורך אבטחה וסטטיסטיקה</li>
          </ul>
        </section>

        <section aria-labelledby="use-heading" style={{ marginBottom: 40 }}>
          <h2 id="use-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>כיצד אנו משתמשים במידע</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR, paddingRight: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>יצירת קשר חוזר עם הלקוח בהתאם לפנייתו</li>
            <li>שיפור איכות השירות וניתוח תנועת הגולשים</li>
            <li>לא נמכור ולא נעביר מידע לצד שלישי ללא הסכמתך</li>
          </ul>
        </section>

        <section aria-labelledby="rights-heading" style={{ marginBottom: 40 }}>
          <h2 id="rights-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>זכויותיך</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            בהתאם לחוק הגנת הפרטיות, תשמ"א–1981, יש לך זכות לעיין במידע המוחזק עליך,
            לתקנו, או לבקש מחיקתו. לפנייה בנושא צור קשר עמנו ישירות.
          </p>
        </section>

        <section aria-labelledby="cookies-heading" style={{ marginBottom: 40 }}>
          <h2 id="cookies-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>עוגיות (Cookies)</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            האתר עשוי לעשות שימוש בעוגיות לצורך שיפור חוויית המשתמש וניתוח גלישה.
            ניתן לבטל עוגיות בהגדרות הדפדפן שלך בכל עת.
          </p>
        </section>
      </main>
    </div>
  );
}
