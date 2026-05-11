// ──────────────────────────────────────────────────────────────────────────────
// Backend API client — talks to your Node.js + Express + Mongoose backend.
// ──────────────────────────────────────────────────────────────────────────────
// Configure with environment variables (see .env.example):
//   VITE_API_URL            e.g. http://localhost:5000/api
//   VITE_GOOGLE_CLIENT_ID   your Google OAuth web client id
//
// Endpoints expected on the backend:
//   POST {API_URL}/auth/google   body: { credential: <google_id_token> }
//                                 -> { token?, user }   // token optional if you use sessions
//   POST {API_URL}/auth/signin   body: { email, password }   -> { token, user }
//   POST {API_URL}/auth/signup   body: { email, password, name? } -> { token, user }
//   GET  {API_URL}/auth/me       -> { user }
//   POST {API_URL}/auth/logout   -> { ok: true }
//
// Auth strategy: if your backend returns a JWT in `token`, we save it and send
// it as `Authorization: Bearer <token>`. We also send `credentials: "include"`
// so cookie/session-based auth works too.
// ──────────────────────────────────────────────────────────────────────────────

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || "";

const TOKEN_KEY = "payslip.token";
const USER_KEY = "payslip.user";

export type AuthUser = {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
  nickname?: string;
  avatar?: string;
  avatarSource?: "google" | "upload";
  provider?: string;
  roles?: string[];
};
export type PayslipRecord = {
  _id?: string;
  id?: string;
  data: unknown; // PayslipData JSON
  net?: number;
  gross?: number;
  createdAt?: string;
};

export type TemplateRecord = {
  _id?: string;
  id?: string;
  name: string;
  data: unknown;
  createdAt?: string;
};

export type ScheduleRecord = {
  _id?: string;
  id?: string;
  employeeName: string;
  cadence: "monthly";
  data: unknown;
  nextRunAt?: string;
  active?: boolean;
  createdAt?: string;
};

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStore = {
  get: (): AuthUser | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },

  set: (u: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  },

  // ✅ ADD THIS
  clear: () => {
    localStorage.removeItem(USER_KEY);
  },
};
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : ({} as unknown);
  if (!res.ok) {
    const msg =
      (data as { message?: string; error?: string })?.message ||
      (data as { error?: string })?.error ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

type AuthResponse = { token?: string; user: AuthUser };

export const api = {
  google: (credential: string) =>
    request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    }),
  signup: (email: string, password: string, name?: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),
  signin: (email: string, password: string) =>
    request<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  updateProfile: (formData: FormData) => {
    const token = tokenStore.get();

    return fetch(`${API_URL}/auth/me`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).then(async (res) => {
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      return data;
    });
  },
  me: () => request<{ user: AuthUser }>("/auth/me"),
  signout: () =>
    request<{ ok: true }>("/auth/logout", { method: "POST" }).catch(() => ({ ok: true as const })),

  listPayslips: () => request<{ items: PayslipRecord[] }>("/payslips"),
  createPayslip: (payload: { data: unknown; gross: number; net: number }) =>
    request<{ item: PayslipRecord }>("/payslips", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deletePayslip: (id: string) => request<{ ok: true }>(`/payslips/${id}`, { method: "DELETE" }),

  // Templates
  getTemplates: () => request<{ items: TemplateRecord[] }>("/templates"),
  createTemplate: (payload: { name: string; data: unknown }) =>
    request<{ item: TemplateRecord }>("/templates", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteTemplate: (id: string) => request<{ ok: true }>(`/templates/${id}`, { method: "DELETE" }),

  // Recurring schedules
  listSchedules: () => request<{ items: ScheduleRecord[] }>("/schedules"),
  getSchedule: (id: string) => request<{ item: ScheduleRecord }>(`/schedules/${id}`),
  createSchedule: (payload: { employeeName: string; data: unknown; cadence?: string }) =>
    request<{ item: ScheduleRecord }>("/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateSchedule: (
    id: string,
    payload: { employeeName?: string; data?: unknown; active?: boolean },
  ) =>
    request<{ item: ScheduleRecord }>(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteSchedule: (id: string) => request<{ ok: true }>(`/schedules/${id}`, { method: "DELETE" }),
};
