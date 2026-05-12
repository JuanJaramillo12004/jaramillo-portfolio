import type { PublicProfile, PublicProject, PublicExperience } from "@/types/public";

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

/* Profile */
export function fetchProfile(): Promise<PublicProfile> {
  return request("/admin/profile");
}

export function updateProfile(data: Partial<PublicProfile>): Promise<PublicProfile> {
  return request("/admin/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* Stats */
export type AdminStats = {
  total: number;
  published: number;
  featured: number;
};

export function fetchStats(): Promise<AdminStats> {
  return request("/admin/projects/stats");
}

/* Projects */
export function fetchAdminProjects(): Promise<PublicProject[]> {
  return request("/admin/projects");
}

export function fetchAdminProject(id: string): Promise<PublicProject> {
  return request(`/admin/projects/${id}`);
}

export type ProjectPayload = {
  title: string;
  slug?: string;
  category?: string;
  status?: string;
  short_description?: string | null;
  long_description?: string | null;
  cover_image_url?: string | null;
  repo_url?: string | null;
  live_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  featured?: boolean;
  display_order?: number;
};

export function createProject(data: ProjectPayload): Promise<PublicProject> {
  return request("/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProject(id: string, data: Partial<ProjectPayload>): Promise<PublicProject> {
  return request(`/admin/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: string): Promise<void> {
  return request(`/admin/projects/${id}`, { method: "DELETE" });
}

/* Experiences */
export function fetchAdminExperiences(): Promise<PublicExperience[]> {
  return request("/admin/experiences");
}

export type ExperiencePayload = {
  role: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  display_order?: number;
};

export function createExperience(data: ExperiencePayload): Promise<PublicExperience> {
  return request("/admin/experiences", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateExperience(id: string, data: Partial<ExperiencePayload>): Promise<PublicExperience> {
  return request(`/admin/experiences/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteExperience(id: string): Promise<void> {
  return request(`/admin/experiences/${id}`, { method: "DELETE" });
}
