export type PublicProfile = {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  email_public: string | null;
  resume_url: string | null;
  social_links: Record<string, string> | null;
};

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  status: string;
  short_description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  start_date: string | null;
  end_date: string | null;
  featured: boolean;
  display_order: number;
  technologies: { id: string; name: string; icon?: string }[];
};

export type PublicExperience = {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  display_order: number;
};
