import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProjectCard from "@/components/ProjectCard";
import * as publicApi from "@/lib/public-api";
import type { PublicProject } from "@/types/public";

const filters = [
  { value: "all", label: "Todos" },
  { value: "personal", label: "Personales" },
  { value: "academic", label: "Acad\u00e9micos" },
  { value: "professional", label: "Profesionales" },
] as const;

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .fetchProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <header className="mb-12">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
            Archivo
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            Proyectos
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Todos los proyectos publicados, organizados por categor&iacute;a.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-muted-foreground">Cargando…</div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay proyectos en esta categor&iacute;a todav&iacute;a.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
