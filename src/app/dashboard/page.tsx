"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExerciseLibrary from "@/components/dashboard/ExerciseLibrary";
import {
  Exercise,
  getExercises,
  getMembers,
  getSession,
  logout,
  Measurement,
  MemberProfile,
  ProgramStatus,
  saveExercises,
  saveMeasurement,
  saveMemberGoals,
  updateExercise,
  removeExercise,
  updateProgramStatus,
} from "@/lib/profile-store";

type Section = "progreso" | "registro" | "entrenamiento" | "recomendaciones" | "creador";

const navigation = [
  { id: "progreso", icon: "◉", label: "Mi evolución" },
  { id: "registro", icon: "＋", label: "Nuevo registro" },
  { id: "entrenamiento", icon: "⌁", label: "Entrenamiento" },
  { id: "recomendaciones", icon: "✦", label: "Recomendaciones" },
] as const;

const emptyMeasurement = (): Measurement => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  weight: 0,
  bodyFat: 0,
  leanMass: 0,
  waist: 0,
  weeklySteps: 0,
  weeklyWorkouts: 0,
  adherence: 0,
  recovery: 0,
  sleepHours: 0,
  performance: 0,
  notes: "",
});

function newMeasurement(profile: MemberProfile): Measurement {
  return {
    ...emptyMeasurement(),
    weight: profile.stats.weight,
    bodyFat: profile.stats.bodyFat,
    leanMass: profile.stats.leanMass,
    waist: profile.stats.waist,
    weeklySteps: profile.stats.weeklySteps,
    weeklyWorkouts: profile.stats.weeklyWorkouts,
    adherence: profile.stats.adherence,
    recovery: profile.stats.recovery,
    sleepHours: profile.stats.sleepHours,
    performance: profile.stats.performance,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [section, setSection] = useState<Section>("progreso");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<Measurement>(emptyMeasurement);
  const [goalForm, setGoalForm] = useState({ goalWeight: 0, goalDescription: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const refresh = () => {
      const current = getSession();

      if (!current) {
        router.replace("/login");
        return;
      }

      setProfile(current);
      setMembers(getMembers());
      setExercises(getExercises());
      setForm(newMeasurement(current));
      setGoalForm({ goalWeight: current.stats.goalWeight, goalDescription: current.stats.goalDescription });
    };

    const frame = window.requestAnimationFrame(refresh);
    const handleStorage = () => refresh();

    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", handleStorage);
    };
  }, [router]);

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-300" role="status">
        Cargando tu perfil…
      </main>
    );
  }

  const isCreator = profile.role === "creator";
  const hasProgramAccess = isCreator || profile.programStatus === "active";
  const records = [...profile.measurements].sort((a, b) => a.date.localeCompare(b.date));
  const remaining = Math.max(0, profile.stats.weight - profile.stats.goalWeight);

  function goTo(nextSection: Section) {
    setSection(nextSection);
    setNotice("");
  }

  function submitMeasurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) return;

    if (!form.date || form.weight <= 0) {
      setNotice("Indica una fecha y un peso válido para guardar el registro.");
      return;
    }

    const next = saveMeasurement(profile, form);
    setProfile(next);
    setForm(newMeasurement(next));
    setNotice("Registro guardado. Tu evolución ya está actualizada.");
  }

  function saveGoals(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;

    if (!Number.isFinite(goalForm.goalWeight) || goalForm.goalWeight <= 0) {
      setNotice("Define un objetivo de peso válido antes de guardar.");
      return;
    }

    const next = saveMemberGoals(profile.id, {
      goalWeight: goalForm.goalWeight,
      goalDescription: goalForm.goalDescription.trim() || "Mejorar composición corporal",
    });

    if (!next) {
      setNotice("No se pudo guardar el objetivo. Inténtalo de nuevo.");
      return;
    }

    setProfile(next);
    setMembers(getMembers());
    setNotice("Objetivo actualizado correctamente.");
  }

  function addExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();

    if (!name) {
      setNotice("Escribe un nombre para añadir el ejercicio.");
      return;
    }

    const next = [
      ...exercises,
      {
        id: crypto.randomUUID(),
        name,
        category: String(data.get("category") || "General"),
        sets: Number(data.get("sets") || 3),
        reps: String(data.get("reps") || "8–12"),
        active: true,
      },
    ];

    saveExercises(next);
    setExercises(next);
    event.currentTarget.reset();
    setNotice(`${name} se ha añadido al plan activo.`);
  }

  function updateExerciseFields(updated: Exercise) {
    const next = updateExercise(updated);
    setExercises(next);
    setNotice(`Ejercicio "${updated.name}" actualizado.`);
  }

  function deleteExercise(exerciseId: string) {
    const next = removeExercise(exerciseId);
    setExercises(next);
    setNotice("Ejercicio eliminado del plan.");
  }

  function toggleExerciseActive(exerciseId: string) {
    const target = exercises.find((exercise) => exercise.id === exerciseId);
    if (!target) return;
    const updated = { ...target, active: !target.active };
    updateExerciseFields(updated);
  }

  function saveClientGoals(memberId: string, goals: { goalWeight: number; goalDescription: string }) {
    if (!Number.isFinite(goals.goalWeight) || goals.goalWeight <= 0) {
      setNotice("Define un objetivo de peso válido para el cliente.");
      return;
    }

    const updated = saveMemberGoals(memberId, { ...goals, goalDescription: goals.goalDescription.trim() || "Mejorar composición corporal" });
    if (!updated) {
      setNotice("No se pudo actualizar el objetivo del cliente.");
      return;
    }

    setMembers(getMembers());
    setNotice(`Objetivos de ${updated.name} guardados.`);
  }

  function completeWorkout(routine: string) {
    if (!profile) return;
    const date = new Date().toISOString().slice(0, 10);
    const current = profile.measurements.find((measurement) => measurement.date === date) ?? { ...newMeasurement(profile), date };
    const measurement = { ...current, weeklyWorkouts: Math.min(14, current.weeklyWorkouts + 1) };
    const next = saveMeasurement(profile, measurement);
    setProfile(next);
    setForm(newMeasurement(next));
    setNotice(`${routine} marcada como realizada. Se ha actualizado el total semanal.`);
  }

  function closeSession() {
    logout();
    router.push("/login");
  }

  function changeProgramStatus(memberId: string, status: ProgramStatus) {
    const updated = updateProgramStatus(memberId, status);
    if (!updated) return;
    setMembers(getMembers());
    setNotice(`${updated.name} ahora figura como ${status === "active" ? "aceptado" : status === "rejected" ? "no aceptado" : "pendiente"}.`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {hasProgramAccess && <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 p-6 md:flex">
          <Link href="/" className="text-xl font-black tracking-tight">
            Fisiología <span className="text-sky-400">Aplicada</span>
          </Link>

          <DashboardNavigation section={section} isCreator={isCreator} onNavigate={goTo} className="mt-12 space-y-2" />

          <a
            href="https://www.instagram.com/miguelpaleteiro/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto rounded-xl border border-violet-400/20 bg-violet-400/10 p-3 text-xs text-violet-100 transition hover:border-violet-300/50"
          >
            <b className="block text-amber-300">◎ @miguelpaleteiro</b>
            <span className="mt-1 block text-slate-400">Entrenamiento y fisiología aplicada</span>
          </a>
          <button type="button" onClick={closeSession} className="mt-4 text-left text-xs text-slate-500 transition hover:text-white">
            Cerrar sesión
          </button>
        </aside>}

        <section className="min-w-0 flex-1 p-5 md:p-9">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">{isCreator ? "Centro de control" : "Tu seguimiento personal"}</p>
              <h1 className="mt-1 text-2xl font-bold">
                Hola, {profile.name.split(" ")[0]} <span className="text-amber-300">✦</span>
              </h1>
            </div>
            <button type="button" onClick={closeSession} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-white/30 hover:text-white">
              Salir
            </button>
          </header>

          {hasProgramAccess && <DashboardNavigation section={section} isCreator={isCreator} onNavigate={goTo} className="mt-6 flex gap-2 overflow-x-auto pb-1 md:hidden" mobile />}

          {hasProgramAccess && notice && (
            <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {notice}
            </p>
          )}

          {hasProgramAccess ? <>
            {section === "progreso" && <Progress profile={profile} records={records} remaining={remaining} goalForm={goalForm} onGoalFieldChange={(key, value) => setGoalForm({ ...goalForm, [key]: value })} onSaveGoals={saveGoals} onAddRecord={() => goTo("registro")} />}
            {section === "registro" && <MeasurementForm form={form} setForm={setForm} onSubmit={submitMeasurement} />}
            {section === "entrenamiento" && <Training exercises={exercises} onCompleteWorkout={completeWorkout} />}
            {section === "recomendaciones" && <Recommendations remaining={remaining} records={records} onAddRecord={() => goTo("registro")} />}
            {section === "creador" && isCreator && <Creator members={members} exercises={exercises} onAddExercise={addExercise} onChangeStatus={changeProgramStatus} onUpdateExercise={updateExerciseFields} onToggleExercise={toggleExerciseActive} onRemoveExercise={deleteExercise} onSaveClientGoals={saveClientGoals} />}
          </> : <ProgramAccessState profile={profile} />}
        </section>
      </div>
    </main>
  );
}

function ProgramAccessState({ profile }: { profile: MemberProfile }) {
  const pending = profile.programStatus === "pending";

  return (
    <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[.03] p-7 text-center sm:p-10">
      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl ${pending ? "bg-amber-300/10 text-amber-300" : "bg-rose-400/10 text-rose-300"}`}>
        {pending ? "⌛" : "–"}
      </div>
      <p className={`mt-6 text-xs font-bold tracking-[.15em] ${pending ? "text-amber-300" : "text-rose-300"}`}>{pending ? "SOLICITUD EN REVISIÓN" : "SOLICITUD NO ACEPTADA"}</p>
      <h2 className="mt-3 text-2xl font-bold">{pending ? "Tu programa está pendiente de aprobación" : "Tu acceso al programa no está activo"}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">{pending ? "El creador revisará tu valoración inicial antes de activar tu plan, tus rutinas y tu seguimiento." : "Puedes contactar con el creador para conocer los siguientes pasos o enviar una nueva valoración."}</p>
      {profile.assessment ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left text-sm">
          <p className="text-xs font-bold tracking-[.12em] text-slate-500">VALORACIÓN ENVIADA</p>
          <p className="mt-2 font-semibold text-white">{profile.assessment.goal}</p>
          <p className="mt-1 text-slate-400">Nivel {profile.assessment.experience.toLowerCase()} · {profile.assessment.availability} días disponibles</p>
        </div>
      ) : (
        <Link href="/#contacto" className="mt-6 inline-flex rounded-xl border border-sky-400/40 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/10">Completar valoración inicial</Link>
      )}
      <a href="https://instagram.com/miguelpaleteiro" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-sm font-semibold text-sky-300 transition hover:text-sky-100">Contactar por Instagram →</a>
    </section>
  );
}

function DashboardNavigation({
  section,
  isCreator,
  onNavigate,
  className,
  mobile = false,
}: {
  section: Section;
  isCreator: boolean;
  onNavigate: (section: Section) => void;
  className: string;
  mobile?: boolean;
}) {
  const items = isCreator ? [...navigation, { id: "creador" as const, icon: "✦", label: "Modo creador" }] : navigation;

  return (
    <nav aria-label="Secciones del panel" className={className}>
      {items.map((item) => {
        const active = section === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
              mobile ? "shrink-0 px-3 py-2" : "block w-full px-4 py-3"
            } ${
              active
                ? item.id === "creador"
                  ? "bg-amber-300 font-bold text-slate-950"
                  : "bg-violet-500 font-semibold text-white"
                : item.id === "creador"
                  ? "border border-amber-400/30 text-amber-300 hover:bg-amber-300/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span className="ml-2">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Progress({ profile, records, remaining, goalForm, onGoalFieldChange, onSaveGoals, onAddRecord }: { profile: MemberProfile; records: Measurement[]; remaining: number; goalForm: { goalWeight: number; goalDescription: string }; onGoalFieldChange: (key: "goalWeight" | "goalDescription", value: string | number) => void; onSaveGoals: (event: FormEvent<HTMLFormElement>) => void; onAddRecord: () => void }) {
  return (
    <>
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-700 via-indigo-700 to-sky-700 p-7">
        <p className="text-[10px] font-bold tracking-[.15em] text-violet-200">PLAN DE TRANSFORMACIÓN</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight">Cambios que<br /><em className="font-serif font-normal">puedes medir.</em></h2>
        <p className="mt-3 max-w-sm text-sm text-violet-100">Tu evolución se calcula con tus registros fechados, no con datos de ejemplo.</p>
        <p className="mt-3 max-w-sm text-sm text-slate-300">Objetivo actual: {profile.stats.goalDescription}</p>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <span className="text-[10px] text-violet-100">Meta actual</span>
            <strong className="block text-2xl">{profile.stats.goalWeight.toFixed(1)} <small className="text-xs">kg</small></strong>
            <p className="text-xs text-violet-100">{remaining.toFixed(1)} kg por recorrer</p>
          </div>
          <button type="button" onClick={onAddRecord} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-violet-100">
            Registrar hoy
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">AJUSTA TUS OBJETIVOS</p>
            <h2 className="mt-1 text-xl font-semibold">Objetivos personales</h2>
          </div>
          <span className="text-xs text-slate-400">Estos ajustes se guardan en tu perfil</span>
        </div>

        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={onSaveGoals}>
          <label className="grid gap-2 text-xs font-semibold text-slate-400">
            Meta de peso
            <input
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
              type="number"
              min="1"
              step="0.1"
              value={goalForm.goalWeight}
              onChange={(event) => onGoalFieldChange("goalWeight", Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-400 sm:col-span-2">
            Objetivo principal
            <input
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
              type="text"
              value={goalForm.goalDescription}
              onChange={(event) => onGoalFieldChange("goalDescription", event.target.value)}
              placeholder="Por ejemplo: ganar fuerza, mejorar composición corporal"
            />
          </label>
          <button type="submit" className="sm:col-span-2 rounded-xl bg-violet-500 py-3 text-sm font-bold transition hover:bg-violet-400">
            Guardar objetivos
          </button>
        </form>
      </section>

      <WeeklyOverview profile={profile} records={records} />

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="PESO ACTUAL" value={profile.stats.weight.toFixed(1)} unit="kg" detail={`${records.length} registros`} tone="text-rose-300" />
        <Metric label="GRASA CORPORAL" value={profile.stats.bodyFat.toFixed(1)} unit="%" detail="último registro" tone="text-violet-300" />
        <Metric label="MASA MAGRA" value={profile.stats.leanMass.toFixed(1)} unit="kg" detail="último registro" tone="text-emerald-300" />
        <Metric label="MEDIA DE PASOS" value={Math.round(profile.stats.weeklySteps).toLocaleString("es-ES")} unit="pasos/día" detail="media de la semana" tone="text-sky-300" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.8fr]">
        <EvolutionChart records={records} />
        <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">HISTORIAL</p>
          <h2 className="mt-1 font-semibold">Tus últimos registros</h2>
          <div className="mt-4 space-y-3">
            {records.slice(-5).reverse().map((record) => (
              <div key={record.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 text-xs">
                <span className="text-slate-400">{new Date(`${record.date}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                <b>{record.weight.toFixed(1)} kg</b>
                <span className="text-slate-500">{record.bodyFat.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function WeeklyOverview({ profile, records }: { profile: MemberProfile; records: Measurement[] }) {
  const { weight, goalWeight, adherence, recovery, weeklyWorkouts, weeklySteps, sleepHours, performance } = profile.stats;
  const startWeight = records[0]?.weight ?? weight;
  const totalDistance = Math.abs(startWeight - goalWeight);
  const coveredDistance = Math.abs(startWeight - weight);
  const weightProgress = totalDistance === 0 ? 100 : Math.min(100, Math.round((coveredDistance / totalDistance) * 100));
  const nextSessions = ["Upper A", "Lower A", "Upper B", "Lower B"];
  const nextRoutine = nextSessions[new Date().getDay() % nextSessions.length];

  return (
    <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
      <article className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Evolución</h2>
          <span className={`rounded-full px-3 py-2 text-xs font-bold ${recovery >= 70 ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-300/15 text-amber-200"}`}>● {recovery >= 70 ? "En progreso" : "Ajustar carga"}</span>
        </div>
        <div className="mt-7 space-y-6">
          <ProgressBar label="Objetivo de peso" value={`${weight.toFixed(1)} kg`} progress={weightProgress} tone="bg-sky-400" detail={`Meta: ${goalWeight.toFixed(1)} kg`} />
          <ProgressBar label="Adherencia" value={`${adherence.toFixed(0)}%`} progress={adherence} tone="bg-emerald-400" />
          <ProgressBar label="Recuperación" value={`${recovery.toFixed(0)}%`} progress={recovery} tone="bg-violet-400" />
        </div>
        <div className="mt-7 rounded-2xl border border-sky-400/35 bg-sky-400/5 p-4">
          <p className="text-xs text-slate-300">Próximo entrenamiento</p>
          <p className="mt-1 font-bold">{nextRoutine} · Próxima sesión</p>
        </div>
      </article>
      <div className="grid grid-cols-2 gap-4">
        <Snapshot label="ENTRENOS" value={String(weeklyWorkouts)} detail="esta semana" tone="text-emerald-300" />
        <Snapshot label="PASOS" value={formatSteps(weeklySteps * 7)} detail="total semanal" tone="text-sky-300" />
        <Snapshot label="SUEÑO" value={`${sleepHours.toFixed(1)} h`} detail={sleepHours >= 7 ? "recuperación adecuada" : "prioriza descanso"} tone="text-violet-300" />
        <Snapshot label="RENDIMIENTO" value={`${performance >= 0 ? "↑" : "↓"}${Math.abs(performance).toFixed(0)}%`} detail={performance >= 0 ? "tendencia positiva" : "revisa la recuperación"} tone={performance >= 0 ? "text-emerald-300" : "text-rose-300"} />
      </div>
    </section>
  );
}

function ProgressBar({ label, value, progress, tone, detail }: { label: string; value: string; progress: number; tone: string; detail?: string }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4"><span className="text-sm text-slate-400">{label}{detail && <small className="ml-2 text-xs text-slate-600">{detail}</small>}</span><b>{value}</b></div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
    </div>
  );
}

function Snapshot({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return <article className="rounded-2xl border border-white/10 bg-slate-900/65 p-5"><p className="text-xs text-slate-400">{label}</p><strong className="mt-3 block text-3xl sm:text-4xl">{value}</strong><span className={`mt-3 block text-xs ${tone}`}>{detail}</span></article>;
}

function formatSteps(steps: number) {
  return steps >= 1000 ? `${(steps / 1000).toFixed(steps >= 10000 ? 0 : 1)}k` : String(Math.round(steps));
}

function MeasurementForm({ form, setForm, onSubmit }: { form: Measurement; setForm: (measurement: Measurement) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const set = (key: keyof Measurement, value: string) => setForm({ ...form, [key]: key === "date" || key === "notes" ? value : Number(value) });

  return (
    <article className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[.03] p-6">
      <p className="text-[10px] font-bold tracking-[.15em] text-violet-300">REGISTRO FECHADO</p>
      <h2 className="mt-2 text-xl font-semibold">Añade una medición real</h2>
      <p className="mt-2 text-sm text-slate-400">Si registras una fecha que ya existe, se actualizará ese día en tu gráfica.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Fecha"><input required type="date" value={form.date} onChange={(event) => set("date", event.target.value)} /></Field>
        <Field label="Peso (kg)"><input required type="number" min="1" step="0.1" value={form.weight} onChange={(event) => set("weight", event.target.value)} /></Field>
        <Field label="Grasa corporal (%)"><input required type="number" min="0" max="100" step="0.1" value={form.bodyFat} onChange={(event) => set("bodyFat", event.target.value)} /></Field>
        <Field label="Masa magra (kg)"><input required type="number" min="0" step="0.1" value={form.leanMass} onChange={(event) => set("leanMass", event.target.value)} /></Field>
        <Field label="Cintura (cm)"><input required type="number" min="0" step="0.1" value={form.waist} onChange={(event) => set("waist", event.target.value)} /></Field>
        <Field label="Media de pasos al día (últimos 7 días)"><input required type="number" min="0" step="100" value={form.weeklySteps} onChange={(event) => set("weeklySteps", event.target.value)} /></Field>
        <Field label="Entrenamientos completados esta semana"><input required type="number" min="0" max="14" step="1" value={form.weeklyWorkouts} onChange={(event) => set("weeklyWorkouts", event.target.value)} /></Field>
        <Field label="Adherencia semanal (%)"><input required type="number" min="0" max="100" step="1" value={form.adherence} onChange={(event) => set("adherence", event.target.value)} /></Field>
        <Field label="Recuperación percibida (%)"><input required type="number" min="0" max="100" step="1" value={form.recovery} onChange={(event) => set("recovery", event.target.value)} /></Field>
        <Field label="Media de sueño por noche (horas)"><input required type="number" min="0" max="16" step="0.1" value={form.sleepHours} onChange={(event) => set("sleepHours", event.target.value)} /></Field>
        <Field label="Cambio de rendimiento (%)"><input required type="number" min="-100" max="100" step="1" value={form.performance} onChange={(event) => set("performance", event.target.value)} /></Field>
        <Field label="Notas"><input value={form.notes || ""} onChange={(event) => set("notes", event.target.value)} placeholder="Energía, descanso, observaciones" /></Field>
        <button type="submit" className="rounded-xl bg-violet-500 py-3 text-sm font-bold transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 sm:col-span-2">
          Guardar registro y actualizar gráfica
        </button>
      </form>
    </article>
  );
}

const chartMetrics = [
  { key: "weight", label: "Peso", unit: "kg", color: "#fb7185", decimals: 1 },
  { key: "bodyFat", label: "Grasa", unit: "%", color: "#a78bfa", decimals: 1 },
  { key: "waist", label: "Cintura", unit: "cm", color: "#2dd4bf", decimals: 1 },
  { key: "weeklySteps", label: "Pasos", unit: "pasos/día", color: "#38bdf8", decimals: 0 },
  { key: "sleepHours", label: "Sueño", unit: "h", color: "#c084fc", decimals: 1 },
  { key: "adherence", label: "Adherencia", unit: "%", color: "#4ade80", decimals: 0 },
  { key: "recovery", label: "Recuperación", unit: "%", color: "#fbbf24", decimals: 0 },
  { key: "performance", label: "Rendimiento", unit: "%", color: "#22d3ee", decimals: 0 },
] as const;

type ChartMetric = (typeof chartMetrics)[number]["key"];

function EvolutionChart({ records }: { records: Measurement[] }) {
  const [metric, setMetric] = useState<ChartMetric>("weight");
  const selected = chartMetrics.find((item) => item.key === metric) ?? chartMetrics[0];
  const values = records.map((record) => record[metric]);
  const { points, min, max } = useMemo(() => {
    const source = records.map((record) => record[metric]);
    const lowest = Math.min(...source);
    const highest = Math.max(...source);
    const padding = highest === lowest ? Math.max(highest * 0.05, 1) : (highest - lowest) * 0.12;
    const minValue = Math.max(0, lowest - padding);
    const maxValue = highest + padding;
    const range = maxValue - minValue || 1;

    return {
      min: minValue,
      max: maxValue,
      points: records.map((record, index) => ({
        x: records.length === 1 ? 50 : 4 + (index / (records.length - 1)) * 92,
        y: 90 - ((record[metric] - minValue) / range) * 72,
        record,
      })),
    };
  }, [metric, records]);

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const difference = values.at(-1)! - values[0]!;
  const format = (value: number) => `${value.toLocaleString("es-ES", { maximumFractionDigits: selected.decimals, minimumFractionDigits: selected.decimals })} ${selected.unit}`;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">EVOLUCIÓN REAL</p>
          <h2 className="mt-1 font-semibold">{selected.label} por fecha</h2>
        </div>
        <span className="rounded bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">{records.length} puntos</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Métrica de la gráfica">
        {chartMetrics.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={metric === item.key}
            onClick={() => setMetric(item.key)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${metric === item.key ? "bg-white text-slate-950" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {records.length < 2 ? (
        <p className="grid h-48 place-items-center text-center text-sm text-slate-500">Añade al menos dos fechas para comparar tu tendencia.</p>
      ) : (
        <>
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <p className="text-sm text-slate-400">Cambio desde el primer registro</p>
            <strong className={difference === 0 ? "text-slate-300" : difference > 0 ? "text-emerald-300" : "text-rose-300"}>{difference > 0 ? "+" : ""}{format(difference)}</strong>
          </div>
          <div className="relative mt-3">
            <span className="absolute left-0 top-0 text-[10px] text-slate-500">{format(max)}</span>
            <span className="absolute bottom-0 left-0 text-[10px] text-slate-500">{format(min)}</span>
            <svg className="h-52 w-full pl-14" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Evolución de ${selected.label.toLowerCase()}`}>
              <path d="M0 18H100M0 50H100M0 82H100" stroke="#ffffff16" strokeWidth=".5" />
              <polyline points={line} fill="none" stroke={selected.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              {points.map((point) => (
                <circle key={point.record.id} cx={point.x} cy={point.y} r="2.8" fill="#fff" stroke={selected.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                  <title>{`${point.record.date}: ${format(point.record[metric])}`}</title>
                </circle>
              ))}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500"><span>{records[0]?.date}</span><span>{records.at(-1)?.date}</span></div>
        </>
      )}
    </article>
  );
}

function Training({ exercises, onCompleteWorkout }: { exercises: Exercise[]; onCompleteWorkout: (routine: string) => void }) {
  const activeExercises = exercises.filter((exercise) => exercise.active);
  const routineOrder = ["Upper A", "Lower A", "Upper B", "Lower B"];
  const routines = routineOrder.map((name) => ({ name, exercises: activeExercises.filter((exercise) => exercise.category === name) })).filter((routine) => routine.exercises.length);
  const extras = activeExercises.filter((exercise) => !routineOrder.includes(exercise.category));

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6">
        <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">PLAN ACTIVO</p>
        <h2 className="mt-2 text-xl font-semibold">Rutina Upper / Lower</h2>
        <p className="mt-2 text-sm text-slate-400">Alterna Upper A, Lower A, Upper B y Lower B. Ajusta la carga para terminar cada serie con buena técnica.</p>
      </div>
      {activeExercises.length ? (
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {routines.map((routine) => (
            <article key={routine.name} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{routine.name}</h3>
                <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">{routine.exercises.length} ejercicios</span>
              </div>
              <div className="mt-4 space-y-2">
                {routine.exercises.map((exercise) => <ExerciseRow key={exercise.id} exercise={exercise} />)}
              </div>
              <button type="button" onClick={() => onCompleteWorkout(routine.name)} className="mt-4 w-full rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2.5 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/20">Marcar {routine.name} como realizada</button>
            </article>
          ))}
          {extras.length > 0 && (
            <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <h3 className="font-semibold">Complementarios</h3>
              <div className="mt-4 space-y-2">{extras.map((exercise) => <ExerciseRow key={exercise.id} exercise={exercise} />)}</div>
            </article>
          )}
        </div>
      ) : <p className="mt-5 rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">Aún no hay ejercicios activos en tu plan.</p>}
      <ExerciseLibrary />
    </section>
  );
}

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-3">
      <b className="text-sm">{exercise.name}</b>
      <span className="shrink-0 text-xs text-violet-300">{exercise.sets} × {exercise.reps}</span>
    </div>
  );
}

function Recommendations({ remaining, records, onAddRecord }: { remaining: number; records: Measurement[]; onAddRecord: () => void }) {
  const last = records.at(-1);

  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-sky-500/10 p-6">
        <p className="text-[10px] font-bold tracking-[.15em] text-violet-200">RECOMENDACIÓN DEL COACH</p>
        <h2 className="mt-2 text-xl font-semibold">Tu siguiente ajuste</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{remaining > 0 ? `Estás a ${remaining.toFixed(1)} kg de la meta. Mantén el trabajo de fuerza, registra un check-in semanal y no ajustes el volumen si la recuperación empeora.` : "Has alcanzado la meta de peso. Consolida el progreso priorizando fuerza, rendimiento y adherencia."}</p>
        <button type="button" onClick={onAddRecord} className="mt-5 rounded-xl bg-violet-500 px-4 py-3 text-sm font-bold transition hover:bg-violet-400">
          Registrar mi check-in
        </button>
      </article>
      <article className="rounded-2xl border border-white/10 bg-white/[.03] p-6">
        <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">CALIDAD DEL DATO</p>
        <h2 className="mt-2 text-xl font-semibold">Para una evolución fiable</h2>
        <ul className="mt-4 space-y-3 text-sm leading-5 text-slate-400">
          <li>• Registra siempre en condiciones parecidas.</li>
          <li>• Añade fecha y medidas, no solo el peso.</li>
          <li>• Toma decisiones con varias semanas, no con un único día.</li>
          {last?.notes && <li className="text-violet-300">• Última nota: {last.notes}</li>}
        </ul>
      </article>
    </section>
  );
}

function Creator({ members, exercises, onAddExercise, onChangeStatus, onUpdateExercise, onToggleExercise, onRemoveExercise, onSaveClientGoals }: { members: MemberProfile[]; exercises: Exercise[]; onAddExercise: (event: FormEvent<HTMLFormElement>) => void; onChangeStatus: (memberId: string, status: ProgramStatus) => void; onUpdateExercise: (exercise: Exercise) => void; onToggleExercise: (exerciseId: string) => void; onRemoveExercise: (exerciseId: string) => void; onSaveClientGoals: (memberId: string, goals: { goalWeight: number; goalDescription: string }) => void }) {
  const latestWeights = members.map((member) => member.stats.weight);
  const average = latestWeights.length ? latestWeights.reduce((sum, weight) => sum + weight, 0) / latestWeights.length : 0;
  const pendingMembers = members.filter((member) => member.programStatus === "pending");

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-amber-400/25 bg-amber-300/[.06] p-6">
        <p className="text-[10px] font-bold tracking-[.15em] text-amber-300">MODO CREADOR</p>
        <h2 className="mt-2 text-xl font-semibold">Panel avanzado</h2>
        <p className="mt-2 text-sm text-slate-400">Revisa solicitudes, activa el programa de cada cliente y configura sus ejercicios.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="CLIENTES" value={String(members.length)} unit="perfiles" detail="en este equipo" tone="text-amber-300" />
          <Metric label="PENDIENTES" value={String(pendingMembers.length)} unit="por revisar" detail="solicitudes nuevas" tone="text-amber-300" />
          <Metric label="REGISTROS" value={String(members.reduce((total, member) => total + member.measurements.length, 0))} unit="check-ins" detail="histórico total" tone="text-amber-300" />
          <Metric label="PESO MEDIO" value={average.toFixed(1)} unit="kg" detail="última medición" tone="text-amber-300" />
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">SOLICITUDES Y CLIENTES</p>
          <div className="mt-4 space-y-3">
            {members.length ? members.map((member) => (
              <div key={member.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><b>{member.name}</b><small className="ml-2 text-slate-500">{member.measurements.length} registros</small></div>
                  <ProgramBadge status={member.programStatus} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{member.assessment ? `${member.assessment.goal} · ${member.assessment.experience} · ${member.assessment.availability} días disponibles` : "Sin valoración inicial adjunta"}</p>
                {member.assessment?.limitations && <p className="mt-1 text-xs text-amber-200/80">Notas: {member.assessment.limitations}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.programStatus !== "active" && <button type="button" onClick={() => onChangeStatus(member.id, "active")} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300">Aceptar programa</button>}
                  {member.programStatus !== "rejected" && <button type="button" onClick={() => onChangeStatus(member.id, "rejected")} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-400/10">No aceptar</button>}
                </div>
                <details className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-slate-100">Editar objetivo y meta del cliente</summary>
                  <div className="mt-3">
                    <ClientGoalEditor member={member} onSave={onSaveClientGoals} />
                  </div>
                </details>
              </div>
            )) : <p className="text-sm text-slate-500">Crea perfiles de usuario para verlos aquí.</p>}
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
          <p className="text-[10px] font-bold tracking-[.15em] text-slate-500">AÑADIR EJERCICIO</p>
          <form onSubmit={onAddExercise} className="mt-4 grid gap-3">
            <input name="name" required placeholder="Nombre del ejercicio" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-violet-400" />
            <div className="grid grid-cols-3 gap-2">
              <input name="category" placeholder="Categoría" className="min-w-0 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none" />
              <input name="sets" type="number" min="1" placeholder="Series" className="min-w-0 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none" />
              <input name="reps" placeholder="Reps" className="min-w-0 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none" />
            </div>
            <button type="submit" className="rounded-lg bg-amber-300 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200">Añadir al plan</button>
          </form>
          <p className="mt-4 text-xs text-slate-500">{exercises.length} ejercicios configurados.</p>
          {exercises.length > 0 && (
            <div className="mt-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Editar ejercicios configurados</h3>
              {exercises.map((exercise) => (
                <div key={exercise.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        value={exercise.name}
                        onChange={(event) => onUpdateExercise({ ...exercise, name: event.currentTarget.value })}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
                        aria-label="Nombre del ejercicio"
                      />
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input
                          value={exercise.category}
                          onChange={(event) => onUpdateExercise({ ...exercise, category: event.currentTarget.value })}
                          className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
                          placeholder="Categoría"
                          aria-label="Categoría"
                        />
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(event) => onUpdateExercise({ ...exercise, sets: Number(event.currentTarget.value) })}
                          className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
                          placeholder="Series"
                          aria-label="Series"
                        />
                        <input
                          value={exercise.reps}
                          onChange={(event) => onUpdateExercise({ ...exercise, reps: event.currentTarget.value })}
                          className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
                          placeholder="Reps"
                          aria-label="Reps"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => onToggleExercise(exercise.id)} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">
                        {exercise.active ? "Desactivar" : "Activar"}
                      </button>
                      <button type="button" onClick={() => onRemoveExercise(exercise.id)} className="rounded-xl border border-rose-400/30 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

function ProgramBadge({ status }: { status: ProgramStatus }) {
  const styles: Record<ProgramStatus, string> = {
    active: "bg-emerald-400/10 text-emerald-300",
    pending: "bg-amber-300/10 text-amber-200",
    rejected: "bg-rose-400/10 text-rose-200",
  };
  const labels: Record<ProgramStatus, string> = { active: "Aceptado", pending: "Pendiente", rejected: "No aceptado" };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}>{labels[status]}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-semibold text-slate-400">{label}{children}</label>;
}

function Metric({ label, value, unit, detail, tone }: { label: string; value: string; unit: string; detail: string; tone: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
      <p className="text-[10px] font-bold tracking-[.14em] text-slate-500">{label}</p>
      <strong className="mt-2 block text-2xl">{value} <small className="text-xs font-normal text-slate-500">{unit}</small></strong>
      <span className={`mt-3 block text-xs ${tone}`}>{detail}</span>
    </article>
  );
}

function ClientGoalEditor({ member, onSave }: { member: MemberProfile; onSave: (memberId: string, goals: { goalWeight: number; goalDescription: string }) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSave(member.id, {
          goalWeight: Number(data.get("goalWeight") || member.stats.goalWeight),
          goalDescription: String(data.get("goalDescription") || member.stats.goalDescription),
        });
      }}
      className="space-y-3"
    >
      <label className="grid gap-2 text-xs text-slate-400">
        Objetivo principal
        <input
          name="goalDescription"
          defaultValue={member.stats.goalDescription}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
        />
      </label>
      <label className="grid gap-2 text-xs text-slate-400">
        Meta de peso
        <input
          name="goalWeight"
          type="number"
          min="1"
          step="0.1"
          defaultValue={member.stats.goalWeight}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
        />
      </label>
      <button type="submit" className="rounded-xl bg-amber-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-200">
        Guardar cambios del cliente
      </button>
    </form>
  );
}
