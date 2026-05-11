// Google Identity Services loader + ID-token helper.
// Loads https://accounts.google.com/gsi/client once and exposes a Promise-based
// helper that resolves with the Google `credential` (a JWT ID token) which you
// then POST to your backend at /auth/google.

import { GOOGLE_CLIENT_ID } from "./api";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

let loaderPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

/** Render the official Google button into an element. */
export async function renderGoogleButton(
  el: HTMLElement,
  onCredential: (credential: string) => void,
) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("VITE_GOOGLE_CLIENT_ID is not set");
  }
  await loadGoogleScript();
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: { credential: string }) => {
      if (response?.credential) onCredential(response.credential);
    },
    ux_mode: "popup",
    auto_select: false,
  });
  // Clear any previous render
  el.innerHTML = "";
  window.google.accounts.id.renderButton(el, {
    theme: "filled_black",
    size: "large",
    shape: "pill",
    text: "continue_with",
    logo_alignment: "left",
    width: el.clientWidth || 320,
  });
}
