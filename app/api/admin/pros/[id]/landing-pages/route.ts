import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

// GET /api/admin/pros/:id/landing-pages — all landing pages owned by this pro
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return adminProxy(`/pros/${id}/landing-pages`);
}
