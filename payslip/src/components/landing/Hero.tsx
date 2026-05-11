import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { PayslipCard } from "./PayslipCard";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            <span className="text-muted-foreground">New · Multi-currency support</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Generate Professional <br />
            <span className="text-gradient">Payslips in Seconds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Automate salary calculations, taxes, and deductions. Export polished PDF payslips for
            your entire team — in a fraction of the time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <motion.a
              href="/signin"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.65_0.24_295/0.8)] transition-shadow hover:shadow-[0_15px_50px_-5px_oklch(0.65_0.24_295/0.9)]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#preview"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
            >
              <Play className="h-4 w-4" />
              View Demo
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <div>
              <span className="text-foreground font-semibold">12k+</span> teams
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <span className="text-foreground font-semibold">2M+</span> payslips generated
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <span className="text-foreground font-semibold">99.9%</span> uptime
            </div>
          </motion.div>
        </div>

        <PayslipCard />
      </div>
    </section>
  );
}
