import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Printer, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export const Route = createFileRoute("/create")({
  component: CreatePage,
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Theme = "light" | "dark" | "branded";
type TaxMode = "auto" | "manual" | "none";

type CustomLine = {
  id: string;
  label: string;
  value: number;
  type: "earn" | "ded";
};

type FormData = {
  // Company
  companyName: string;
  companyAddress: string;
  // Employee
  empName: string;
  empId: string;
  empRole: string;
  empDept: string;
  // Pay
  payPeriod: string;
  currency: string;
  basicSalary: number;
  allowances: number;
  baseDeductions: number;
  // Tax
  taxRate: number;
  taxAmount: number;
  // Branding
  brandColor: string;
  // Notes
  notes: string;
};

type ThemeCfg = {
  headerBg: string;
  headerColor: string;
  headerSubColor: string;
  bodyBg: string;
  bodyColor: string;
  cardBg: string;
  cardLabel: string;
  cardSpan: string;
  stripe: string;
  colTitleEarn: string;
  colTitleDed: string;
  lineColor: string;
  subtotalBorder: string;
  netBg: string;
  netColor: string;
  noteBg: string;
  noteColor: string;
  footerBg: string;
  footerBorder: string;
  footerColor: string;
  badgeBg: string;
  badgeColor: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMonth(ym: string): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function fmtAmount(n: number, currency: string): string {
  return (
    currency +
    Math.abs(n).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function getThemeCfg(theme: Theme, brandColor: string): ThemeCfg {
  const configs: Record<Theme, ThemeCfg> = {
    light: {
      headerBg: "#fff",
      headerColor: "#1a1a1a",
      headerSubColor: "#999",
      bodyBg: "#fff",
      bodyColor: "#1a1a1a",
      cardBg: "#f7f7f7",
      cardLabel: "#999",
      cardSpan: "#1a1a1a",
      stripe: brandColor,
      colTitleEarn: brandColor,
      colTitleDed: "#ee0055",
      lineColor: "rgba(0,0,0,0.06)",
      subtotalBorder: "#1a1a1a",
      netBg: "#f7f7f7",
      netColor: "#1a1a1a",
      noteBg: "#f7f7f7",
      noteColor: "#888",
      footerBg: "#fff",
      footerBorder: "#f0f0f0",
      footerColor: "#bbb",
      badgeBg: brandColor + "20",
      badgeColor: brandColor,
    },
    dark: {
      headerBg: "#0d0d1a",
      headerColor: "#f0eff4",
      headerSubColor: "rgba(240,239,244,0.45)",
      bodyBg: "#0d0d1a",
      bodyColor: "#f0eff4",
      cardBg: "#1a1a2e",
      cardLabel: "rgba(240,239,244,0.45)",
      cardSpan: "#f0eff4",
      stripe: brandColor,
      colTitleEarn: brandColor,
      colTitleDed: "#ff6b6b",
      lineColor: "rgba(255,255,255,0.07)",
      subtotalBorder: "rgba(255,255,255,0.3)",
      netBg: "#1a1a2e",
      netColor: "#f0eff4",
      noteBg: "#1a1a2e",
      noteColor: "rgba(240,239,244,0.5)",
      footerBg: "#0d0d1a",
      footerBorder: "rgba(255,255,255,0.07)",
      footerColor: "rgba(255,255,255,0.25)",
      badgeBg: brandColor + "30",
      badgeColor: brandColor,
    },
    branded: {
      headerBg: brandColor,
      headerColor: "#fff",
      headerSubColor: "rgba(255,255,255,0.65)",
      bodyBg: "#fff",
      bodyColor: "#1a1a1a",
      cardBg: "#f7f7f7",
      cardLabel: "#999",
      cardSpan: "#1a1a1a",
      stripe: "rgba(255,255,255,0.25)",
      colTitleEarn: brandColor,
      colTitleDed: "#ee0055",
      lineColor: "rgba(0,0,0,0.06)",
      subtotalBorder: "#1a1a1a",
      netBg: brandColor,
      netColor: "#fff",
      noteBg: "#f7f7f7",
      noteColor: "#888",
      footerBg: "#fff",
      footerBorder: "#f0f0f0",
      footerColor: "#bbb",
      badgeBg: "rgba(255,255,255,0.2)",
      badgeColor: "#fff",
    },
  };
  return configs[theme];
}

function computeTotals(data: FormData, lines: CustomLine[], taxMode: TaxMode) {
  const customEarnings = lines.filter((l) => l.type === "earn").reduce((s, l) => s + l.value, 0);
  const customDeductions = lines.filter((l) => l.type === "ded").reduce((s, l) => s + l.value, 0);

  const grossEarnings = data.basicSalary + data.allowances + customEarnings;
  const totalDeductions = data.baseDeductions + customDeductions;

  let tax = 0;
  if (taxMode === "auto") tax = grossEarnings * (data.taxRate / 100);
  else if (taxMode === "manual") tax = data.taxAmount;

  return {
    grossEarnings,
    totalDeductions,
    tax,
    net: grossEarnings - totalDeductions - tax,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: "rgba(240,239,244,0.45)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f0eff4",
  padding: "9px 11px",
  borderRadius: 10,
  fontFamily: "inherit",
  fontSize: 13,
  width: "100%",
  outline: "none",
  appearance: "none" as any,
  WebkitAppearance: "none" as any,
};

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <label style={{ fontSize: 11, color: "rgba(240,239,244,0.45)", fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Payslip Preview ─────────────────────────────────────────────────────────

function PayslipPreview({
  data,
  lines,
  theme,
  taxMode,
  logoDataUrl,
}: {
  data: FormData;
  lines: CustomLine[];
  theme: Theme;
  taxMode: TaxMode;
  logoDataUrl: string | null;
}) {
  const c = getThemeCfg(theme, data.brandColor);
  const t = computeTotals(data, lines, taxMode);
  const payPeriod = formatMonth(data.payPeriod);
  const fmt = (n: number) => fmtAmount(n, data.currency);
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const earningLines = lines.filter((l) => l.type === "earn");
  const deductionLines = lines.filter((l) => l.type === "ded");
  const totalDed = t.totalDeductions + t.tax;

  const psLine: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
    fontSize: 13,
    borderBottom: `1px solid ${c.lineColor}`,
    color: c.bodyColor,
  };

  const psLineSubtotal: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0 7px",
    fontSize: 13,
    fontWeight: 600,
    borderTop: `1.5px solid ${c.subtotalBorder}`,
    marginTop: 4,
    color: c.bodyColor,
  };

  const amountStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    fontWeight: 500,
  };

  return (
    <div
      style={{
        background: "white",
        width: "100%",
        boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 20px 60px rgba(0,0,0,0.2)",
        borderRadius: 4,
        overflow: "hidden",
        fontFamily: "'Instrument Sans', sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 32px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: c.headerBg,
          color: c.headerColor,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
              background: logoDataUrl ? undefined : data.brandColor + "22",
            }}
          >
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              "🏢"
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 21, lineHeight: 1.1 }}>
              {data.companyName || "Your Company"}
            </div>
            {data.companyAddress && (
              <div style={{ fontSize: 11, marginTop: 3, color: c.headerSubColor }}>
                {data.companyAddress}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: c.headerSubColor,
            }}
          >
            Pay Slip
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24,
              marginTop: 3,
              color: c.headerColor,
            }}
          >
            {payPeriod || "Pay Period"}
          </div>
        </div>
      </div>

      {/* Stripe */}
      <div style={{ height: 4, background: c.stripe }} />

      {/* Body */}
      <div style={{ padding: "24px 32px 20px", background: c.bodyBg, color: c.bodyColor }}>
        {/* Employee card */}
        <div
          style={{
            background: c.cardBg,
            borderRadius: 10,
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px 24px",
            marginBottom: 24,
          }}
        >
          {[
            { label: "Employee", value: data.empName || "Employee Name" },
            data.empId ? { label: "Employee ID", value: data.empId } : null,
            data.empRole ? { label: "Job Title", value: data.empRole } : null,
            data.empDept ? { label: "Department", value: data.empDept } : null,
          ]
            .filter(Boolean)
            .map((f) => (
              <div key={f!.label}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.7px",
                    textTransform: "uppercase",
                    color: c.cardLabel,
                    marginBottom: 3,
                  }}
                >
                  {f!.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: c.cardSpan }}>{f!.value}</div>
              </div>
            ))}
        </div>

        {/* Earnings / Deductions columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
          {/* Earnings */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 10,
                paddingBottom: 7,
                borderBottom: `2px solid ${c.colTitleEarn}`,
                color: c.colTitleEarn,
              }}
            >
              Earnings
            </div>
            <div style={psLine}>
              <span>Basic Salary</span>
              <span style={amountStyle}>{fmt(data.basicSalary)}</span>
            </div>
            {data.allowances > 0 && (
              <div style={psLine}>
                <span>Allowances</span>
                <span style={amountStyle}>{fmt(data.allowances)}</span>
              </div>
            )}
            {earningLines.map((l) =>
              l.label || l.value > 0 ? (
                <div key={l.id} style={psLine}>
                  <span>{l.label || "Earning"}</span>
                  <span style={amountStyle}>{fmt(l.value)}</span>
                </div>
              ) : null,
            )}
            <div style={psLineSubtotal}>
              <span>Gross Earnings</span>
              <span style={amountStyle}>{fmt(t.grossEarnings)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 10,
                paddingBottom: 7,
                borderBottom: `2px solid ${c.colTitleDed}`,
                color: c.colTitleDed,
              }}
            >
              Deductions
            </div>
            {data.baseDeductions > 0 && (
              <div style={psLine}>
                <span>Base Deductions</span>
                <span style={amountStyle}>{fmt(data.baseDeductions)}</span>
              </div>
            )}
            {deductionLines.map((l) =>
              l.label || l.value > 0 ? (
                <div key={l.id} style={psLine}>
                  <span>{l.label || "Deduction"}</span>
                  <span style={amountStyle}>{fmt(l.value)}</span>
                </div>
              ) : null,
            )}
            {taxMode !== "none" && t.tax > 0 && (
              <div style={psLine}>
                <span>{taxMode === "auto" ? `Income Tax (${data.taxRate}%)` : "Tax"}</span>
                <span style={amountStyle}>{fmt(t.tax)}</span>
              </div>
            )}
            <div style={psLineSubtotal}>
              <span>Total Deductions</span>
              <span style={amountStyle}>{fmt(totalDed)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div
          style={{
            background: c.netBg,
            color: c.netColor,
            borderRadius: 10,
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Net Pay
            </div>
            {payPeriod && (
              <div style={{ fontSize: 11, marginTop: 3, opacity: 0.65 }}>{payPeriod}</div>
            )}
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 30,
              letterSpacing: "-0.5px",
            }}
          >
            {fmt(t.net)}
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: c.noteBg,
              color: c.noteColor,
              borderRadius: 8,
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            {data.notes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 32px",
          borderTop: `1px solid ${c.footerBorder}`,
          background: c.footerBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: c.footerColor }}>Generated {today}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              padding: "3px 10px",
              borderRadius: 99,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              background: c.badgeBg,
              color: c.badgeColor,
            }}
          >
            CONFIDENTIAL
          </span>
          {data.empId && <span style={{ fontSize: 11, color: c.footerColor }}>{data.empId}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CreatePage() {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<FormData>({
    companyName: "",
    companyAddress: "",
    empName: "",
    empId: "",
    empRole: "",
    empDept: "",
    payPeriod: new Date().toISOString().slice(0, 7),
    currency: "£",
    basicSalary: 0,
    allowances: 0,
    baseDeductions: 0,
    taxRate: 20,
    taxAmount: 0,
    brandColor: "#6366f1",
    notes: "",
  });

  const [lines, setLines] = useState<CustomLine[]>([]);
  const [theme, setTheme] = useState<Theme>("light");
  const [taxMode, setTaxMode] = useState<TaxMode>("auto");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const set = (key: keyof FormData, value: any) => setData((prev) => ({ ...prev, [key]: value }));

  const addLine = (type: "earn" | "ded") => {
    setLines((prev) => [...prev, { id: crypto.randomUUID(), label: "", value: 0, type }]);
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  const updateLine = (id: string, key: keyof CustomLine, value: any) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));

  const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handlePrint = () => window.print();

  // ── Styles ──────────────────────────────────────────────────────────────
  const inp = inputStyle;

  const themeBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 99,
    fontFamily: "inherit",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
    background: active ? "#f0eff4" : "transparent",
    color: active ? "#0f0f11" : "rgba(240,239,244,0.45)",
    transition: "all 0.15s",
  });

  const taxBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "6px 10px",
    borderRadius: 7,
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    border: "none",
    background: active ? "#c8f564" : "transparent",
    color: active ? "#0f0f11" : "rgba(240,239,244,0.45)",
    transition: "all 0.15s",
  });

  const addBtnStyle: React.CSSProperties = {
    background: "rgba(200,245,100,0.12)",
    border: "1px solid rgba(200,245,100,0.2)",
    color: "#c8f564",
    padding: "7px 13px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

        .ps-input:focus {
          border-color: rgba(200,245,100,0.5) !important;
          box-shadow: 0 0 0 3px rgba(200,245,100,0.08) !important;
        }
        .upload-btn:hover { border-color: rgba(200,245,100,0.4) !important; color: #c8f564 !important; }
        .add-line-btn:hover { background: rgba(200,245,100,0.18) !important; }
        .del-btn:hover { background: rgba(255,94,94,0.2) !important; }
        .print-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .slide-in { animation: slideIn 0.18s ease; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-scroll::-webkit-scrollbar { width: 4px; }
        .form-scroll::-webkit-scrollbar-track { background: transparent; }
        .form-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        @media print {
          .no-print { display: none !important; }
          .layout-grid {
            padding: 0 !important;
          }
          .preview-panel {
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <main
        className="min-h-screen bg-background text-foreground"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <BackgroundFX />

        {/* ── Header ── */}
        <header
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(14px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                background: "none",
                border: "none",
                color: "#f0eff4",
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 18,
                letterSpacing: "-0.3px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Payslip Generator
              <span
                style={{
                  fontSize: 10,
                  color: "#c8f564",
                  background: "rgba(200,245,100,0.12)",
                  padding: "3px 9px",
                  borderRadius: 99,
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                ● Live
              </span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Theme tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["light", "dark", "branded"] as Theme[]).map((t) => (
                <button key={t} style={themeBtnStyle(theme === t)} onClick={() => setTheme(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <button
              className="print-btn"
              onClick={handlePrint}
              style={{
                background: "#c8f564",
                color: "#0f0f11",
                border: "none",
                padding: "9px 20px",
                borderRadius: 10,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "opacity 0.15s, transform 0.1s",
              }}
            >
              <Printer size={14} /> Print / Export PDF
            </button>
          </div>
        </header>

        {/* ── Layout ── */}
        <div
          className="layout-grid"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 24px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "420px 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* ══ FORM PANEL ══ */}
            <div
              className="form-scroll no-print"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {/* Company */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Company</SectionLabel>

                {/* Logo upload */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      border: "1px dashed rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                      flexShrink: 0,
                    }}
                  >
                    {logoDataUrl ? (
                      <img
                        src={logoDataUrl}
                        alt="logo"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      "🏢"
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(240,239,244,0.45)", marginBottom: 6 }}>
                      Company Logo (optional)
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleLogo}
                    />
                    <button
                      className="upload-btn"
                      onClick={() => logoInputRef.current?.click()}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#f0eff4",
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontFamily: "inherit",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                      }}
                    >
                      Upload Logo
                    </button>
                  </div>
                </div>

                <Field label="Company Name">
                  <input
                    className="ps-input"
                    style={inp}
                    placeholder="Acme Corp Ltd."
                    value={data.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                  />
                </Field>
                <Field label="Company Address / Tagline">
                  <input
                    className="ps-input"
                    style={inp}
                    placeholder="123 Business Street, London EC1A 1BB"
                    value={data.companyAddress}
                    onChange={(e) => set("companyAddress", e.target.value)}
                  />
                </Field>
              </div>

              {/* Employee */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Employee Details</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Field label="Full Name">
                    <input
                      className="ps-input"
                      style={inp}
                      placeholder="Jane Smith"
                      value={data.empName}
                      onChange={(e) => set("empName", e.target.value)}
                    />
                  </Field>
                  <Field label="Employee ID">
                    <input
                      className="ps-input"
                      style={inp}
                      placeholder="EMP-0042"
                      value={data.empId}
                      onChange={(e) => set("empId", e.target.value)}
                    />
                  </Field>
                  <Field label="Job Title">
                    <input
                      className="ps-input"
                      style={inp}
                      placeholder="Senior Designer"
                      value={data.empRole}
                      onChange={(e) => set("empRole", e.target.value)}
                    />
                  </Field>
                  <Field label="Department">
                    <input
                      className="ps-input"
                      style={inp}
                      placeholder="Creative"
                      value={data.empDept}
                      onChange={(e) => set("empDept", e.target.value)}
                    />
                  </Field>
                  <Field label="Pay Period">
                    <input
                      className="ps-input"
                      style={inp}
                      type="month"
                      value={data.payPeriod}
                      onChange={(e) => set("payPeriod", e.target.value)}
                    />
                  </Field>
                  <Field label="Currency">
                    <select
                      className="ps-input"
                      style={inp}
                      value={data.currency}
                      onChange={(e) => set("currency", e.target.value)}
                    >
                      <option value="£">£ GBP</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ EUR</option>
                      <option value="₦">₦ NGN</option>
                      <option value="₹">₹ INR</option>
                      <option value="R">R ZAR</option>
                      <option value="¥">¥ JPY</option>
                      <option value="A$">A$ AUD</option>
                      <option value="C$">C$ CAD</option>
                      <option value="CHF">CHF</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Brand colour */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Brand Colour</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={data.brandColor}
                    onChange={(e) => set("brandColor", e.target.value)}
                    style={{
                      width: 44,
                      height: 38,
                      padding: 3,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(240,239,244,0.45)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {data.brandColor}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(240,239,244,0.35)" }}>
                    — header, accents &amp; net pay
                  </span>
                </div>
              </div>

              {/* Base Pay */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Base Pay</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <Field label="Basic Salary">
                    <input
                      className="ps-input"
                      style={inp}
                      type="number"
                      placeholder="0"
                      min={0}
                      value={data.basicSalary || ""}
                      onChange={(e) => set("basicSalary", parseFloat(e.target.value) || 0)}
                    />
                  </Field>
                  <Field label="Allowances">
                    <input
                      className="ps-input"
                      style={inp}
                      type="number"
                      placeholder="0"
                      min={0}
                      value={data.allowances || ""}
                      onChange={(e) => set("allowances", parseFloat(e.target.value) || 0)}
                    />
                  </Field>
                  <Field label="Base Deductions">
                    <input
                      className="ps-input"
                      style={inp}
                      type="number"
                      placeholder="0"
                      min={0}
                      value={data.baseDeductions || ""}
                      onChange={(e) => set("baseDeductions", parseFloat(e.target.value) || 0)}
                    />
                  </Field>
                </div>
              </div>

              {/* Custom Earnings */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Custom Earnings</SectionLabel>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 12, color: "rgba(240,239,244,0.45)" }}>
                    Bonus, commission, overtime…
                  </span>
                  <button
                    className="add-line-btn"
                    style={addBtnStyle}
                    onClick={() => addLine("earn")}
                  >
                    <Plus size={12} /> Add Line
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {lines
                    .filter((l) => l.type === "earn")
                    .map((l) => (
                      <div
                        key={l.id}
                        className="slide-in"
                        style={{ display: "flex", gap: 6, alignItems: "center" }}
                      >
                        <input
                          className="ps-input"
                          style={{ ...inp, flex: 1, minWidth: 0 }}
                          placeholder="Label e.g. Bonus"
                          value={l.label}
                          onChange={(e) => updateLine(l.id, "label", e.target.value)}
                        />
                        <input
                          className="ps-input"
                          style={{ ...inp, width: 90, flexShrink: 0 }}
                          type="number"
                          placeholder="0"
                          value={l.value || ""}
                          onChange={(e) =>
                            updateLine(l.id, "value", parseFloat(e.target.value) || 0)
                          }
                        />
                        <button
                          className="del-btn"
                          onClick={() => removeLine(l.id)}
                          title="Remove"
                          style={{
                            background: "rgba(255,94,94,0.08)",
                            border: "1px solid rgba(255,94,94,0.15)",
                            color: "#ff5e5e",
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background 0.15s",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Custom Deductions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Custom Deductions</SectionLabel>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 12, color: "rgba(240,239,244,0.45)" }}>
                    Pension, NI, student loan…
                  </span>
                  <button
                    className="add-line-btn"
                    style={addBtnStyle}
                    onClick={() => addLine("ded")}
                  >
                    <Plus size={12} /> Add Line
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {lines
                    .filter((l) => l.type === "ded")
                    .map((l) => (
                      <div
                        key={l.id}
                        className="slide-in"
                        style={{ display: "flex", gap: 6, alignItems: "center" }}
                      >
                        <input
                          className="ps-input"
                          style={{ ...inp, flex: 1, minWidth: 0 }}
                          placeholder="Label e.g. Pension"
                          value={l.label}
                          onChange={(e) => updateLine(l.id, "label", e.target.value)}
                        />
                        <input
                          className="ps-input"
                          style={{ ...inp, width: 90, flexShrink: 0 }}
                          type="number"
                          placeholder="0"
                          value={l.value || ""}
                          onChange={(e) =>
                            updateLine(l.id, "value", parseFloat(e.target.value) || 0)
                          }
                        />
                        <button
                          className="del-btn"
                          onClick={() => removeLine(l.id)}
                          title="Remove"
                          style={{
                            background: "rgba(255,94,94,0.08)",
                            border: "1px solid rgba(255,94,94,0.15)",
                            color: "#ff5e5e",
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "background 0.15s",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tax */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Tax</SectionLabel>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    background: "rgba(255,255,255,0.04)",
                    padding: 4,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {(["auto", "manual", "none"] as TaxMode[]).map((m) => (
                    <button
                      key={m}
                      style={taxBtnStyle(taxMode === m)}
                      onClick={() => setTaxMode(m)}
                    >
                      {m === "auto" ? "Auto %" : m === "manual" ? "Fixed Amount" : "No Tax"}
                    </button>
                  ))}
                </div>
                {taxMode === "auto" && (
                  <Field label="Tax Rate (%)">
                    <input
                      className="ps-input"
                      style={inp}
                      type="number"
                      min={0}
                      max={100}
                      value={data.taxRate}
                      onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)}
                    />
                  </Field>
                )}
                {taxMode === "manual" && (
                  <Field label="Tax Amount">
                    <input
                      className="ps-input"
                      style={inp}
                      type="number"
                      min={0}
                      placeholder="0"
                      value={data.taxAmount || ""}
                      onChange={(e) => set("taxAmount", parseFloat(e.target.value) || 0)}
                    />
                  </Field>
                )}
              </div>

              {/* Notes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Notes / Payment Info</SectionLabel>
                <textarea
                  className="ps-input"
                  style={{ ...inp, resize: "vertical" }}
                  rows={2}
                  placeholder="e.g. Bank transfer — Barclays ****1234"
                  value={data.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </div>
            </div>

            {/* ══ PREVIEW PANEL ══ */}
            <div
              className="preview-panel"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 24,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%" }}>
                <PayslipPreview
                  data={data}
                  lines={lines}
                  theme={theme}
                  taxMode={taxMode}
                  logoDataUrl={logoDataUrl}
                />
              </div>
            </div>
          </div>
          {/* end inner grid */}
        </div>
      </main>
    </>
  );
}
