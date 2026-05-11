import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileText, Building2 } from "lucide-react";

export function Preview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -8]);

  return (
    <section id="preview" ref={ref} className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-brand-cyan font-medium">Preview</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Crafted for clarity, <span className="text-gradient">built for trust</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y, rotateX, perspective: 1500 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="absolute -inset-10 bg-gradient-brand opacity-20 blur-3xl rounded-[3rem]" />

          <div className="relative glass-strong rounded-3xl p-8 md:p-10 shadow-glass">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 mb-6">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-muted-foreground">payslip-acme-oct-2025.pdf</span>
            </div>

            {/* Document */}
            <div className="rounded-2xl bg-white/95 text-slate-900 p-8 md:p-10 shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Acme Corporation</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">221 Market Street, San Francisco, CA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Payslip</p>
                  <p className="text-sm font-semibold mt-1">Oct 2025</p>
                  <p className="text-[11px] text-slate-500">#PSL-2025-10-0421</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Employee</p>
                  <p className="font-semibold mt-1">Alex Chen</p>
                  <p className="text-slate-500 text-xs">Senior Engineer · ID 0421</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Pay Period</p>
                  <p className="font-semibold mt-1">Oct 1 – Oct 31, 2025</p>
                  <p className="text-slate-500 text-xs">Monthly · USD</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Earnings</p>
                  <div className="space-y-2 text-sm">
                    <Row label="Basic" value="$5,200.00" />
                    <Row label="Housing" value="$800.00" />
                    <Row label="Bonus" value="$1,250.00" />
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deductions</p>
                  <div className="space-y-2 text-sm">
                    <Row label="Income Tax" value="$1,043.00" />
                    <Row label="Social Security" value="$385.00" />
                    <Row label="Health Plan" value="$0.00" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #6e3df0, #3b82f6)" }}>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Net Pay</span>
                </div>
                <span className="text-2xl font-bold">$5,822.00</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
