import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function GET(req: NextRequest) {
  return adminProxy(`/calls${req.nextUrl.search}`);
}
