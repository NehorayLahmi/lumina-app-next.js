import { NextRequest, NextResponse } from "next/server";

// שימוש במשתנה ה-env המדויק שלך מהקובץ
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:10000";

export async function GET(req: NextRequest) {
  // 1. שליפת עוגיית ה-auth_token מהדפדפן
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  try {
    // 2. שליחת בקשה לשרת ב-Render (בעזרת ה-env שלך) לאימות הטוקן
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // זריקת הטוקן כ-Bearer
        "Cookie": `auth_token=${token}`     // וגם כעוגייה לגיבוי
      },
    });

    const data = await backendRes.json();

    // אם השרת ברנדר החזיר שגיאה (הטוקן לא בתוקף או פג)
    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message ?? "אימות נכשל מול השרת" },
        { status: backendRes.status }
      );
    }

    // 3. הכל תקין! מחזירים את אובייקט המשתמש שחזר מרנדר
    // שים לב: לפי קוד הבאקאנד שלך, המידע חוזר בתוך אובייקט בשם user (כמו res.json({ user }))
    return NextResponse.json(data.user);
    
  } catch (error) {
    console.error("Error in /api/auth/me proxy:", error);
    return NextResponse.json(
      { message: "שגיאת תקשורת עם שרת האימות" },
      { status: 500 }
    );
  }
}