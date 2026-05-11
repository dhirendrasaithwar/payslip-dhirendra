import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";

export function FloatingSignIn() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-5 left-1/2 z-50 -translate-x-1/2 w-[min(960px,92%)]"
    >
      <div className="glass-strong flex items-center justify-between rounded-full px-5 py-2.5 shadow-glass">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Payslip<span className="text-gradient">.io</span></span>
        </div>

        <motion.a
          href="/signin"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-[0_0_20px_-5px_oklch(0.65_0.24_295/0.6)] transition-shadow hover:shadow-[0_0_30px_-2px_oklch(0.65_0.24_295/0.8)]"
        >
          Sign In
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
        </motion.a>
      </div>
    </motion.header>
  );
}
