export type AuthUser = {
  email: string;
  passwordHash: string;
};

const USERS_KEY = "artbattle_users";
const SESSION_KEY = "artbattle_session";

export function getUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((user) => user && typeof user.email === "string")
      .map((user) => ({
        email: String(user.email).toLowerCase(),
        passwordHash:
          typeof user.passwordHash === "string"
            ? user.passwordHash
            : typeof user.password === "string"
              ? user.password
              : "",
      }))
      .filter((user) => !!user.passwordHash);
  } catch {
    return [];
  }
}

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerUser(email: string, password: string) {
  const users = getUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    return { ok: false as const, error: "Email already registered." };
  }
  const passwordHash = await hashPassword(password);
  const next = [...users, { email: normalized, passwordHash }];
  window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
  window.localStorage.setItem(SESSION_KEY, normalized);
  return { ok: true as const };
}

export async function loginUser(email: string, password: string) {
  const users = getUsers();
  const normalized = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(USERS_KEY);
  let legacyPassword = "";
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const legacyUser = parsed.find(
          (user) =>
            user &&
            String(user.email || "").toLowerCase() === normalized &&
            typeof user.password === "string",
        );
        legacyPassword =
          legacyUser && typeof legacyUser.password === "string"
            ? legacyUser.password
            : "";
      }
    } catch {}
  }

  const found = users.find((u) => u.email === normalized);
  const isValid =
    !!found &&
    (found.passwordHash === passwordHash ||
      (!!legacyPassword && legacyPassword === password));
  if (!isValid || !found) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  if (found.passwordHash !== passwordHash) {
    const migrated = users.map((user) =>
      user.email === normalized ? { ...user, passwordHash } : user,
    );
    window.localStorage.setItem(USERS_KEY, JSON.stringify(migrated));
  }

  window.localStorage.setItem(SESSION_KEY, normalized);
  return { ok: true as const };
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getSessionEmail() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function isLoggedIn() {
  return !!getSessionEmail();
}
