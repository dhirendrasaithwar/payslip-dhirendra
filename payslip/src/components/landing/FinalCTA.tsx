import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden glass-strong rounded-3xl p-12 md:p-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-brand-soft" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[500px] bg-gradient-brand opacity-30 blur-3xl rounded-full" />

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Start Generating <br />
              <span className="text-gradient">Payslips Today</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
              Join thousands of teams replacing spreadsheets with a single, beautiful workflow.
            </p>

            <motion.a
              href="/signin"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-5px_oklch(0.65_0.24_295/0.8)] transition-shadow hover:shadow-[0_15px_60px_0_oklch(0.65_0.24_295/0.9)]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            <p className="mt-5 text-xs text-muted-foreground">No credit card required · 14-day free trial</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
