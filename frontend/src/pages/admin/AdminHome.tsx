import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Star, FileText } from "lucide-react";
import * as adminApi from "@/lib/admin-api";
import type { AdminStats } from "@/lib/admin-api";

export default function AdminHome() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Resumen</h1>
      <p className="mt-2 text-muted-foreground">
        Gestiona tu portafolio desde aqu&iacute;.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Stat
          label="Total proyectos"
          value={stats?.total ?? 0}
          icon={FolderKanban}
        />
        <Stat
          label="Publicados"
          value={stats?.published ?? 0}
          icon={FileText}
        />
        <Stat
          label="Destacados"
          value={stats?.featured ?? 0}
          icon={Star}
        />
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
      <div className="mt-4 font-display text-3xl text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
