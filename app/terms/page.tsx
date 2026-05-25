import type { Metadata } from "next";
import { BackButton } from "../privacy/BackButton";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש של מערכת Lumina Leads",
};

const BG      = "#1e2026";
const ON_SURF = "#e2e2e7";
const ON_VAR  = "#b4b5b5";
const GOLD    = "#ffdca1";

export default function TermsPage() {
  return (
    <div style={{ background: BG, color: ON_SURF, minHeight: "100vh", direction: "rtl", padding: "80px 24px 120px" }}>
      <main style={{ maxWidth: 760, margin: "0 auto" }}>
        <BackButton />

        <h1 style={{ fontSize: 36, fontWeight: 800, color: GOLD, marginBottom: 12 }}>תנאי שימוש</h1>
        <p style={{ fontSize: 14, color: ON_VAR, marginBottom: 48 }}>עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>

        <section aria-labelledby="general-heading" style={{ marginBottom: 40 }}>
          <h2 id="general-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>כללי</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            השימוש במערכת Lumina Leads כפוף לתנאים המפורטים במסמך זה. הגישה לשירות מהווה
            הסכמה מלאה לתנאים אלו. אנא קרא אותם בעיון לפני השימוש.
          </p>
        </section>

        <section aria-labelledby="service-heading" style={{ marginBottom: 40 }}>
          <h2 id="service-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>תיאור השירות</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            המערכת מספקת פלטפורמה לניהול לידים ועמודי נחיתה עבור בעלי מקצוע. אנו שומרים לעצמנו
            את הזכות לשנות, להשעות או להפסיק כל חלק מהשירות בכל עת.
          </p>
        </section>

        <section aria-labelledby="obligations-heading" style={{ marginBottom: 40 }}>
          <h2 id="obligations-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>התחייבויות המשתמש</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR, paddingRight: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>למסור פרטים נכונים ומדויקים בעת ההרשמה</li>
            <li>לא להשתמש בשירות לכל מטרה בלתי חוקית</li>
            <li>לשמור על סודיות פרטי הכניסה לחשבון</li>
            <li>לא להעביר גישה לחשבון לצד שלישי</li>
          </ul>
        </section>

        <section aria-labelledby="liability-heading" style={{ marginBottom: 40 }}>
          <h2 id="liability-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>הגבלת אחריות</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            השירות מסופק "כפי שהוא". החברה אינה אחראית לנזקים ישירים או עקיפים הנובעים
            מהשימוש במערכת, כולל אובדן נתונים או הכנסות.
          </p>
        </section>

        <section aria-labelledby="law-heading" style={{ marginBottom: 40 }}>
          <h2 id="law-heading" style={{ fontSize: 22, fontWeight: 700, color: ON_SURF, marginBottom: 12 }}>דין חל וסמכות שיפוט</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: ON_VAR }}>
            תנאים אלו כפופים לדיני מדינת ישראל. כל סכסוך יידון בבתי המשפט המוסמכים במחוז תל אביב.
          </p>
        </section>
      </main>
    </div>
  );
}
