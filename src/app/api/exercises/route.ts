import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { authenticateSession, listExercises, addExercise, saveExercises, deleteExercise, updateExercise } from "@/lib/server-profile-store";
import type { Exercise } from "@/lib/types";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  const exercises = await listExercises();
  return NextResponse.json(exercises);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  const body = await req.json();
  const exercise: Exercise = {
    id: body.id || crypto.randomUUID(),
    name: String(body.name || "").trim(),
    category: String(body.category || "General").trim() || "General",
    sets: Number(body.sets) || 3,
    reps: String(body.reps || "8–12").trim(),
    active: body.active === false ? false : true,
  };
  if (!exercise.name) {
    return NextResponse.json({ message: "El nombre del ejercicio es obligatorio." }, { status: 400 });
  }
  const created = await addExercise(exercise);
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  const exercises = await req.json() as Exercise[];
  const saved = await saveExercises(exercises);
  return NextResponse.json(saved);
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ message: "ID de ejercicio requerido." }, { status: 400 });
  }
  const exercise: Exercise = {
    id: String(body.id),
    name: String(body.name || "").trim(),
    category: String(body.category || "General").trim() || "General",
    sets: Number(body.sets) || 3,
    reps: String(body.reps || "8–12").trim(),
    active: body.active === false ? false : true,
  };
  const updated = await updateExercise(exercise);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("sessionToken")?.value;
  const user = await authenticateSession(token);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  const body = await req.json();
  const exerciseId = String(body.id || "").trim();
  if (!exerciseId) {
    return NextResponse.json({ message: "ID de ejercicio requerido." }, { status: 400 });
  }
  await deleteExercise(exerciseId);
  return NextResponse.json({ message: "Ejercicio eliminado" });
}
