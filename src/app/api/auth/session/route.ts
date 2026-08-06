import { NextRequest, NextResponse } from "next/server";
import { authenticateSession, sanitizeProfile } from "@/lib/server-profile-store";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  return NextResponse.json(sanitizeProfile(user));
}
