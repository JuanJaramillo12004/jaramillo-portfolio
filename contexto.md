__root
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Esta página no existe.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Portafolio · Desarrollador web" },
      {
        name: "description",
        content:
          "Portafolio personal: proyectos de desarrollo web, experiencia profesional y formación.",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      } as unknown as { name: string; content: string },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

about
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Mail, FileDown } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Sobre mí · Portafolio" },
      { name: "description", content: "Quién soy, mi trayectoria y experiencia profesional." },
    ],
  }),
});

function AboutPage() {
  const { data: profile } = useQuery({
    queryKey: ["profile-about"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true })
        .order("start_date", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <header className="mb-16">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">Bio</p>
          <h1 className="font-display text-5xl md:text-6xl">
            {profile?.full_name ?? "Sobre mí"}
          </h1>
          {profile?.headline && (
            <p className="mt-4 text-xl text-muted-foreground">{profile.headline}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile?.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {profile.location}
              </span>
            )}
            {profile?.email_public && (
              <a
                href={`mailto:${profile.email_public}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="size-4" /> {profile.email_public}
              </a>
            )}
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <FileDown className="size-4" /> CV
              </a>
            )}
          </div>
        </header>

        {profile?.bio && (
          <section className="mb-20 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
            {profile.bio}
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="mb-8 font-display text-3xl">Trayectoria</h2>
            <ol className="relative space-y-10 border-l border-border pl-6">
              {experiences.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[31px] top-2 size-3 rounded-full border-2 border-primary bg-background" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl">{e.role}</h3>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {formatRange(e.start_date, e.end_date, e.is_current)}
                    </span>
                  </div>
                  <p className="text-sm text-primary/90">
                    {e.organization}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-2 text-muted-foreground">{e.description}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function formatRange(start: string | null, end: string | null, current: boolean) {
  const f = (d: string) => new Date(d).toLocaleDateString("es", { month: "short", year: "numeric" });
  if (!start) return current ? "Actual" : "";
  return `${f(start)} — ${current ? "Actual" : end ? f(end) : ""}`;
}

admin index
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Star, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [all, pub, feat] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("featured", true),
      ]);
      return {
        total: all.count ?? 0,
        published: pub.count ?? 0,
        featured: feat.count ?? 0,
      };
    },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Hola{user?.email ? `, ${user.email}` : ""}</h1>
      <p className="mt-2 text-muted-foreground">
        Gestiona tu portafolio desde aquí.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Stat label="Total proyectos" value={stats?.total ?? 0} icon={FolderKanban} />
        <Stat label="Publicados" value={stats?.published ?? 0} icon={FileText} />
        <Stat label="Destacados" value={stats?.featured ?? 0} icon={Star} />
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          to="/admin/projects"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Gestionar proyectos
        </Link>
        <Link
          to="/admin/profile"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
        >
          Editar perfil
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <Icon className="size-5 text-primary" />
      <div className="mt-4 font-display text-3xl">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

admin profile  
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/profile")({
  component: ProfileEdit,
});

type ProfileForm = {
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  location: string;
  email_public: string;
  resume_url: string;
  social_links: string;
};

function ProfileEdit() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["admin-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const [v, setV] = useState<ProfileForm>({
    full_name: "",
    headline: "",
    bio: "",
    avatar_url: "",
    location: "",
    email_public: "",
    resume_url: "",
    social_links: "{}",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setV({
        full_name: data.full_name ?? "",
        headline: data.headline ?? "",
        bio: data.bio ?? "",
        avatar_url: data.avatar_url ?? "",
        location: data.location ?? "",
        email_public: data.email_public ?? "",
        resume_url: data.resume_url ?? "",
        social_links: JSON.stringify(data.social_links ?? {}, null, 2),
      });
    }
  }, [data]);

  const set = <K extends keyof ProfileForm>(k: K, val: ProfileForm[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let social: Record<string, string> = {};
      try {
        social = JSON.parse(v.social_links || "{}");
      } catch {
        throw new Error("JSON de redes sociales inválido");
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: v.full_name || null,
          headline: v.headline || null,
          bio: v.bio || null,
          avatar_url: v.avatar_url || null,
          location: v.location || null,
          email_public: v.email_public || null,
          resume_url: v.resume_url || null,
          social_links: social,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="font-display text-3xl">Perfil público</h1>
      <p className="text-sm text-muted-foreground">
        Esta información aparece en el inicio, sobre mí y contacto.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <F label="Nombre">
          <Input value={v.full_name} onChange={(e) => set("full_name", e.target.value)} />
        </F>
        <F label="Ubicación">
          <Input value={v.location} onChange={(e) => set("location", e.target.value)} />
        </F>
        <F label="Email público">
          <Input
            type="email"
            value={v.email_public}
            onChange={(e) => set("email_public", e.target.value)}
          />
        </F>
        <F label="URL del CV">
          <Input value={v.resume_url} onChange={(e) => set("resume_url", e.target.value)} />
        </F>
      </div>

      <F label="Headline (titular del hero)">
        <Input value={v.headline} onChange={(e) => set("headline", e.target.value)} />
      </F>

      <F label="Bio">
        <Textarea rows={6} value={v.bio} onChange={(e) => set("bio", e.target.value)} />
      </F>

      <F label="URL del avatar">
        <Input value={v.avatar_url} onChange={(e) => set("avatar_url", e.target.value)} />
      </F>

      <F label='Redes sociales (JSON, p.ej. {"github":"https://…","linkedin":"https://…"})'>
        <Textarea
          rows={6}
          className="font-mono text-xs"
          value={v.social_links}
          onChange={(e) => set("social_links", e.target.value)}
        />
      </F>

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

admin projects (id)
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/project-form";

export const Route = createFileRoute("/admin/projects/$id")({
  component: EditProject,
});

function EditProject() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div className="text-muted-foreground">Cargando…</div>;
  if (!data) return <div className="text-muted-foreground">Proyecto no encontrado.</div>;

  return (
    <ProjectForm
      initial={{
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        status: data.status,
        short_description: data.short_description ?? "",
        long_description: data.long_description ?? "",
        cover_image_url: data.cover_image_url ?? "",
        repo_url: data.repo_url ?? "",
        live_url: data.live_url ?? "",
        start_date: data.start_date ?? "",
        end_date: data.end_date ?? "",
        featured: data.featured,
        display_order: data.display_order,
      }}
    />
  );
}

admin projects index
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/projects/")({
  component: AdminProjects,
});

function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, slug, title, category, status, featured, display_order")
        .order("display_order", { ascending: true });
      return data ?? [];
    },
  });

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Proyecto eliminado");
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Proyectos</h1>
          <p className="text-sm text-muted-foreground">Crea, edita y publica tus proyectos.</p>
        </div>
        <Button asChild>
          <Link to="/admin/projects/new">
            <Plus className="size-4" /> Nuevo
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.length ? (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.title}
                    {p.featured && <span className="ml-2 text-primary">★</span>}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{p.category}</TableCell>
                  <TableCell>
                    <span
                      className={
                        p.status === "published"
                          ? "rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link to="/admin/projects/$id" params={{ id: p.id }}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  No hay proyectos. Crea el primero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

admin projects new
import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "@/components/project-form";

export const Route = createFileRoute("/admin/projects/new")({
  component: () => <ProjectForm />,
});

admin
import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FolderKanban, User as UserIcon, LogOut, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/" });
  },
});

const items = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Proyectos", icon: FolderKanban, exact: false },
  { to: "/admin/profile", label: "Perfil", icon: UserIcon, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const path = router.state.location.pathname;

  useEffect(() => {
    if (!loading && !isAdmin) router.navigate({ to: "/" });
  }, [loading, isAdmin, router]);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-6 md:flex">
        <Link to="/" className="mb-10 font-display text-xl">
          <span className="text-primary">◆</span> Admin
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <it.icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <Home className="size-4" /> Ver sitio
          </Link>
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/login" });
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <LogOut className="size-4" /> Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

contact
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Github, Linkedin, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contacto · Portafolio" },
      { name: "description", content: "Formas de contacto y redes profesionales." },
    ],
  }),
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  website: Globe,
};

function ContactPage() {
  const { data: profile } = useQuery({
    queryKey: ["profile-contact"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("email_public, social_links, full_name")
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const social = (profile?.social_links ?? {}) as Record<string, string>;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">Contacto</p>
        <h1 className="font-display text-5xl md:text-6xl">Hablemos.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Si tienes un proyecto, una idea o simplemente quieres saludar, escríbeme.
        </p>

        {profile?.email_public && (
          <a
            href={`mailto:${profile.email_public}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground"
          >
            <Mail className="size-5" /> {profile.email_public}
          </a>
        )}

        {Object.keys(social).length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              También estoy en
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = iconMap[key.toLowerCase()] ?? Globe;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm capitalize hover:border-primary/40"
                  >
                    <Icon className="size-4" /> {key}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

index 
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Portafolio · Desarrollador web" },
      {
        name: "description",
        content: "Vitrina de proyectos personales, académicos y profesionales.",
      },
    ],
  }),
});

function HomePage() {
  const { data: profile } = useQuery({
    queryKey: ["profile-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, headline, bio")
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: featured } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("slug, title, category, short_description, cover_image_url")
        .eq("status", "published")
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.14_75/0.12),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" /> Disponible para proyectos
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
              {profile?.headline ?? "Construyo interfaces web que se sienten bien usar."}
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              {profile?.bio ??
                "Soy desarrollador web. Diseño y construyo productos digitales con foco en detalle, rendimiento y experiencia."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Ver proyectos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/40"
              >
                Hablemos
              </Link>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">Selección</p>
              <h2 className="font-display text-3xl md:text-4xl">Trabajo destacado</h2>
            </div>
            <Link
              to="/projects"
              className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Ver todos <ArrowRight className="size-4" />
            </Link>
          </div>
          {featured && featured.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aún no hay proyectos destacados. Inicia sesión como administrador para añadir tu
              primer proyecto.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

login 
import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Acceso · Portafolio" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin" });
  },
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Inicio
        </Link>
        <h1 className="font-display text-4xl">
          {mode === "login" ? "Acceso admin" : "Crear cuenta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Ingresa para gestionar tu portafolio."
            : "La primera cuenta debe asignarse como admin manualmente."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "¿No tienes cuenta? Crear una" : "Ya tengo cuenta"}
        </button>
      </div>
    </div>
  );
}

project (slug)
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select(
          "*, project_technologies(technology:technologies(name, slug, color))",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver a proyectos
        </Link>

        {isLoading || !project ? (
          <div className="text-muted-foreground">Cargando…</div>
        ) : (
          <article>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">
              {project.category}
            </p>
            <h1 className="font-display text-4xl md:text-6xl">{project.title}</h1>
            {project.short_description && (
              <p className="mt-6 text-xl text-muted-foreground">{project.short_description}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                >
                  Ver demo <ExternalLink className="size-4" />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-primary/40"
                >
                  <Github className="size-4" /> Código
                </a>
              )}
            </div>

            {project.cover_image_url && (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="mt-12 w-full rounded-2xl border border-border"
              />
            )}

            {project.project_technologies && project.project_technologies.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Tecnologías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.project_technologies.map(
                    (pt: { technology: { name: string; slug: string } | null }) =>
                      pt.technology && (
                        <span
                          key={pt.technology.slug}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                        >
                          {pt.technology.name}
                        </span>
                      ),
                  )}
                </div>
              </div>
            )}

            {project.long_description && (
              <div className="prose prose-invert mt-12 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                {project.long_description}
              </div>
            )}
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

projects index
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/project-card";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Proyectos · Portafolio" },
      { name: "description", content: "Listado completo de proyectos publicados." },
    ],
  }),
});

const filters = [
  { value: "all", label: "Todos" },
  { value: "personal", label: "Personales" },
  { value: "academic", label: "Académicos" },
  { value: "professional", label: "Profesionales" },
] as const;

function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", filter],
    queryFn: async () => {
      let q = supabase
        .from("projects")
        .select("slug, title, category, short_description, cover_image_url")
        .eq("status", "published")
        .order("display_order", { ascending: true });
      if (filter !== "all") q = q.eq("category", filter);
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <header className="mb-12">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">Archivo</p>
          <h1 className="font-display text-5xl md:text-6xl">Proyectos</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Todos los proyectos publicados, organizados por categoría.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Cargando…</div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay proyectos en esta categoría todavía.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

router
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

routertree.gen.ts
/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as LoginRouteImport } from './routes/login'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ProjectsIndexRouteImport } from './routes/projects.index'
import { Route as AdminIndexRouteImport } from './routes/admin.index'
import { Route as ProjectsSlugRouteImport } from './routes/projects.$slug'
import { Route as AdminProfileRouteImport } from './routes/admin.profile'
import { Route as AdminProjectsIndexRouteImport } from './routes/admin.projects.index'
import { Route as AdminProjectsNewRouteImport } from './routes/admin.projects.new'
import { Route as AdminProjectsIdRouteImport } from './routes/admin.projects.$id'

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const ProjectsIndexRoute = ProjectsIndexRouteImport.update({
  id: '/projects/',
  path: '/projects/',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminIndexRoute = AdminIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)
const ProjectsSlugRoute = ProjectsSlugRouteImport.update({
  id: '/projects/$slug',
  path: '/projects/$slug',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminProfileRoute = AdminProfileRouteImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AdminRoute,
} as any)
const AdminProjectsIndexRoute = AdminProjectsIndexRouteImport.update({
  id: '/projects/',
  path: '/projects/',
  getParentRoute: () => AdminRoute,
} as any)
const AdminProjectsNewRoute = AdminProjectsNewRouteImport.update({
  id: '/projects/new',
  path: '/projects/new',
  getParentRoute: () => AdminRoute,
} as any)
const AdminProjectsIdRoute = AdminProjectsIdRouteImport.update({
  id: '/projects/$id',
  path: '/projects/$id',
  getParentRoute: () => AdminRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin': typeof AdminRouteWithChildren
  '/contact': typeof ContactRoute
  '/login': typeof LoginRoute
  '/admin/profile': typeof AdminProfileRoute
  '/projects/$slug': typeof ProjectsSlugRoute
  '/admin/': typeof AdminIndexRoute
  '/projects/': typeof ProjectsIndexRoute
  '/admin/projects/$id': typeof AdminProjectsIdRoute
  '/admin/projects/new': typeof AdminProjectsNewRoute
  '/admin/projects/': typeof AdminProjectsIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/contact': typeof ContactRoute
  '/login': typeof LoginRoute
  '/admin/profile': typeof AdminProfileRoute
  '/projects/$slug': typeof ProjectsSlugRoute
  '/admin': typeof AdminIndexRoute
  '/projects': typeof ProjectsIndexRoute
  '/admin/projects/$id': typeof AdminProjectsIdRoute
  '/admin/projects/new': typeof AdminProjectsNewRoute
  '/admin/projects': typeof AdminProjectsIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin': typeof AdminRouteWithChildren
  '/contact': typeof ContactRoute
  '/login': typeof LoginRoute
  '/admin/profile': typeof AdminProfileRoute
  '/projects/$slug': typeof ProjectsSlugRoute
  '/admin/': typeof AdminIndexRoute
  '/projects/': typeof ProjectsIndexRoute
  '/admin/projects/$id': typeof AdminProjectsIdRoute
  '/admin/projects/new': typeof AdminProjectsNewRoute
  '/admin/projects/': typeof AdminProjectsIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/admin'
    | '/contact'
    | '/login'
    | '/admin/profile'
    | '/projects/$slug'
    | '/admin/'
    | '/projects/'
    | '/admin/projects/$id'
    | '/admin/projects/new'
    | '/admin/projects/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/contact'
    | '/login'
    | '/admin/profile'
    | '/projects/$slug'
    | '/admin'
    | '/projects'
    | '/admin/projects/$id'
    | '/admin/projects/new'
    | '/admin/projects'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/admin'
    | '/contact'
    | '/login'
    | '/admin/profile'
    | '/projects/$slug'
    | '/admin/'
    | '/projects/'
    | '/admin/projects/$id'
    | '/admin/projects/new'
    | '/admin/projects/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AdminRoute: typeof AdminRouteWithChildren
  ContactRoute: typeof ContactRoute
  LoginRoute: typeof LoginRoute
  ProjectsSlugRoute: typeof ProjectsSlugRoute
  ProjectsIndexRoute: typeof ProjectsIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/projects/': {
      id: '/projects/'
      path: '/projects'
      fullPath: '/projects/'
      preLoaderRoute: typeof ProjectsIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexRouteImport
      parentRoute: typeof AdminRoute
    }
    '/projects/$slug': {
      id: '/projects/$slug'
      path: '/projects/$slug'
      fullPath: '/projects/$slug'
      preLoaderRoute: typeof ProjectsSlugRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/profile': {
      id: '/admin/profile'
      path: '/profile'
      fullPath: '/admin/profile'
      preLoaderRoute: typeof AdminProfileRouteImport
      parentRoute: typeof AdminRoute
    }
    '/admin/projects/': {
      id: '/admin/projects/'
      path: '/projects'
      fullPath: '/admin/projects/'
      preLoaderRoute: typeof AdminProjectsIndexRouteImport
      parentRoute: typeof AdminRoute
    }
    '/admin/projects/new': {
      id: '/admin/projects/new'
      path: '/projects/new'
      fullPath: '/admin/projects/new'
      preLoaderRoute: typeof AdminProjectsNewRouteImport
      parentRoute: typeof AdminRoute
    }
    '/admin/projects/$id': {
      id: '/admin/projects/$id'
      path: '/projects/$id'
      fullPath: '/admin/projects/$id'
      preLoaderRoute: typeof AdminProjectsIdRouteImport
      parentRoute: typeof AdminRoute
    }
  }
}

interface AdminRouteChildren {
  AdminProfileRoute: typeof AdminProfileRoute
  AdminIndexRoute: typeof AdminIndexRoute
  AdminProjectsIdRoute: typeof AdminProjectsIdRoute
  AdminProjectsNewRoute: typeof AdminProjectsNewRoute
  AdminProjectsIndexRoute: typeof AdminProjectsIndexRoute
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminProfileRoute: AdminProfileRoute,
  AdminIndexRoute: AdminIndexRoute,
  AdminProjectsIdRoute: AdminProjectsIdRoute,
  AdminProjectsNewRoute: AdminProjectsNewRoute,
  AdminProjectsIndexRoute: AdminProjectsIndexRoute,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  AdminRoute: AdminRouteWithChildren,
  ContactRoute: ContactRoute,
  LoginRoute: LoginRoute,
  ProjectsSlugRoute: ProjectsSlugRoute,
  ProjectsIndexRoute: ProjectsIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

styles
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --font-display: "Fraunces", "Georgia", serif;
  --font-sans: "Inter", system-ui, sans-serif;
}

:root {
  --radius: 0.5rem;
  /* Editorial dark portfolio with warm amber accent */
  --background: oklch(0.16 0.012 250);
  --foreground: oklch(0.96 0.005 90);
  --card: oklch(0.20 0.014 250);
  --card-foreground: oklch(0.96 0.005 90);
  --popover: oklch(0.20 0.014 250);
  --popover-foreground: oklch(0.96 0.005 90);
  --primary: oklch(0.82 0.14 75);
  --primary-foreground: oklch(0.18 0.014 250);
  --secondary: oklch(0.26 0.018 250);
  --secondary-foreground: oklch(0.96 0.005 90);
  --muted: oklch(0.24 0.014 250);
  --muted-foreground: oklch(0.68 0.012 250);
  --accent: oklch(0.30 0.02 250);
  --accent-foreground: oklch(0.96 0.005 90);
  --destructive: oklch(0.62 0.21 25);
  --destructive-foreground: oklch(0.98 0.005 90);
  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 12%);
  --ring: oklch(0.82 0.14 75);
  --sidebar: oklch(0.18 0.014 250);
  --sidebar-foreground: oklch(0.92 0.005 90);
  --sidebar-primary: oklch(0.82 0.14 75);
  --sidebar-primary-foreground: oklch(0.18 0.014 250);
  --sidebar-accent: oklch(0.26 0.018 250);
  --sidebar-accent-foreground: oklch(0.96 0.005 90);
  --sidebar-border: oklch(1 0 0 / 8%);
  --sidebar-ring: oklch(0.82 0.14 75);
}

.dark {
  --background: oklch(0.16 0.012 250);
  --foreground: oklch(0.96 0.005 90);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
  }
}

project card
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  short_description: string | null;
  cover_image_url: string | null;
};

export function ProjectCard({ p }: { p: ProjectCardData }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-primary/40"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {p.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.cover_image_url}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl text-muted-foreground/30">
            {p.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary/80">
          {p.category}
        </span>
        <h3 className="flex items-start justify-between gap-2 font-display text-xl">
          <span>{p.title}</span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </h3>
        {p.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>
        )}
      </div>
    </Link>
  );
}

project form
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProjectFormValues = {
  id?: string;
  slug: string;
  title: string;
  category: "personal" | "academic" | "professional";
  status: "draft" | "published" | "archived";
  short_description: string;
  long_description: string;
  cover_image_url: string;
  repo_url: string;
  live_url: string;
  start_date: string;
  end_date: string;
  featured: boolean;
  display_order: number;
};

const empty: ProjectFormValues = {
  slug: "",
  title: "",
  category: "personal",
  status: "draft",
  short_description: "",
  long_description: "",
  cover_image_url: "",
  repo_url: "",
  live_url: "",
  start_date: "",
  end_date: "",
  featured: false,
  display_order: 0,
};

export function ProjectForm({ initial }: { initial?: Partial<ProjectFormValues> }) {
  const nav = useNavigate();
  const [v, setV] = useState<ProjectFormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProjectFormValues>(k: K, val: ProjectFormValues[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        slug: v.slug.trim(),
        title: v.title.trim(),
        category: v.category,
        status: v.status,
        short_description: v.short_description || null,
        long_description: v.long_description || null,
        cover_image_url: v.cover_image_url || null,
        repo_url: v.repo_url || null,
        live_url: v.live_url || null,
        start_date: v.start_date || null,
        end_date: v.end_date || null,
        featured: v.featured,
        display_order: Number(v.display_order) || 0,
      };
      if (v.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", v.id);
        if (error) throw error;
        toast.success("Proyecto actualizado");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast.success("Proyecto creado");
      }
      nav({ to: "/admin/projects" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-3xl">{v.id ? "Editar proyecto" : "Nuevo proyecto"}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título" required>
          <Input value={v.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Slug (url)" required>
          <Input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            required
            placeholder="mi-proyecto"
          />
        </Field>
        <Field label="Categoría">
          <Select
            value={v.category}
            onChange={(val) => set("category", val as ProjectFormValues["category"])}
            options={[
              { value: "personal", label: "Personal" },
              { value: "academic", label: "Académico" },
              { value: "professional", label: "Profesional" },
            ]}
          />
        </Field>
        <Field label="Estado">
          <Select
            value={v.status}
            onChange={(val) => set("status", val as ProjectFormValues["status"])}
            options={[
              { value: "draft", label: "Borrador" },
              { value: "published", label: "Publicado" },
              { value: "archived", label: "Archivado" },
            ]}
          />
        </Field>
      </div>

      <Field label="Descripción corta">
        <Textarea
          rows={2}
          value={v.short_description}
          onChange={(e) => set("short_description", e.target.value)}
        />
      </Field>

      <Field label="Descripción larga">
        <Textarea
          rows={8}
          value={v.long_description}
          onChange={(e) => set("long_description", e.target.value)}
        />
      </Field>

      <Field label="URL de imagen de portada">
        <Input
          type="url"
          value={v.cover_image_url}
          onChange={(e) => set("cover_image_url", e.target.value)}
          placeholder="https://…"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Repositorio">
          <Input value={v.repo_url} onChange={(e) => set("repo_url", e.target.value)} />
        </Field>
        <Field label="Demo en vivo">
          <Input value={v.live_url} onChange={(e) => set("live_url", e.target.value)} />
        </Field>
        <Field label="Inicio">
          <Input
            type="date"
            value={v.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />
        </Field>
        <Field label="Fin">
          <Input
            type="date"
            value={v.end_date}
            onChange={(e) => set("end_date", e.target.value)}
          />
        </Field>
        <Field label="Orden">
          <Input
            type="number"
            value={v.display_order}
            onChange={(e) => set("display_order", Number(e.target.value))}
          />
        </Field>
        <Field label="Destacado">
          <label className="mt-2 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={v.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="size-4"
            />
            Mostrar en la portada
          </label>
        </Field>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={() => nav({ to: "/admin/projects" })}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-background">
          {o.label}
        </option>
      ))}
    </select>
  );
}

site footer
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} — Construido con cuidado.</p>
        <p className="font-display italic">Diseño & código.</p>
      </div>
    </footer>
  );
}

site header
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/projects", label: "Proyectos" },
  { to: "/about", label: "Sobre mí" },
  { to: "/contact", label: "Contacto" },
] as const;

export function SiteHeader() {
  const { isAdmin } = useAuth();
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl tracking-tight">
          <span className="text-primary">◆</span> Portafolio
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "text-sm transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
