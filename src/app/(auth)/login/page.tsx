"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/profile-store";

export default function Login() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); try { await login(email, password); router.push("/dashboard"); } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión."); } }
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6"><Link href="/" className="absolute left-8 top-8 text-slate-400 transition hover:text-white">← Volver al inicio</Link><div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl"><div className="mb-9 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 text-3xl">✦</div><h1 className="text-4xl font-bold text-white">Tu evolución empieza aquí</h1><p className="mt-3 text-slate-400">Accede a tu seguimiento físico personal.</p></div><form onSubmit={submit} className="space-y-5"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-violet-400"/><input required type="password" minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-violet-400"/>{error && <p className="text-sm text-rose-400">{error}</p>}<button className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 py-4 font-semibold text-white transition hover:scale-[1.02]">Iniciar sesión</button></form><p className="mt-8 text-center text-sm text-slate-400">¿Aún no tienes cuenta? <Link href="/registro" className="font-medium text-sky-400">Crear cuenta</Link></p></div></main>;
}
