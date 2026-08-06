export type Measurement = { id: string; date: string; weight: number; bodyFat: number; leanMass: number; waist: number; weeklySteps: number; weeklyWorkouts: number; adherence: number; recovery: number; sleepHours: number; performance: number; notes?: string };
export type PhysicalStats = Omit<Measurement, "id" | "date" | "notes"> & { goalWeight: number; updatedAt: string };
export type Exercise = { id: string; name: string; category: string; sets: number; reps: string; active: boolean };
export type ProgramStatus = "pending" | "active" | "rejected";
export type InitialAssessment = { name: string; email: string; goal: string; experience: string; availability: string; limitations: string; submittedAt?: string };
export type MemberProfile = { id: string; name: string; email: string; password: string; role: "member" | "creator"; programStatus: ProgramStatus; assessment?: InitialAssessment; stats: PhysicalStats; measurements: Measurement[] };
const accountsKey = "fisiologia-aplicada:accounts"; const sessionKey = "fisiologia-aplicada:session"; const exercisesKey = "fisiologia-aplicada:exercises"; const assessmentDraftKey = "fisiologia-aplicada:initial-assessment";
const today = () => new Date().toISOString().slice(0, 10);
const defaults: PhysicalStats = { weight: 78.5, goalWeight: 74, bodyFat: 18.5, leanMass: 63.4, waist: 82, weeklySteps: 8000, weeklyWorkouts: 4, adherence: 92, recovery: 85, sleepHours: 8, performance: 12, updatedAt: new Date().toISOString() };
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
type StoredProfile = Partial<MemberProfile> & { stats?: Partial<PhysicalStats>; measurements?: Array<Partial<Measurement>> };
function migrate(value: StoredProfile): MemberProfile {
  const stats: PhysicalStats = { ...defaults, ...value.stats, updatedAt: value.stats?.updatedAt || defaults.updatedAt };
  const legacy: Measurement = { id: "initial", date: stats.updatedAt.slice(0, 10) || today(), weight: stats.weight, bodyFat: stats.bodyFat, leanMass: stats.leanMass, waist: stats.waist, weeklySteps: stats.weeklySteps, weeklyWorkouts: stats.weeklyWorkouts, adherence: stats.adherence, recovery: stats.recovery, sleepHours: stats.sleepHours, performance: stats.performance };
  const measurements = value.measurements?.length ? value.measurements.map((measurement) => ({ ...legacy, ...measurement, weeklySteps: measurement.weeklySteps ?? stats.weeklySteps, weeklyWorkouts: measurement.weeklyWorkouts ?? stats.weeklyWorkouts, adherence: measurement.adherence ?? stats.adherence, recovery: measurement.recovery ?? stats.recovery, sleepHours: measurement.sleepHours ?? stats.sleepHours, performance: measurement.performance ?? stats.performance, id: measurement.id || crypto.randomUUID() })) : [legacy];
  const role = value.role || "member";
  return { id: value.id || crypto.randomUUID(), name: value.name || "Usuario", email: value.email || "", password: value.password || "", role, programStatus: value.programStatus || (role === "creator" ? "active" : "pending"), assessment: value.assessment, stats, measurements };
}
const read = (): MemberProfile[] => { try { return (JSON.parse(localStorage.getItem(accountsKey) || "[]") as MemberProfile[]).map(migrate); } catch { return []; } };
const write = (profiles: MemberProfile[]) => localStorage.setItem(accountsKey, JSON.stringify(profiles));
export function ensureCreatorAccount() { const accounts = read(); if (accounts.some((account) => account.role === "creator")) return; write([...accounts, { id: crypto.randomUUID(), name: "Miguel", email: "miguel@fisiologiaaplicada.app", password: "FisioAdmin2026!", role: "creator", programStatus: "active", stats: defaults, measurements: [] }]); }
export function getInitialAssessmentDraft(): InitialAssessment | null { try { return JSON.parse(localStorage.getItem(assessmentDraftKey) || "null") as InitialAssessment | null; } catch { return null; } }
export function saveInitialAssessmentDraft(assessment: InitialAssessment) { localStorage.setItem(assessmentDraftKey, JSON.stringify(assessment)); }
export function clearInitialAssessmentDraft() { localStorage.removeItem(assessmentDraftKey); }
export function register(name: string, email: string, password: string) { const accounts = read(); const normalizedEmail = email.toLowerCase(); if (accounts.some((account) => account.email === normalizedEmail)) throw new Error("Ya existe una cuenta con este correo."); const draft = getInitialAssessmentDraft(); const assessment = draft?.email.toLowerCase() === normalizedEmail ? { ...draft, name } : undefined; const first: Measurement = { id: crypto.randomUUID(), date: today(), weight: defaults.weight, bodyFat: defaults.bodyFat, leanMass: defaults.leanMass, waist: defaults.waist, weeklySteps: defaults.weeklySteps, weeklyWorkouts: defaults.weeklyWorkouts, adherence: defaults.adherence, recovery: defaults.recovery, sleepHours: defaults.sleepHours, performance: defaults.performance }; const profile: MemberProfile = { id: crypto.randomUUID(), name, email: normalizedEmail, password, role: "member", programStatus: "pending", assessment, stats: defaults, measurements: [first] }; write([...accounts, profile]); if (assessment) clearInitialAssessmentDraft(); localStorage.setItem(sessionKey, profile.id); return profile; }
export function login(email: string, password: string) { ensureCreatorAccount(); const profile = read().find((account) => account.email === email.toLowerCase() && account.password === password); if (!profile) throw new Error("El correo o la contraseña no coinciden."); localStorage.setItem(sessionKey, profile.id); return profile; }
export const getSession = () => read().find((account) => account.id === localStorage.getItem(sessionKey)) || null;
export const getMembers = () => read().filter((account) => account.role === "member");
export const logout = () => localStorage.removeItem(sessionKey);
export function saveProfile(profile: MemberProfile) { write(read().map((account) => account.id === profile.id ? profile : account)); }
export function updateProgramStatus(memberId: string, programStatus: ProgramStatus) { const accounts = read(); const member = accounts.find((account) => account.id === memberId && account.role === "member"); if (!member) return null; const next = { ...member, programStatus }; write(accounts.map((account) => account.id === memberId ? next : account)); return next; }
export function saveMeasurement(profile: MemberProfile, measurement: Measurement) { const entries = [...profile.measurements.filter((entry) => entry.date !== measurement.date), measurement].sort((a, b) => a.date.localeCompare(b.date)); const next: MemberProfile = { ...profile, measurements: entries, stats: { ...profile.stats, weight: measurement.weight, bodyFat: measurement.bodyFat, leanMass: measurement.leanMass, waist: measurement.waist, weeklySteps: measurement.weeklySteps, weeklyWorkouts: measurement.weeklyWorkouts, adherence: measurement.adherence, recovery: measurement.recovery, sleepHours: measurement.sleepHours, performance: measurement.performance, updatedAt: `${measurement.date}T12:00:00` } }; saveProfile(next); return next; }
export function getExercises(): Exercise[] { try { const existing = JSON.parse(localStorage.getItem(exercisesKey) || "[]") as Exercise[]; return existing.length ? [...existing, ...starterExercises.filter((starter) => !existing.some((exercise) => exercise.id === starter.id))] : starterExercises; } catch { return starterExercises; } }
export const saveExercises = (exercises: Exercise[]) => localStorage.setItem(exercisesKey, JSON.stringify(exercises));
