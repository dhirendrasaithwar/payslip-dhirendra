import { createFileRoute } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { MouseGlow } from "@/components/landing/MouseGlow";
import { FloatingSignIn } from "@/components/landing/FloatingSignIn";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Preview } from "@/components/landing/Preview";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Payslip.io — Generate Professional Payslips in Seconds" },
      {
        name: "description",
        content:
          "Automate salary calculations, taxes, and deductions. Export polished PDF payslips for your entire team in seconds.",
      },
      { property: "og:title", content: "Payslip.io — Generate Professional Payslips in Seconds" },
      {
        property: "og:description",
        content: "Modern payroll, made effortless. Auto calculations, tax handling, instant PDF export.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <BackgroundFX />
      <MouseGlow />
      <FloatingSignIn />

      <div className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Preview />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
