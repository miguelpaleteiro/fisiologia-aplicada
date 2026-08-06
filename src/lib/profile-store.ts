import type { Exercise, InitialAssessment, Measurement, MemberProfile, PhysicalStats, ProgramStatus } from "@/lib/types";

const apiBase = "/api";

async function parseJson(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Error en el servidor");
  }
  return result;
}

function fetchApi(path: string, options: RequestInit = {}) {
  return fetch(`${apiBase}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

export function getInitialAssessmentDraft(): InitialAssessment | null {
  try {
    return JSON.parse(localStorage.getItem("fisiologia-aplicada:initial-assessment") || "null") as InitialAssessment | null;
  } catch {
    return null;
  }
}

export async function saveInitialAssessmentDraft(assessment: InitialAssessment) {
  localStorage.setItem("fisiologia-aplicada:initial-assessment", JSON.stringify(assessment));
  await parseJson(await fetchApi("/assessments", {
    method: "POST",
    body: JSON.stringify(assessment),
  }));
}

export function clearInitialAssessmentDraft() {
  localStorage.removeItem("fisiologia-aplicada:initial-assessment");
}

export async function getAssessmentByEmail(email: string) {
  return (await parseJson(await fetchApi(`/assessments?email=${encodeURIComponent(email.toLowerCase())}`))) as InitialAssessment;
}

export async function register(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const localDraft = getInitialAssessmentDraft();
  let assessment = localDraft?.email.toLowerCase() === normalizedEmail ? localDraft : undefined;

  if (!assessment) {
    try {
      assessment = await getAssessmentByEmail(normalizedEmail);
    } catch {
      assessment = undefined;
    }
  }

  const payload = {
    name,
    email: normalizedEmail,
    password,
    assessment,
  };

  const profile = await parseJson(await fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }));

  if (localDraft?.email.toLowerCase() === normalizedEmail) {
    clearInitialAssessmentDraft();
  }

  return profile as MemberProfile;
}

export async function login(email: string, password: string) {
  const profile = await parseJson(await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }));
  return profile as MemberProfile;
}

export async function getSession() {
  try {
    const profile = await parseJson(await fetchApi("/auth/session"));
    return profile as MemberProfile;
  } catch {
    return null;
  }
}

export async function getMembers() {
  return (await parseJson(await fetchApi("/members"))) as MemberProfile[];
}

export async function logout() {
  await parseJson(await fetchApi("/auth/logout", { method: "POST" }));
}

export async function saveProfile(profile: MemberProfile) {
  return profile;
}

export async function updateProgramStatus(memberId: string, programStatus: ProgramStatus) {
  return (await parseJson(await fetchApi(`/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({ programStatus }),
  }))) as MemberProfile;
}

export async function saveMemberGoals(memberId: string, goals: Partial<Pick<PhysicalStats, "goalWeight" | "goalDescription">>) {
  return (await parseJson(await fetchApi(`/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify(goals),
  }))) as MemberProfile;
}

export async function saveMeasurement(profile: MemberProfile, measurement: Measurement) {
  return (await parseJson(await fetchApi("/measurements", {
    method: "POST",
    body: JSON.stringify(measurement),
  }))) as MemberProfile;
}

export async function getExercises() {
  return (await parseJson(await fetchApi("/exercises"))) as Exercise[];
}

export async function saveExercises(exercises: Exercise[]) {
  return (await parseJson(await fetchApi("/exercises", {
    method: "PUT",
    body: JSON.stringify(exercises),
  }))) as Exercise[];
}

export async function updateExercise(updated: Exercise) {
  return (await parseJson(await fetchApi("/exercises", {
    method: "PATCH",
    body: JSON.stringify(updated),
  }))) as Exercise;
}

export async function removeExercise(exerciseId: string) {
  return (await parseJson(await fetchApi("/exercises", {
    method: "DELETE",
    body: JSON.stringify({ id: exerciseId }),
  }))) as Exercise[];
}
