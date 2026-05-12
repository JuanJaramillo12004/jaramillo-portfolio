import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { PublicProject } from "@/types/public";

type Props = {
  project: PublicProject;
};

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-primary/40"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl text-muted-foreground/30">
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {project.category && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-primary/80">
            {project.category}
          </span>
        )}
        <h3 className="flex items-start justify-between gap-2 font-display text-xl">
          <span>{project.title}</span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </h3>
        {project.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.short_description}
          </p>
        )}
      </div>
    </Link>
  );
}
