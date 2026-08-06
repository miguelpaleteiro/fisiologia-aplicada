import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyPassword, sanitizeProfile } from "@/lib/server-profile-store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();

  if (!email || !password) {
    return NextResponse.json({ message: "Correo y contraseña son obligatorios." }, { status: 400 });
  }

  const user = await verifyPassword(email, password);

  if (!user) {
    return NextResponse.json({ message: "El correo o la contraseña no coinciden." }, { status: 401 });
  }

  const token = await createSession(user.id);
  const response = NextResponse.json(sanitizeProfile(user));
  response.cookies.set("sessionToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
