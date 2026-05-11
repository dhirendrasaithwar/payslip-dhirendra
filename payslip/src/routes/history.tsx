import { formatCurrency, type PayslipData } from "@/components/dashboard/payslip-types";
import { downloadPayslipPDF } from "@/components/dashboard/pdf";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { useAuth } from "@/hooks/use-auth";
import { api, type PayslipRecord } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Payslip.io" },
      {
        name: "description",
        content: "Browse, re-download or delete previously generated payslips.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<PayslipRecord[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    api
      .listPayslips()
      .then(({ items }) => setItems(items))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load history"))
      .finally(() => setBusy(false));
  }, [user]);

  const remove = async (id: string) => {
    try {
      await api.deletePayslip(id);
      setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading || !user) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-brand-cyan" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden px-6 py-16">
      <BackgroundFX />

      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Payslip <span className="text-gradient">History</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every payslip you generated, ready to re-download.
          </p>
        </motion.div>

        {busy ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-brand-cyan" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-strong rounded-3xl p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              No payslips yet. Generate one from the dashboard to see it here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((p, i) => {
              const id = (p._id || p.id) as string;
              const d = p.data as PayslipData;
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft border border-white/10 text-brand-cyan">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {d?.employeeName || "Untitled"} · {d?.payPeriod || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {d?.companyName || ""} · Net {formatCurrency(p.net ?? 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadPayslipPDF(d)}
                    className="inline-flex items-center gap-1.5 rounded-lg glass border border-white/10 px-3 py-1.5 text-xs hover:border-white/25"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => remove(id)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
