import { NextRequest, NextResponse } from "next/server";
import { createSession, createMemberProfile, findAssessmentByEmail, deleteAssessmentByEmail, sanitizeProfile, findUserByEmail } from "@/lib/server-profile-store";
import type { InitialAssessment } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const assessment = body.assessment ? (body.assessment as InitialAssessment) : undefined;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Nombre, correo y contraseña son obligatorios." }, { status: 400 });
  }

  const existingProfile = await findUserByEmail(email);
  if (existingProfile) {
    return NextResponse.json({ message: "Ya existe una cuenta con este correo." }, { status: 400 });
  }
  const existingAssessment = await findAssessmentByEmail(email);
  const draft = assessment?.email?.toLowerCase() === email ? assessment : existingAssessment || undefined;

  const profile = await createMemberProfile(name, email, password, draft);
  if (existingAssessment) {
    await deleteAssessmentByEmail(email);
  }

  const token = await createSession(profile.id);
  const response = NextResponse.json(sanitizeProfile(profile));
  response.cookies.set("sessionToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
