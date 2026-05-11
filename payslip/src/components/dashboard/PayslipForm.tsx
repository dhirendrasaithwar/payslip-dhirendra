import { motion } from "framer-motion";
import type { ChangeEvent, ReactNode } from "react";
import { Building2, Upload, User, Wallet, Hash, Briefcase, Calendar, Sparkles } from "lucide-react";
import type { PayslipData } from "./payslip-types";

type Props = {
  data: PayslipData;
  onChange: (next: PayslipData) => void;
};

export function PayslipForm({ data, onChange }: Props) {
  const set = <K extends keyof PayslipData>(key: K, value: PayslipData[K]) =>
    onChange({ ...data, [key]: value });

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("companyLogo", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <Section icon={<Building2 className="h-4 w-4" />} title="Company" subtitle="Brand the payslip">
        <Grid>
          <Field label="Company name">
            <Input value={data.companyName} onChange={(v) => set("companyName", v)} placeholder="Acme Inc." />
          </Field>
          <Field label="Pay period">
            <InputIcon icon={<Calendar className="h-4 w-4" />}>
              <input
                type="month"
                value={data.payPeriod}
                onChange={(e) => set("payPeriod", e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none [color-scheme:dark]"
              />
            </InputIcon>
          </Field>
        </Grid>
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative h-14 w-14 shrink-0 rounded-xl glass border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-brand-cyan/40 transition-colors">
              {data.companyLogo ? (
                <img src={data.companyLogo} alt="logo" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Upload logo</p>
              <p className="text-xs text-muted-foreground">PNG, JPG · optional</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
          </label>
        </div>
      </Section>

      <Section icon={<User className="h-4 w-4" />} title="Employee" subtitle="Who this payslip is for">
        <Grid>
          <Field label="Full name">
            <InputIcon icon={<User className="h-4 w-4" />}>
              <input
                value={data.employeeName}
                onChange={(e) => set("employeeName", e.target.value)}
                placeholder="Jane Cooper"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
              />
            </InputIcon>
          </Field>
          <Field label="Employee ID">
            <InputIcon icon={<Hash className="h-4 w-4" />}>
              <input
                value={data.employeeId}
                onChange={(e) => set("employeeId", e.target.value)}
                placeholder="EMP-00421"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
              />
            </InputIcon>
          </Field>
          <Field label="Role / Position" full>
            <InputIcon icon={<Briefcase className="h-4 w-4" />}>
              <input
                value={data.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Senior Product Designer"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
              />
            </InputIcon>
          </Field>
        </Grid>
      </Section>

      <Section icon={<Wallet className="h-4 w-4" />} title="Salary" subtitle="Real-time calculation">
        <Grid>
          <Field label="Basic salary">
            <Money value={data.basic} onChange={(v) => set("basic", v)} />
          </Field>
          <Field label="Allowances">
            <Money value={data.allowances} onChange={(v) => set("allowances", v)} />
          </Field>
          <Field label="Other deductions">
            <Money value={data.deductions} onChange={(v) => set("deductions", v)} />
          </Field>
          <Field label={data.taxAuto ? `Tax rate (${data.taxRate}%)` : "Tax amount"}>
            {data.taxAuto ? (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={0.5}
                  value={data.taxRate}
                  onChange={(e) => set("taxRate", parseFloat(e.target.value))}
                  className="w-full accent-[oklch(0.65_0.24_295)]"
                />
              </div>
            ) : (
              <Money value={data.taxManual} onChange={(v) => set("taxManual", v)} />
            )}
          </Field>
        </Grid>

        <motion.label
          whileTap={{ scale: 0.98 }}
          className="mt-5 flex items-center gap-3 rounded-xl glass border border-white/10 px-4 py-3 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div
            className={`relative h-5 w-9 rounded-full transition-colors ${data.taxAuto ? "bg-gradient-brand" : "bg-white/10"}`}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${data.taxAuto ? "left-[18px]" : "left-0.5"}`}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-cyan" /> Auto-calculate tax
            </p>
            <p className="text-xs text-muted-foreground">Apply a percentage of gross salary</p>
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={data.taxAuto}
            onChange={(e) => set("taxAuto", e.target.checked)}
          />
        </motion.label>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand-soft border border-white/10 text-brand-cyan">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-colors"
    />
  );
}

function InputIcon({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-brand-cyan/50 focus-within:bg-white/[0.05] transition-colors">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}

function Money({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-brand-cyan/50 focus-within:bg-white/[0.05] transition-colors">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
      <input
        type="number"
        min={0}
        step="0.01"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-transparent pl-8 pr-4 py-3 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
