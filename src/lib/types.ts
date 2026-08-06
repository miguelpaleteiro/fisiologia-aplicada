export type Measurement = {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  leanMass: number;
  waist: number;
  weeklySteps: number;
  weeklyWorkouts: number;
  adherence: number;
  recovery: number;
  sleepHours: number;
  performance: number;
  notes?: string;
};

export type PhysicalStats = Omit<Measurement, "id" | "date" | "notes"> & {
  goalWeight: number;
  goalDescription: string;
  updatedAt: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  active: boolean;
};

export type ProgramStatus = "pending" | "active" | "rejected";

export type InitialAssessment = {
  name: string;
  email: string;
  goal: string;
  experience: string;
  availability: string;
  limitations: string;
  submittedAt?: string;
};

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "member" | "creator";
  programStatus: ProgramStatus;
  assessment?: InitialAssessment;
  stats: PhysicalStats;
  measurements: Measurement[];
};

export type PublicProfile = Omit<MemberProfile, "password"> & { password: string };
