import Background from "@/components/ui/Background";

import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Method from "@/components/home/Method";
import Stats from "@/components/home/Stats";
import About from "@/components/home/About";
import CTA from "@/components/home/CTA";

import FadeIn from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden bg-slate-950 text-white">

      <Background />

      <Navbar />

      <Hero />

      <FadeIn>
        <Services />
      </FadeIn>

      <FadeIn>
        <Method />
      </FadeIn>

      <FadeIn>
        <Stats />
      </FadeIn>

      <FadeIn>
        <About />
      </FadeIn>

      <FadeIn>
        <CTA />
      </FadeIn>

    </main>
  );
}