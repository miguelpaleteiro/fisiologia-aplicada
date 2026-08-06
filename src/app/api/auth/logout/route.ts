import { NextResponse } from "next/server";
import { clearSession } from "@/lib/server-profile-store";

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("sessionToken="))?.split("=")[1];
  await clearSession(token);
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.delete("sessionToken");
  return response;
}
