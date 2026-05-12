import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProjectCard from "@/components/ProjectCard";
import * as publicApi from "@/lib/public-api";
import type { PublicProfile, PublicProject } from "@/types/public";

export default function HomePage() {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([publicApi.fetchProfile(), publicApi.fetchProjects()])
      .then(([p, projs]) => {
        setProfile(p);
        setProjects(projs.filter((proj) => proj.featured).slice(0, 3));
      })
      .catch(() => {
        setProfile(null);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.14_75/0.12),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" /> Disponible para proyectos
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl text-foreground">
              {profile?.headline ??
                "Construyo interfaces web que se sienten bien usar."}
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

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                Selección
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                Trabajo destacado
              </h2>
            </div>
            <Link
              to="/projects"
              className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Ver todos <ArrowRight className="size-4" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Cargando proyectos…
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aún no hay proyectos destacados. Inicia sesión como administrador para
              añadir tu primer proyecto.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
