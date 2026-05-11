import { AnimatePresence, motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { computeTotals, formatCurrency, type PayslipData } from "./payslip-types";

export function PayslipPreview({ data }: { data: PayslipData }) {
  const totals = computeTotals(data);

  const period = data.payPeriod
    ? new Date(data.payPeriod + "-02").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  // ✅ Theme system
  const themeMap = {
    light: {
      card: "bg-white text-slate-900",
      sub: "text-slate-700",
      border: "border-slate-100",
      footer: "bg-slate-50 text-slate-400",
    },
    dark: {
      card: "bg-[#0f172a] text-white",
      sub: "text-white/80",
      border: "border-white/10",
      footer: "bg-white/5 text-white/50",
    },
    blue: {
      card: "bg-blue-600 text-white",
      sub: "text-white/90",
      border: "border-white/10",
      footer: "bg-blue-700 text-white/60",
    },
    green: {
      card: "bg-green-600 text-white",
      sub: "text-white/90",
      border: "border-white/10",
      footer: "bg-green-700 text-white/60",
    },
  };

  const theme = themeMap[data.theme || "light"];

  const lines = [
    { label: "Basic Salary", value: data.basic, kind: "earn" as const },
    { label: "Allowances", value: data.allowances, kind: "earn" as const },
    { label: "Tax", value: totals.tax, kind: "ded" as const },
    { label: "Other Deductions", value: data.deductions, kind: "ded" as const },
  ];

  return (
    <div className="relative">
      {/* Glow using brand color */}
      <div
        className="absolute -inset-6 opacity-20 blur-3xl rounded-full pointer-events-none"
        style={{
          background: data.brandColor || "#6366f1",
        }}
      />

      <motion.div
        layout
        className={`relative rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden ${theme.card}`}
        style={{
          borderTop: `4px solid ${data.brandColor || "#6366f1"}`,
        }}
      >
        {/* Header */}
        <div
          className="relative px-8 py-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${data.brandColor || "#6366f1"}, #00000030)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {data.companyLogo ? (
                  <img src={data.companyLogo} alt="logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-5 w-5 text-white/70" />
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Payslip</p>
                <h3 className="text-lg font-semibold">{data.companyName || "Company Name"}</h3>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Pay period</p>
              <p className="text-sm font-medium">{period}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className={`grid grid-cols-3 gap-4 px-8 py-5 border-b ${theme.border}`}>
          <Info label="Employee" value={data.employeeName || "—"} theme={theme} />
          <Info label="Employee ID" value={data.employeeId || "—"} theme={theme} />
          <Info label="Position" value={data.role || "—"} theme={theme} />
        </div>

        {/* Salary Lines */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-[1fr_auto] gap-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">
              Description
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold text-right">
              Amount
            </p>

            <AnimatePresence mode="popLayout">
              {lines.map((l) => (
                <motion.div
                  key={l.label}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="contents"
                >
                  <div className={`text-sm flex items-center gap-2 py-1 ${theme.sub}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        l.kind === "earn" ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                    {l.label}
                  </div>

                  <motion.div
                    key={l.value}
                    className={`text-sm tabular-nums text-right py-1 ${
                      l.kind === "ded" ? "text-rose-400" : ""
                    }`}
                  >
                    {l.kind === "ded" ? "−" : ""}
                    {formatCurrency(l.value)}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Totals */}
          <div className={`mt-6 space-y-2 border-t pt-4 ${theme.border}`}>
            <Row label="Gross Salary" value={formatCurrency(totals.gross)} theme={theme} />
            <Row
              label="Total Deductions"
              value={`−${formatCurrency(totals.totalDeductions)}`}
              muted
              theme={theme}
            />
          </div>

          {/* Net Pay */}
          <motion.div
            layout
            className="mt-6 rounded-xl p-5 text-white flex items-center justify-between"
            style={{
              background: data.brandColor || "#6366f1",
            }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Net Pay</p>
              <p className="text-[10px] text-white/60 mt-0.5">Amount transferred</p>
            </div>

            <motion.p key={totals.net} className="text-2xl font-bold tabular-nums">
              {formatCurrency(totals.net)}
            </motion.p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className={`px-8 py-4 text-[10px] flex justify-between ${theme.footer}`}>
          <span>This is a computer-generated payslip.</span>
          <span>Generated by Payslip.io</span>
        </div>
      </motion.div>
    </div>
  );
}

// helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Info({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">{label}</p>
      <p className={`mt-1 text-sm font-medium truncate ${theme.sub}`}>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  theme,
}: {
  label: string;
  value: string;
  muted?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "opacity-60" : theme.sub}>{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
