import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import * as publicApi from "@/lib/public-api";
import type { PublicProject } from "@/types/public";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    publicApi
      .fetchProjectBySlug(slug)
      .then(setProject)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

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

        {loading ? (
          <div className="text-muted-foreground">Cargando…</div>
        ) : !project ? (
          <div className="text-muted-foreground">Proyecto no encontrado.</div>
        ) : (
          <article>
            {project.category && (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">
                {project.category}
              </p>
            )}
            <h1 className="font-display text-4xl md:text-6xl text-foreground">
              {project.title}
            </h1>
            {project.short_description && (
              <p className="mt-6 text-xl text-muted-foreground">
                {project.short_description}
              </p>
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
                  <GitBranch className="size-4" /> C&oacute;digo
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

            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Tecnolog&iacute;as
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t.id}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.long_description && (
              <div className="mt-12 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
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
