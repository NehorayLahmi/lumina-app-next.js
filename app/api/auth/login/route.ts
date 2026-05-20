import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "גוף הבקשה אינו תקין" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { message: "שדות חסרים: email ו-password הם שדות חובה" },
      { status: 400 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { message: "שגיאת חיבור לשרת — נסה שוב מאוחר יותר" },
      { status: 503 }
    );
  }

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? "פרטי הכניסה שגויים" },
      { status: backendRes.status }
    );
  }

  const response = NextResponse.json({
    message: "התחברות בוצעה בהצלחה",
    user: data.user,
  });

  response.cookies.set("auth_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
