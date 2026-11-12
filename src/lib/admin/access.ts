import { cookies } from "next/headers";
import { authSecret, readSessionToken, SESSION_COOKIE, type ProductSession } from "@/lib/auth/session";

export type AdminAccess = {
  root: boolean;
  session: ProductSession;
};

function parseList(raw: string | undefined) {
  return (raw ?? "")
    .split(/[,;\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function adminEmailAllowlist() {
  return parseList(process.env.SITE_ADMIN_EMAILS);
}

export function adminSubAllowlist() {
  return parseList(process.env.SITE_ADMIN_SUBS);
}

export async function readAdminSession(): Promise<ProductSession | null> {
  if (!authSecret()) return null;
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value || "");
}

/** Session must exist; allowlist grants access. Dev fallback only when allowlist empty. */
export async function resolveAdminAccess(): Promise<AdminAccess | null> {
  const session = await readAdminSession();
  if (!session) return null;

  const emails = adminEmailAllowlist();
  const subs = adminSubAllowlist();
  const email = session.email.trim().toLowerCase();
  const sub = session.sub.trim().toLowerCase();

  if (emails.length === 0 && subs.length === 0) {
    if (process.env.NODE_ENV === "production") return null;
    return { root: true, session };
  }

  const matched = emails.includes(email) || subs.includes(sub);
  if (!matched) return null;
  return { root: true, session };
}

export function adminLoginHref(returnTo = "/admin") {
  return `/api/auth/bhd/start?returnTo=${encodeURIComponent(returnTo)}`;
}

export function isAuthConfigured() {
  return Boolean(authSecret());
}

/** Local-only escape hatch to preview the console chrome without SSO. */
export function isAdminDevOpen() {
  return process.env.NODE_ENV !== "production" && process.env.SITE_ADMIN_DEV_OPEN === "1";
}

export async function resolveAdminAccessOrDev(): Promise<
  | { kind: "ok"; access: AdminAccess; allowlistMissing: boolean }
  | { kind: "login" }
  | { kind: "forbidden" }
  | { kind: "auth-config" }
> {
  if (isAdminDevOpen()) {
    return {
      kind: "ok",
      access: {
        root: true,
        session: {
          sub: "dev-admin",
          email: "admin@localhost",
          name: "Dev Admin",
        },
      },
      allowlistMissing: true,
    };
  }

  if (!isAuthConfigured()) return { kind: "auth-config" };

  const session = await readAdminSession();
  if (!session) return { kind: "login" };

  const emails = adminEmailAllowlist();
  const subs = adminSubAllowlist();
  const email = session.email.trim().toLowerCase();
  const sub = session.sub.trim().toLowerCase();
  const allowlistMissing = emails.length === 0 && subs.length === 0;

  if (allowlistMissing) {
    if (process.env.NODE_ENV === "production") return { kind: "forbidden" };
    return { kind: "ok", access: { root: true, session }, allowlistMissing: true };
  }

  if (!emails.includes(email) && !subs.includes(sub)) return { kind: "forbidden" };
  return { kind: "ok", access: { root: true, session }, allowlistMissing: false };
}
