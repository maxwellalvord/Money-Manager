import { useAuth } from "@clerk/clerk-expo";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not set — copy .env.example to .env.local");
}

type GetToken = () => Promise<string | null>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

// Thin wrapper around app/api/v1/* — mirrors the app/actions/* functions the
// web app calls directly, but over HTTP with a Clerk Bearer token since
// mobile can't call Next.js Server Actions.
async function request<T>(getToken: GetToken, path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && typeof data === "object" && "error" in data ? data.error : null) ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function useApi() {
  const { getToken } = useAuth();

  return {
    get: <T,>(path: string) => request<T>(getToken, path),
    post: <T,>(path: string, body?: unknown) => request<T>(getToken, path, { method: "POST", body }),
    patch: <T,>(path: string, body?: unknown) => request<T>(getToken, path, { method: "PATCH", body }),
    delete: <T,>(path: string) => request<T>(getToken, path, { method: "DELETE" }),
  };
}
