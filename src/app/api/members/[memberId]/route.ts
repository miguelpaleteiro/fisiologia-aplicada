import { NextRequest, NextResponse } from "next/server";
import { authenticateSession, updateProgramStatus, updateMemberGoals } from "@/lib/server-profile-store";

export async function PATCH(req: NextRequest, context: { params: Promise<{ memberId: string }> }) {
  const sessionToken = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const params = await context.params;
  const memberId = params.memberId;

  if (body.programStatus !== undefined) {
    if (user.role !== "creator") {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }

    const updated = await updateProgramStatus(memberId, body.programStatus);
    if (!updated) {
      return NextResponse.json({ message: "No se encontró el cliente." }, { status: 404 });
    }
    return NextResponse.json(updated);
  }

  if (body.goalWeight !== undefined || body.goalDescription !== undefined) {
    if (user.role !== "creator" && user.id !== memberId) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }

    const updated = await updateMemberGoals(memberId, {
      goalWeight: body.goalWeight,
      goalDescription: body.goalDescription,
    });
    if (!updated) {
      return NextResponse.json({ message: "No se encontró el cliente." }, { status: 404 });
    }
    return NextResponse.json(updated);
  }

  return NextResponse.json({ message: "Acción no reconocida." }, { status: 400 });
}
