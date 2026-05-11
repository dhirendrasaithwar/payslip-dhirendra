import { motion } from "framer-motion";
import { Calculator, Receipt, FileDown, Users, Building2, Shield } from "lucide-react";

const features = [
  { icon: Calculator, title: "Auto Salary Calculation", desc: "Smart formulas handle gross, net, allowances and overtime automatically." },
  { icon: Receipt, title: "Tax & Deductions", desc: "Built-in tax tables and customizable deductions for any region." },
  { icon: FileDown, title: "Instant PDF Export", desc: "Pixel-perfect, print-ready PDFs delivered in under a second." },
  { icon: Users, title: "Multi-Employee Support", desc: "Bulk-generate payslips for hundreds of employees in one click." },
  { icon: Building2, title: "Company Branding", desc: "Upload your logo, set colors, and match your corporate identity." },
  { icon: Shield, title: "Secure by Default", desc: "End-to-end encrypted storage and SOC 2 compliant infrastructure." },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-brand-cyan font-medium">Features</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Everything payroll needs, <span className="text-gradient">nothing it doesn't</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolkit built for accuracy, speed, and clarity.
          </p>
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group relative glass rounded-2xl p-6 transition-all hover:border-white/20 hover:shadow-[0_20px_60px_-20px_oklch(0.65_0.24_295/0.4)]"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-brand-soft pointer-events-none" />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand-soft border border-white/10">
                  <f.icon className="h-5 w-5 text-brand-cyan" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
