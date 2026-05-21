import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback_dev_secret_change_me"
);

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
