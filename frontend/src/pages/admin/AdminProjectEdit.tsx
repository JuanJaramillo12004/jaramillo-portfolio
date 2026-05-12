import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import * as adminApi from "@/lib/admin-api";
import type { PublicProject } from "@/types/public";

export default function AdminProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminApi.fetchAdminProject(id)
      .then(setProject)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-muted-foreground">Cargando…</div>;
  if (!project) return <div className="text-muted-foreground">Proyecto no encontrado.</div>;

  return (
    <ProjectForm
      initial={{
        id: project.id,
        slug: project.slug,
        title: project.title,
        category: project.category ?? "personal",
        status: project.status,
        short_description: project.short_description ?? "",
        long_description: project.long_description ?? "",
        cover_image_url: project.cover_image_url ?? "",
        repo_url: project.repo_url ?? "",
        live_url: project.live_url ?? "",
        start_date: project.start_date ?? "",
        end_date: project.end_date ?? "",
        featured: project.featured,
        display_order: project.display_order,
      }}
    />
  );
}
