import { motion } from "framer-motion";
import { UserPlus, Wallet, Download } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Enter employee details", desc: "Add team members manually or import a CSV in seconds." },
  { icon: Wallet, title: "Add salary components", desc: "Configure base pay, allowances, bonuses and deductions." },
  { icon: Download, title: "Generate & download", desc: "Export branded, tax-accurate PDF payslips instantly." },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-brand-cyan font-medium">How it works</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Three steps. <span className="text-gradient">Zero spreadsheets.</span>
          </h2>
        </motion.div>

        <div className="mt-16 relative grid md:grid-cols-3 gap-6">
          {/* connector line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-2xl" />
                <div className="relative glass-strong flex h-24 w-24 items-center justify-center rounded-2xl">
                  <s.icon className="h-9 w-9 text-brand-cyan" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
