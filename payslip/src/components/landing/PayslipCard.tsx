import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const rows = [
  { label: "Basic Salary", value: "$5,200.00" },
  { label: "Housing Allowance", value: "$800.00" },
  { label: "Performance Bonus", value: "$1,250.00" },
  { label: "Income Tax", value: "−$1,043.00", neg: true },
  { label: "Social Security", value: "−$385.00", neg: true },
];

export function PayslipCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: 1200 }}
    >
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-brand opacity-30 blur-3xl rounded-3xl" />

      <motion.div
        whileHover={{ y: -6, rotateX: -2, rotateY: 2 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-strong relative rounded-2xl p-6 shadow-glass"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Payslip</p>
            <h3 className="text-lg font-semibold mt-1">October 2025</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand">
            <span className="text-xs font-bold text-white">AC</span>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-muted-foreground">Employee</p>
          <p className="text-sm font-medium">Alex Chen · Senior Engineer</p>
        </div>

        <div className="space-y-2.5 border-t border-white/10 pt-4">
          {rows.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">{r.label}</span>
              <span className={r.neg ? "text-destructive/90" : "text-foreground font-medium"}>{r.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-brand-soft border border-white/10 px-4 py-3">
          <span className="text-sm text-muted-foreground">Net Pay</span>
          <span className="text-xl font-bold text-gradient">$5,822.00</span>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-cyan" />
          Verified · Generated in 0.4s
        </div>
      </motion.div>
    </motion.div>
  );
}
