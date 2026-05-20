import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

// PUT /api/admin/pros/:id/landing-pages/:pageId — update pro's landing page (admin bypass)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const { id, pageId } = await params;
  const body = await req.text();
  return adminProxy(`/pros/${id}/landing-pages/${pageId}`, {
    method: "PUT",
    body,
  });
}
