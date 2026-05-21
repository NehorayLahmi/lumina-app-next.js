import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("MISSING JWT_SECRET: הגדר משתנה סביבה JWT_SECRET!");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      proProfileId: (payload.proProfileId as string) ?? null,
    });
  } catch {
    return NextResponse.json(
      { message: "טוקן לא תקין או פג תוקף" },
      { status: 401 }
    );
  }
}
