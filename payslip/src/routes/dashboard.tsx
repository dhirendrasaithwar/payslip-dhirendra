import { computeTotals, type PayslipData } from "@/components/dashboard/payslip-types";
import { PayslipForm } from "@/components/dashboard/PayslipForm";
import { PayslipPreview } from "@/components/dashboard/PayslipPreview";
import { downloadPayslipPDF } from "@/components/dashboard/pdf";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { api, type ScheduleRecord, type TemplateRecord } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkPlus,
  ChevronDown,
  Download,
  FileText,
  History,
  LogOut,
  PenLine,
  RotateCcw,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const defaultPayslip: PayslipData = {
  companyName: "Chaudhary ltd.",
  companyLogo: null,
  employeeName: "Rajendra Chaudhary",
  employeeId: "EMP-00421",
  role: "Senior Product Designer",
  payPeriod: new Date().toISOString().slice(0, 7),
  basic: 6500,
  allowances: 800,
  deductions: 200,
  taxAuto: true,
  taxRate: 18,
  taxManual: 0,
  theme: "light",
  brandColor: "#6366f1",
};

const getId = (item: { _id?: string; id?: string }) =>
  (typeof item._id ?? item.id === "string") ? (item._id ?? item.id) : "";

// ─── Reusable button components ───────────────────────────────────────────────

type ActionBtnProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "ghost" | "danger" | "accent";
  loading?: boolean;
  disabled?: boolean;
};

function ActionBtn({ onClick, icon, label, variant = "ghost", loading, disabled }: ActionBtnProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    transition: "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
    border: "1px solid transparent",
    fontFamily: "inherit",
    letterSpacing: "-0.1px",
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#fff",
      boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
      border: "1px solid rgba(139,92,246,0.3)",
    },
    accent: {
      background: "linear-gradient(135deg, #c8f564 0%, #a3e635 100%)",
      color: "#0f0f11",
      boxShadow: "0 4px 15px rgba(200,245,100,0.3)",
      border: "1px solid rgba(200,245,100,0.4)",
    },
    ghost: {
      background: "rgba(255,255,255,0.06)",
      color: "rgba(240,239,244,0.85)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    danger: {
      background: "rgba(255,94,94,0.1)",
      color: "#ff8585",
      border: "1px solid rgba(255,94,94,0.2)",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`action-btn action-btn--${variant}`}
      style={{ ...base, ...variants[variant] }}
    >
      {loading ? (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}

// ─── Nav link ────────────────────────────────────────────────────────────────

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="nav-link"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(240,239,244,0.6)",
        textDecoration: "none",
        padding: "6px 12px",
        borderRadius: 10,
        border: "1px solid transparent",
        transition: "all 0.15s",
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<PayslipData>(defaultPayslip);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [generating, setGenerating] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totals = useMemo(() => computeTotals(data), [data]);

  const handleSave = async () => {
    setGenerating(true);
    try {
      await api.createPayslip({ data, gross: totals.gross, net: totals.net });
      toast.success("Payslip saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => setData(defaultPayslip);
  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const saveTemplate = async () => {
    const name = window.prompt("Template name", data.employeeName || "Template");
    if (!name) return;
    try {
      const res = await api.createTemplate({ name, data });
      setTemplates((prev) => [res.item, ...prev]);
      toast.success("Template saved");
    } catch {
      toast.error("Failed to save template");
    }
  };

  const loadTemplate = (t: TemplateRecord) => {
    if (!t?.data) return;
    setData(t.data as PayslipData);
    toast.success("Template loaded");
  };

  const removeTemplate = async (item: TemplateRecord) => {
    const id = item._id || item.id;
    if (!id) return;
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => (t._id || t.id) !== id));
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  };

  useEffect(() => {
    const selectedTemplate = sessionStorage.getItem("selectedTemplate");
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        if (template?.data) {
          setData(template.data as PayslipData);
          toast.success(`Template "${template.name}" loaded`);
        }
      } finally {
        sessionStorage.removeItem("selectedTemplate");
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .getTemplates()
      .then((r) => setTemplates(r.items || []))
      .catch(() => toast.error("Failed to load templates"));
    api
      .listSchedules()
      .then((r) => setSchedules(r.items || []))
      .catch(() => toast.error("Failed to load schedules"));
  }, [user]);

  const [schedulingLoading, setSchedulingLoading] = useState(false);

  const scheduleMonthly = async () => {
    if (!data.employeeName) {
      toast.error("Please enter employee name");
      return;
    }
    setSchedulingLoading(true);
    try {
      const res = await api.createSchedule({
        employeeName: data.employeeName,
        data,
        cadence: "monthly",
      });
      if (res.item) {
        setSchedules((prev) => [res.item, ...prev]);
        toast.success("Scheduled");
      }
    } finally {
      setSchedulingLoading(false);
    }
  };

  const removeSchedule = async (item: ScheduleRecord) => {
    const id = getId(item);
    if (!id) return;
    await api.deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => getId(s) !== id));
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=6366f1&color=fff`;
  const avatarSrc =
    typeof user?.avatar === "string" && user.avatar.startsWith("http")
      ? user.avatar
      : fallbackAvatar;

  if (!mounted || loading) {
    return (
      <main className="min-h-screen p-6 bg-background">
        <div
          style={{
            maxWidth: 400,
            margin: "80px auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-60" />
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .nav-link:hover {
          color: rgba(240,239,244,0.95) !important;
          background: rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }

        .action-btn--primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.5) !important;
        }
        .action-btn--accent:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(200,245,100,0.4) !important;
        }
        .action-btn--ghost:hover:not(:disabled) {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.18) !important;
          color: #f0eff4 !important;
          transform: translateY(-1px);
        }
        .action-btn--danger:hover:not(:disabled) {
          background: rgba(255,94,94,0.18) !important;
          border-color: rgba(255,94,94,0.35) !important;
          transform: translateY(-1px);
        }
        .action-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.98) !important;
        }

        .avatar-btn:hover { opacity: 0.85; }
        .avatar-btn:hover img { box-shadow: 0 0 0 3px rgba(99,102,241,0.5); }

        .stat-card:hover {
          background: rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.14) !important;
          transform: translateY(-2px);
        }

        .glass-panel {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
        }

        .create-btn-glow {
          background: linear-gradient(270deg, #c8f564, #6366f1, #8b5cf6, #c8f564);
          background-size: 300% 300%;
          animation: shimmer 4s ease infinite;
          color: #fff;
          border: none !important;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .create-btn-glow:hover:not(:disabled) {
          box-shadow: 0 8px 30px rgba(99,102,241,0.55) !important;
          transform: translateY(-2px) !important;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(240,239,244,0.75);
          font-family: inherit;
          transition: all 0.15s;
          text-align: left;
        }
        .menu-item:hover {
          background: rgba(255,255,255,0.08);
          color: #f0eff4;
        }
        .menu-item--danger { color: #ff8585 !important; }
        .menu-item--danger:hover { background: rgba(255,94,94,0.12) !important; }
      `}</style>

      <main
        className="min-h-screen bg-background text-foreground"
        style={{ fontFamily: "inherit", position: "relative" }}
      >
        <BackgroundFX />

        {/* ── Header ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Logo */}
          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              color: "#f0eff4",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
              }}
            >
              <FileText size={15} color="#fff" />
            </div>
            Payslip.io
          </Link>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink to="/templates" icon={<BookmarkPlus size={14} />} label="Templates" />
            <NavLink to="/history" icon={<History size={14} />} label="History" />

            {/* Divider */}
            <div
              style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 6px" }}
            />

            {/* Avatar menu */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                className="avatar-btn"
                onClick={() => setOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "5px 10px 5px 5px",
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                <img
                  src={avatarSrc}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(99,102,241,0.4)",
                    transition: "box-shadow 0.15s",
                  }}
                  alt={user?.name}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(240,239,244,0.8)" }}>
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={13}
                  color="rgba(240,239,244,0.4)"
                  style={{
                    transition: "transform 0.2s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: 210,
                      background: "rgba(18,18,24,0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14,
                      padding: 8,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* User info */}
                    <div
                      style={{
                        padding: "8px 10px 10px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#f0eff4" }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(240,239,244,0.4)", marginTop: 2 }}>
                        {user?.email}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="menu-item"
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={() => setOpen(false)}
                    >
                      <User size={13} /> Profile
                    </Link>
                    <button className="menu-item menu-item--danger" onClick={handleLogout}>
                      <LogOut size={13} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </header>

        {/* ── Page content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "32px 24px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {/* Page heading */}
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#f0eff4",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Sparkles size={20} color="#c8f564" />
              Payslip Builder
            </h1>
            <p style={{ fontSize: 13, color: "rgba(240,239,244,0.4)", fontWeight: 400 }}>
              Fill in the details below — your payslip updates live on the right.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              {
                label: "Gross Pay",
                value: `£${totals.gross.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                color: "#6366f1",
              },
              {
                label: "Net Pay",
                value: `£${totals.net.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                color: "#c8f564",
              },
              {
                label: "Deductions",
                value: `£${(totals.gross - totals.net).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                color: "#ff8585",
              },
              { label: "Templates", value: String(templates.length), color: "#a78bfa" },
            ].map((s) => (
              <div
                key={s.label}
                className="stat-card"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "14px 20px",
                  transition: "all 0.2s",
                  cursor: "default",
                  flex: "1 1 160px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: "rgba(240,239,244,0.4)",
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{ fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Form card */}
            <div className="glass-panel" style={{ padding: 28 }}>
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#f0eff4",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Employee Details
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(240,239,244,0.4)", marginTop: 2 }}>
                    {data.employeeName || "No employee"} · {data.payPeriod}
                  </p>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={15} color="#6366f1" />
                </div>
              </div>

              <PayslipForm data={data} onChange={setData} />

              {/* Action buttons */}
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <ActionBtn
                  onClick={handleSave}
                  icon={<Save size={14} />}
                  label="Save Payslip"
                  variant="primary"
                  loading={generating}
                />
                <ActionBtn
                  onClick={() => downloadPayslipPDF(data)}
                  icon={<Download size={14} />}
                  label="Export PDF"
                  variant="accent"
                />

                {/* Create manually — shimmer gradient button */}
                <button
                  onClick={() => navigate({ to: "/create" })}
                  className="action-btn create-btn-glow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 16px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "-0.1px",
                    transition: "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <PenLine size={14} /> Create Manually
                </button>

                <ActionBtn
                  onClick={saveTemplate}
                  icon={<BookmarkPlus size={14} />}
                  label="Save Template"
                  variant="ghost"
                />
                <ActionBtn
                  onClick={handleReset}
                  icon={<RotateCcw size={14} />}
                  label="Reset"
                  variant="danger"
                />
              </div>
            </div>

            {/* Preview card */}
            <div className="glass-panel" style={{ padding: 28 }}>
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#f0eff4",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Live Preview
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(240,239,244,0.4)", marginTop: 2 }}>
                    Updates as you type
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#c8f564",
                    background: "rgba(200,245,100,0.1)",
                    border: "1px solid rgba(200,245,100,0.2)",
                    borderRadius: 99,
                    padding: "4px 10px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#c8f564",
                      display: "inline-block",
                      boxShadow: "0 0 6px #c8f564",
                    }}
                  />
                  Live
                </div>
              </div>

              <PayslipPreview data={data} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
