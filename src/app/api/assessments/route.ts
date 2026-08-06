import { NextRequest, NextResponse } from "next/server";
import { saveAssessment, findAssessmentByEmail } from "@/lib/server-profile-store";
import type { InitialAssessment } from "@/lib/types";

export async function POST(req: NextRequest) {
  const assessment = await req.json() as InitialAssessment;
  if (!assessment.name || !assessment.email || !assessment.goal) {
    return NextResponse.json({ message: "Nombre, correo y objetivo son obligatorios." }, { status: 400 });
  }
  const saved = await saveAssessment({ ...assessment, email: assessment.email.toLowerCase() });
  return NextResponse.json(saved);
}

export async function GET(req: NextRequest) {
  const email = String(req.nextUrl.searchParams.get("email") || "").toLowerCase();
  if (!email) {
    return NextResponse.json({ message: "Email requerido." }, { status: 400 });
  }
  const assessment = await findAssessmentByEmail(email);
  if (!assessment) {
    return NextResponse.json({ message: "No encontrado." }, { status: 404 });
  }
  return NextResponse.json(assessment);
}
