import type { PublicProfile, PublicProject, PublicExperience } from "@/types/public";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function fetchPublic<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchProfile(): Promise<PublicProfile> {
  return fetchPublic("/public/profile");
}

export function fetchProjects(): Promise<PublicProject[]> {
  return fetchPublic("/public/projects");
}

export function fetchProjectBySlug(slug: string): Promise<PublicProject> {
  return fetchPublic(`/public/projects/${slug}`);
}

export function fetchExperiences(): Promise<PublicExperience[]> {
  return fetchPublic("/public/experiences");
}
