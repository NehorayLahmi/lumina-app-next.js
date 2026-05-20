import { adminProxy } from "@/lib/adminFetch";

export async function GET() {
  return adminProxy("/stats");
}
