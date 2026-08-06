type Movement = "press" | "pull" | "squat" | "hinge" | "lunge" | "raise" | "isolation";

type ExerciseGuide = {
  name: string;
  session: "Upper" | "Lower";
  movement: Movement;
  description: string;
  cues: string[];
};

const guides: ExerciseGuide[] = [
  { name: "Press de banca", session: "Upper", movement: "press", description: "Empuje horizontal para pectoral, tríceps y deltoide anterior.", cues: ["Escápulas juntas y apoyadas en el banco.", "Baja la barra con control hacia el pecho.", "Empuja sin perder el apoyo de los pies."] },
  { name: "Remo con barra", session: "Upper", movement: "pull", description: "Tracción horizontal para espalda media y dorsal.", cues: ["Mantén el tronco firme y la columna neutra.", "Lleva los codos hacia atrás, no hacia fuera.", "Evita usar impulso de la zona lumbar."] },
  { name: "Press inclinado con mancuernas", session: "Upper", movement: "press", description: "Empuje inclinado que prioriza la porción superior del pectoral.", cues: ["Usa una inclinación moderada.", "Controla el descenso de las mancuernas.", "Termina con los brazos extendidos sin chocar las cargas."] },
  { name: "Jalón al pecho", session: "Upper", movement: "pull", description: "Tracción vertical enfocada en dorsales y bíceps.", cues: ["Fija el torso y abre el pecho.", "Lleva la barra hacia la parte alta del pecho.", "Evita tirar detrás de la nuca."] },
  { name: "Elevaciones laterales", session: "Upper", movement: "raise", description: "Aislamiento del deltoide lateral para construir hombros.", cues: ["Mantén una ligera flexión del codo.", "Eleva hasta la altura de los hombros.", "No balances el tronco para subir la carga."] },
  { name: "Press militar", session: "Upper", movement: "press", description: "Empuje vertical para hombros, tríceps y estabilidad del core.", cues: ["Aprieta glúteos y abdomen antes de empujar.", "La barra sube cerca de la cara.", "No hiperextiendas la espalda al final."] },
  { name: "Dominadas o jalón neutro", session: "Upper", movement: "pull", description: "Tracción vertical para dorsal ancho, bíceps y control escapular.", cues: ["Inicia el gesto bajando los hombros.", "Lleva el pecho hacia la barra o el agarre.", "Controla la bajada completa."] },
  { name: "Aperturas en polea", session: "Upper", movement: "press", description: "Aislamiento de pectoral con tensión continua.", cues: ["Mantén el codo ligeramente flexionado.", "Abraza hacia delante sin encoger los hombros.", "Vuelve despacio hasta notar el estiramiento."] },
  { name: "Curl de bíceps", session: "Upper", movement: "isolation", description: "Trabajo directo de flexores del codo.", cues: ["Mantén los codos cerca del cuerpo.", "Evita balancear los hombros.", "Baja la carga de forma controlada."] },
  { name: "Sentadilla", session: "Lower", movement: "squat", description: "Patrón dominante de rodilla para cuádriceps y glúteos.", cues: ["Apoya el pie completo en el suelo.", "Rodillas alineadas con la dirección de los pies.", "Desciende con el torso firme y sube empujando el suelo."] },
  { name: "Peso muerto rumano", session: "Lower", movement: "hinge", description: "Bisagra de cadera para isquiosurales, glúteos y espalda posterior.", cues: ["Lleva la cadera atrás con rodillas suaves.", "Mantén la barra cerca de las piernas.", "Siente el estiramiento de isquios antes de subir."] },
  { name: "Prensa de piernas", session: "Lower", movement: "squat", description: "Alternativa estable para acumular volumen de pierna.", cues: ["Controla la profundidad sin despegar la pelvis.", "Empuja con todo el pie.", "No bloquees las rodillas al terminar."] },
  { name: "Curl femoral", session: "Lower", movement: "isolation", description: "Aislamiento de isquiosurales mediante flexión de rodilla.", cues: ["Mantén la cadera pegada al banco.", "Completa el recorrido sin dar tirones.", "Controla especialmente la fase de bajada."] },
  { name: "Hip thrust", session: "Lower", movement: "hinge", description: "Extensión de cadera para glúteos con alta estabilidad.", cues: ["Costillas abajo y mirada al frente.", "Empuja con talones sin hiperextender la espalda.", "Pausa un instante arriba apretando glúteos."] },
  { name: "Zancadas búlgaras", session: "Lower", movement: "lunge", description: "Trabajo unilateral de cuádriceps y glúteos.", cues: ["Busca una zancada que te permita bajar vertical.", "El pie delantero soporta la mayor parte de la carga.", "Mantén la pelvis estable en todo momento."] },
  { name: "Extensión de cuádriceps", session: "Lower", movement: "isolation", description: "Aislamiento de cuádriceps para terminar el trabajo de rodilla.", cues: ["Ajusta el eje de la máquina a tu rodilla.", "Sube sin despegar la espalda del respaldo.", "Baja lento para mantener tensión."] },
  { name: "Elevación de gemelos", session: "Lower", movement: "raise", description: "Trabajo de sóleo y gastrocnemio para completar la pierna.", cues: ["Desciende hasta sentir estiramiento.", "Sube al máximo sobre la punta del pie.", "Pausa arriba sin rebotar."] },
];

export default function ExerciseLibrary() {
  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-5">
      <div>
        <p className="text-[10px] font-bold tracking-[.15em] text-sky-300">BIBLIOTECA DE EJERCICIOS</p>
        <h2 className="mt-1 text-xl font-semibold">Técnica y movimiento</h2>
        <p className="mt-2 text-sm text-slate-400">Abre cada ejercicio para ver su objetivo y las claves antes de hacerlo.</p>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {guides.map((guide) => (
          <details key={guide.name} className="group rounded-xl border border-white/10 bg-slate-900/50 open:border-sky-400/40">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
              <ExerciseMotionIcon movement={guide.movement} />
              <span className="min-w-0 flex-1"><b className="block text-sm text-white">{guide.name}</b><small className="mt-1 block text-xs text-slate-500">{guide.session} · {movementLabel(guide.movement)}</small></span>
              <span aria-hidden="true" className="text-slate-500 transition group-open:rotate-45 group-open:text-sky-300">+</span>
            </summary>
            <div className="border-t border-white/10 px-4 pb-4 pt-3">
              <p className="text-sm leading-6 text-slate-300">{guide.description}</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-400">{guide.cues.map((cue) => <li key={cue}>• {cue}</li>)}</ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function movementLabel(movement: Movement) {
  return { press: "empuje", pull: "tracción", squat: "sentadilla", hinge: "bisagra", lunge: "unilateral", raise: "aislamiento", isolation: "aislamiento" }[movement];
}

function ExerciseMotionIcon({ movement }: { movement: Movement }) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className="h-14 w-14 shrink-0 rounded-xl border border-sky-400/15 bg-sky-400/5 p-1.5 text-sky-300">
      <path d="M12 59h48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".35" />
      <g className={`exercise-motion exercise-${movement}`} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="36" cy="16" r="6" />
        <path d="M36 22v17M23 33l13 6 13-6M36 39l-10 17M36 39l10 17" />
        {(movement === "press" || movement === "pull") && <path d="M18 29h36M22 24v10M50 24v10" />}
        {movement === "raise" && <path d="M18 27l-6-8M54 27l6-8" />}
        {movement === "hinge" && <path d="M20 42l30-8" />}
      </g>
    </svg>
  );
}
