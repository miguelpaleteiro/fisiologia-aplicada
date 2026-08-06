"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { saveInitialAssessmentDraft } from "@/lib/profile-store";

type Assessment = {
  name: string;
  email: string;
  goal: string;
  experience: string;
  availability: string;
  limitations: string;
};

const emptyAssessment: Assessment = {
  name: "",
  email: "",
  goal: "",
  experience: "",
  availability: "",
  limitations: "",
};

const fieldClass = "mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400";

export default function CTA() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Assessment>(emptyAssessment);

  function updateField(field: keyof Assessment, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveInitialAssessmentDraft({ ...form, submittedAt: new Date().toISOString() });
    setSubmitted(true);
  }

  function closeDialog() {
    setOpen(false);
    setSubmitted(false);
  }

  return (
    <section id="contacto" className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Empieza a transformar tu cuerpo entendiendo cómo funciona
      </h2>

      <p className="mb-6">
        Entrenamiento, nutrición y fisiología aplicada
        para conseguir resultados sostenibles.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-xl border px-8 py-3 font-semibold transition hover:border-sky-400 hover:bg-slate-900"
      >
        Solicitar valoración
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="assessment-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 text-left shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold tracking-[.15em] text-sky-300">VALORACIÓN INICIAL</p>
                <h2 id="assessment-title" className="mt-2 text-2xl font-bold">Cuéntame tu punto de partida</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Completa estos datos para preparar una primera orientación personalizada.</p>
              </div>
              <button type="button" onClick={closeDialog} aria-label="Cerrar valoración inicial" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white">×</button>
            </div>

            {submitted ? (
              <div className="mt-7 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <h3 className="font-semibold text-emerald-200">Borrador guardado en este dispositivo</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-50/80">Crea tu cuenta para enviar la solicitud al creador. Se adjuntará esta valoración para su revisión.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/registro" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-100">Crear mi cuenta</Link>
                  <button type="button" onClick={closeDialog} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Cerrar</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitAssessment} className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-300">Nombre completo<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} className={fieldClass} placeholder="Tu nombre" /></label>
                <label className="text-sm font-medium text-slate-300">Correo electrónico<input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={fieldClass} placeholder="tu@email.com" /></label>
                <label className="text-sm font-medium text-slate-300 sm:col-span-2">Objetivo principal<select required value={form.goal} onChange={(event) => updateField("goal", event.target.value)} className={fieldClass}><option value="" disabled>Selecciona tu objetivo</option><option>Mejorar composición corporal</option><option>Ganar fuerza y masa muscular</option><option>Mejorar rendimiento</option><option>Crear hábitos sostenibles</option></select></label>
                <label className="text-sm font-medium text-slate-300">Experiencia entrenando<select required value={form.experience} onChange={(event) => updateField("experience", event.target.value)} className={fieldClass}><option value="" disabled>Selecciona una opción</option><option>Principiante</option><option>Intermedio</option><option>Avanzado</option></select></label>
                <label className="text-sm font-medium text-slate-300">Días disponibles por semana<input required type="number" min="1" max="7" value={form.availability} onChange={(event) => updateField("availability", event.target.value)} className={fieldClass} placeholder="Por ejemplo, 4" /></label>
                <label className="text-sm font-medium text-slate-300 sm:col-span-2">Lesiones, limitaciones o información relevante<textarea value={form.limitations} onChange={(event) => updateField("limitations", event.target.value)} className={`${fieldClass} min-h-28 resize-y`} placeholder="Opcional" /></label>
                <p className="text-xs leading-5 text-slate-500 sm:col-span-2">La valoración se guarda en este navegador y se adjunta cuando crees tu cuenta con este mismo correo.</p>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-bold text-white transition hover:scale-[1.01] sm:col-span-2">Guardar mi valoración</button>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
