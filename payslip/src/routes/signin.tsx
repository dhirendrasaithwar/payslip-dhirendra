import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, FileText, Loader2, Mail, Lock, User } from "lucide-react";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { api, tokenStore, userStore, GOOGLE_CLIENT_ID } from "@/lib/api";
import { renderGoogleButton } from "@/lib/google";
import { toast } from "sonner";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Payslip.io" },
      { name: "description", content: "Sign in to Payslip.io to generate professional payslips in seconds." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const finishLogin = (token: string | undefined, user: { email?: string; name?: string }) => {
    if (token) tokenStore.set(token);
    userStore.set(user);
    toast.success(`Welcome${user.name ? `, ${user.name}` : ""}!`);
    navigate({ to: "/dashboard" });
  };

  // Mount Google button
  useEffect(() => {
    if (!googleBtnRef.current || !GOOGLE_CLIENT_ID) return;
    renderGoogleButton(googleBtnRef.current, async (credential) => {
      try {
        setLoading(true);
        const { token, user } = await api.google(credential);
        finishLogin(token, user);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } =
        mode === "signup"
          ? await api.signup(email, password, name || undefined)
          : await api.signin(email, password);
      finishLogin(token, user);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center px-6 py-16">
      <BackgroundFX />

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue to Payslip.io"
                : "Start generating payslips in seconds"}
            </p>
          </div>

          {/* Google Sign-In */}
          <div className="mt-8">
            {GOOGLE_CLIENT_ID ? (
              <div ref={googleBtnRef} className="flex justify-center [color-scheme:light]" />
            ) : (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-200/90">
                Set <code className="text-brand-cyan">VITE_GOOGLE_CLIENT_ID</code> in your{" "}
                <code className="text-brand-cyan">.env</code> to enable Google sign-in.
              </div>
            )}
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.65_0.24_295/0.7)] hover:shadow-[0_15px_40px_-5px_oklch(0.65_0.24_295/0.8)] transition-shadow disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to Payslip.io? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-brand-cyan hover:underline font-medium"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Backend: <code className="text-brand-cyan">VITE_API_URL</code> · Google:{" "}
          <code className="text-brand-cyan">VITE_GOOGLE_CLIENT_ID</code>
        </p>
      </motion.div>
    </main>
  );
}
