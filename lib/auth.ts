import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback_dev_secret_change_me"
);

export interface AuthUser {
  userId: string;
  email: string;
  role: "ADMIN" | "PRO";
  proProfileId: string | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "ADMIN" | "PRO",
      proProfileId: (payload.proProfileId as string) ?? null,
    };
  } catch {
    return null;
  }
}
