import { NextResponse } from "next/server";
import { authenticateSession, listMembers } from "@/lib/server-profile-store";

export async function GET(req: Request) {
  const cookieString = req.headers.get("cookie") || "";
  const sessionToken = cookieString.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("sessionToken="))?.split("=")[1];
  const user = await authenticateSession(sessionToken);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  const members = await listMembers();
  return NextResponse.json(members);
}
