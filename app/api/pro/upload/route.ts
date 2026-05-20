import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuthUser } from "@/lib/auth";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(
  buf: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      })
      .end(buf);
  });
}

// POST /api/pro/upload  — multipart/form-data { file: File }
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "שגיאה בקריאת הטופס" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "לא נבחר קובץ" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { message: "סוג קובץ לא נתמך — PNG, JPEG ו-WEBP בלבד" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "הקובץ גדול מדי — מקסימום 5MB" },
      { status: 400 }
    );
  }

  const folder = `leads_machine/pro_${user.proProfileId}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadBuffer(buffer, folder);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "שגיאה בהעלאת התמונה לשרת" }, { status: 500 });
  }
}

// DELETE /api/pro/upload  — JSON { publicId: string }
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  let body: { publicId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "גוף הבקשה אינו תקין" }, { status: 400 });
  }

  if (!body.publicId) {
    return NextResponse.json({ message: "שדה חובה: publicId" }, { status: 400 });
  }

  // Security: public_id must be inside this pro's folder
  const expectedPrefix = `leads_machine/pro_${user.proProfileId}/`;
  if (!body.publicId.startsWith(expectedPrefix)) {
    return NextResponse.json({ message: "גישה נדחתה" }, { status: 403 });
  }

  try {
    await cloudinary.uploader.destroy(body.publicId);
    return NextResponse.json({ message: "תמונה נמחקה בהצלחה" });
  } catch {
    return NextResponse.json({ message: "שגיאה במחיקת התמונה" }, { status: 500 });
  }
}
