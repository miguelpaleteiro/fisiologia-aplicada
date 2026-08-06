import { NextRequest, NextResponse } from "next/server";
import { authenticateSession, saveMeasurementForUser, sanitizeProfile } from "@/lib/server-profile-store";
import type { Measurement } from "@/lib/types";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const measurement = await req.json() as Measurement;
  if (!measurement.date || !measurement.weight) {
    return NextResponse.json({ message: "Fecha y peso son obligatorios." }, { status: 400 });
  }

  const updated = await saveMeasurementForUser(user.id, measurement);
  if (!updated) {
    return NextResponse.json({ message: "No se pudo guardar el registro." }, { status: 500 });
  }

  return NextResponse.json(sanitizeProfile(updated));
}
