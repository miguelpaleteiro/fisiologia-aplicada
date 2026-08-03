import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Method from "@/components/home/Method";
import About from "@/components/home/About";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Method />
      <About />
      <CTA />
    </main>
  );
}