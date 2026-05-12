import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] ??= "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchProfile(): Promise<User> {
  return request("/auth/profile", { method: "GET" });
}
