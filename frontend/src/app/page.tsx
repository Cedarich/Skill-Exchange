import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import SkillsShowcase from "@/components/landing/SkillsShowcase";
import Gamification from "@/components/landing/Gamification";
import StellarSection from "@/components/landing/StellarSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <SkillsShowcase />
        <Gamification />
        <StellarSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
