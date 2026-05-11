import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import initPassport from "./config/passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ───────────────────────────────
   ENV CHECK
─────────────────────────────── */
const requiredEnvVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
const missing = requiredEnvVars.filter((v) => !process.env[v]);

if (missing.length) {
  console.error("Missing env vars:", missing.join(", "));
  process.exit(1);
}

/* ───────────────────────────────
   CORS
─────────────────────────────── */
const corsOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ───────────────────────────────
   SECURITY HEADERS
─────────────────────────────── */
app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "unsafe-none");
  res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

/* ───────────────────────────────
   BODY PARSER
─────────────────────────────── */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ───────────────────────────────
   SESSION
─────────────────────────────── */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

/* ───────────────────────────────
   PASSPORT
─────────────────────────────── */
initPassport();
app.use(passport.initialize());
app.use(passport.session());

/* ───────────────────────────────
   STATIC FILES
─────────────────────────────── */
app.use(express.static(path.resolve(__dirname, "../public")));

/* ───────────────────────────────
   LOGGING
─────────────────────────────── */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/* ───────────────────────────────
   HEALTH CHECK
─────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

/* ───────────────────────────────
   ROUTES (YOUR FOLDER = route)
─────────────────────────────── */

// IMPORTANT: keep ONLY imports that exist
import authRouter from "./route/auth.route.js";
import payslipRoutes from "./route/payslips.route.js";
import templateRoutes from "./route/templates.route.js";

/* SAFE IMPORT for schedules (prevents crash if missing) */
let scheduleRoutes;
try {
  const mod = await import("./route/sehedules.route.js");
  scheduleRoutes = mod.default;
  console.log("✅ Schedules route loaded successfully");
} catch (err) {
  console.log("⚠ sehedules.route.js not found, skipping");
}

/* ───────────────────────────────
   MOUNT ROUTES
─────────────────────────────── */
console.log("📍 Mounting routes...");
app.use("/api/auth", authRouter);
app.use("/api/payslips", payslipRoutes);
app.use("/api/templates", templateRoutes);

if (scheduleRoutes) {
  app.use("/api/schedules", scheduleRoutes);
  console.log("✅ /api/schedules route mounted");
} else {
  console.log("❌ /api/schedules route NOT mounted - scheduleRoutes is null");
}

/* Optional routes (safe loader style) */
const tryMount = async (file, pathName) => {
  try {
    const mod = await import(file);
    const router = mod.default;

    if (router) {
      app.use(pathName, router);
      console.log(`Mounted ${pathName}`);
    }
  } catch (err) {
    console.log(`Skipping ${file}`);
  }
};

tryMount("./route/generate.route.js", "/api/generate");
tryMount("./route/edit.route.js", "/api/edit");

/* ───────────────────────────────
   404
─────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Route not found" });
});

/* ───────────────────────────────
   ERROR HANDLER
─────────────────────────────── */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || "Server error",
  });
});

export { app };
