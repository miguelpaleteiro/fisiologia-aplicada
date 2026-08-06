import { join } from "node:path";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import crypto from "node:crypto";
import type { Exercise, InitialAssessment, MemberProfile, Measurement, PhysicalStats, ProgramStatus } from "@/lib/types";

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTIONS_WORKER_RUNTIME);
const storeDir = isServerless ? join("/tmp", "data") : join(process.cwd(), "data");
const storePath = join(storeDir, "db.json");

const today = () => new Date().toISOString().slice(0, 10);

const defaultStats: PhysicalStats = {
  weight: 78.5,
  goalWeight: 74,
  goalDescription: "Mejorar composición corporal",
  bodyFat: 18.5,
  leanMass: 63.4,
  waist: 82,
  weeklySteps: 8000,
  weeklyWorkouts: 4,
  adherence: 92,
  recovery: 85,
  sleepHours: 8,
  performance: 12,
  updatedAt: new Date().toISOString(),
};

const starterExercises: Exercise[] = [
  { id: "press", name: "Press de banca", category: "Upper A", sets: 4, reps: "6–8", active: true },
  { id: "row", name: "Remo con barra", category: "Upper A", sets: 4, reps: "6–8", active: true },
  { id: "upper-a-incline", name: "Press inclinado con mancuernas", category: "Upper A", sets: 3, reps: "8–10", active: true },
  { id: "upper-a-pulldown", name: "Jalón al pecho", category: "Upper A", sets: 3, reps: "8–12", active: true },
  { id: "upper-a-lateral", name: "Elevaciones laterales", category: "Upper A", sets: 3, reps: "12–15", active: true },
  { id: "squat", name: "Sentadilla", category: "Lower A", sets: 4, reps: "5–8", active: true },
  { id: "lower-a-rdl", name: "Peso muerto rumano", category: "Lower A", sets: 3, reps: "8–10", active: true },
  { id: "lower-a-press", name: "Prensa de piernas", category: "Lower A", sets: 3, reps: "10–12", active: true },
  { id: "lower-a-curl", name: "Curl femoral", category: "Lower A", sets: 3, reps: "10–12", active: true },
  { id: "upper-b-ohp", name: "Press militar", category: "Upper B", sets: 3, reps: "6–8", active: true },
  { id: "upper-b-pullup", name: "Dominadas o jalón neutro", category: "Upper B", sets: 4, reps: "6–10", active: true },
  { id: "upper-b-chest", name: "Aperturas en polea", category: "Upper B", sets: 3, reps: "10–15", active: true },
  { id: "upper-b-curl", name: "Curl de bíceps", category: "Upper B", sets: 3, reps: "10–12", active: true },
  { id: "lower-b-hip-thrust", name: "Hip thrust", category: "Lower B", sets: 4, reps: "8–10", active: true },
  { id: "lower-b-lunge", name: "Zancadas búlgaras", category: "Lower B", sets: 3, reps: "8–10", active: true },
  { id: "lower-b-extension", name: "Extensión de cuádriceps", category: "Lower B", sets: 3, reps: "12–15", active: true },
  { id: "lower-b-calf", name: "Elevación de gemelos", category: "Lower B", sets: 4, reps: "10–15", active: true },
];

type StoredSession = { token: string; userId: string; expiresAt: string };

type Database = {
  users: MemberProfile[];
  exercises: Exercise[];
  sessions: StoredSession[];
  assessments: InitialAssessment[];
};

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function createMeasurement(overrides: Partial<Measurement> = {}): Measurement {
  return {
    id: crypto.randomUUID(),
    date: today(),
    weight: defaultStats.weight,
    bodyFat: defaultStats.bodyFat,
    leanMass: defaultStats.leanMass,
    waist: defaultStats.waist,
    weeklySteps: defaultStats.weeklySteps,
    weeklyWorkouts: defaultStats.weeklyWorkouts,
    adherence: defaultStats.adherence,
    recovery: defaultStats.recovery,
    sleepHours: defaultStats.sleepHours,
    performance: defaultStats.performance,
    ...overrides,
  };
}

export function sanitizeProfile(profile: MemberProfile): MemberProfile {
  return { ...profile, password: "" };
}

async function ensureDataFolder() {
  await mkdir(storeDir, { recursive: true });
  try {
    await access(storePath);
  } catch {
    const creatorProfile: MemberProfile = {
      id: crypto.randomUUID(),
      name: "Miguel",
      email: "miguel@fisiologiaaplicada.app",
      password: hashPassword("FisioAdmin2026!"),
      role: "creator",
      programStatus: "active",
      stats: defaultStats,
      measurements: [],
    };

    const initialData: Database = {
      users: [creatorProfile],
      exercises: starterExercises,
      sessions: [],
      assessments: [],
    };

    await writeFile(storePath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

async function readDatabase(): Promise<Database> {
  await ensureDataFolder();
  const raw = await readFile(storePath, "utf8");
  return JSON.parse(raw) as Database;
}

async function writeDatabase(database: Database) {
  await writeFile(storePath, JSON.stringify(database, null, 2), "utf8");
}

export async function authenticateSession(token?: string) {
  if (!token) return null;
  const database = await readDatabase();
  const session = database.sessions.find((entry) => entry.token === token && new Date(entry.expiresAt) > new Date());
  if (!session) return null;
  const user = database.users.find((account) => account.id === session.userId);
  return user ?? null;
}

export async function createSession(userId: string) {
  const database = await readDatabase();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  database.sessions = [...database.sessions.filter((session) => session.userId !== userId), { token, userId, expiresAt }];
  await writeDatabase(database);
  return token;
}

export async function clearSession(token?: string) {
  if (!token) return;
  const database = await readDatabase();
  database.sessions = database.sessions.filter((session) => session.token !== token);
  await writeDatabase(database);
}

export async function findUserByEmail(email: string) {
  const database = await readDatabase();
  return database.users.find((account) => account.email === email.toLowerCase()) || null;
}

export async function saveUser(user: MemberProfile) {
  const database = await readDatabase();
  const next = database.users.map((account) => (account.id === user.id ? user : account));
  if (!next.some((account) => account.id === user.id)) {
    next.push(user);
  }
  database.users = next;
  await writeDatabase(database);
  return sanitizeProfile(user);
}

export async function createUser(user: Omit<MemberProfile, "id">) {
  const database = await readDatabase();
  const nextUser: MemberProfile = { ...user, id: crypto.randomUUID() };
  database.users.push(nextUser);
  await writeDatabase(database);
  return sanitizeProfile(nextUser);
}

export async function listMembers() {
  const database = await readDatabase();
  return database.users.filter((account) => account.role === "member").map(sanitizeProfile);
}

export async function listExercises() {
  const database = await readDatabase();
  return database.exercises;
}

export async function saveExercises(exercises: Exercise[]) {
  const database = await readDatabase();
  database.exercises = exercises;
  await writeDatabase(database);
  return exercises;
}

export async function addExercise(exercise: Exercise) {
  const database = await readDatabase();
  database.exercises.push(exercise);
  await writeDatabase(database);
  return exercise;
}

export async function updateExercise(exercise: Exercise) {
  const database = await readDatabase();
  database.exercises = database.exercises.map((current) => (current.id === exercise.id ? exercise : current));
  await writeDatabase(database);
  return exercise;
}

export async function deleteExercise(exerciseId: string) {
  const database = await readDatabase();
  database.exercises = database.exercises.filter((exercise) => exercise.id !== exerciseId);
  await writeDatabase(database);
}

export async function saveMeasurementForUser(userId: string, measurement: Measurement) {
  const database = await readDatabase();
  const profile = database.users.find((account) => account.id === userId);
  if (!profile) return null;
  const entries = [...profile.measurements.filter((entry) => entry.date !== measurement.date), measurement].sort((a, b) => a.date.localeCompare(b.date));
  const nextStats = {
    ...profile.stats,
    weight: measurement.weight,
    bodyFat: measurement.bodyFat,
    leanMass: measurement.leanMass,
    waist: measurement.waist,
    weeklySteps: measurement.weeklySteps,
    weeklyWorkouts: measurement.weeklyWorkouts,
    adherence: measurement.adherence,
    recovery: measurement.recovery,
    sleepHours: measurement.sleepHours,
    performance: measurement.performance,
    updatedAt: `${measurement.date}T12:00:00`,
  };
  const nextProfile = { ...profile, measurements: entries, stats: nextStats };
  database.users = database.users.map((account) => (account.id === userId ? nextProfile : account));
  await writeDatabase(database);
  return sanitizeProfile(nextProfile);
}

export async function updateProgramStatus(memberId: string, programStatus: ProgramStatus) {
  const database = await readDatabase();
  const profile = database.users.find((account) => account.id === memberId && account.role === "member");
  if (!profile) return null;
  const next = { ...profile, programStatus };
  database.users = database.users.map((account) => (account.id === memberId ? next : account));
  await writeDatabase(database);
  return sanitizeProfile(next);
}

export async function updateMemberGoals(memberId: string, goals: Partial<Pick<PhysicalStats, "goalWeight" | "goalDescription">>) {
  const database = await readDatabase();
  const profile = database.users.find((account) => account.id === memberId);
  if (!profile) return null;
  const next: MemberProfile = { ...profile, stats: { ...profile.stats, ...goals, updatedAt: new Date().toISOString() } };
  database.users = database.users.map((account) => (account.id === memberId ? next : account));
  await writeDatabase(database);
  return sanitizeProfile(next);
}

export async function saveAssessment(assessment: InitialAssessment) {
  const database = await readDatabase();
  database.assessments = database.assessments.filter((entry) => entry.email !== assessment.email.toLowerCase());
  database.assessments.push({ ...assessment, email: assessment.email.toLowerCase() });
  await writeDatabase(database);
  return assessment;
}

export async function findAssessmentByEmail(email: string) {
  const database = await readDatabase();
  return database.assessments.find((entry) => entry.email === email.toLowerCase()) || null;
}

export async function deleteAssessmentByEmail(email: string) {
  const database = await readDatabase();
  database.assessments = database.assessments.filter((entry) => entry.email !== email.toLowerCase());
  await writeDatabase(database);
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  return user.password === hashPassword(password) ? user : null;
}

export async function createMemberProfile(name: string, email: string, password: string, assessment?: InitialAssessment) {
  const goalDescription = assessment?.goal ?? defaultStats.goalDescription;
  const firstMeasurement = createMeasurement({ date: today() });
  const newUser: Omit<MemberProfile, "id"> = {
    name,
    email: email.toLowerCase(),
    password: hashPassword(password),
    role: "member",
    programStatus: "pending",
    assessment,
    stats: { ...defaultStats, goalDescription },
    measurements: [firstMeasurement],
  };
  return createUser(newUser);
}
