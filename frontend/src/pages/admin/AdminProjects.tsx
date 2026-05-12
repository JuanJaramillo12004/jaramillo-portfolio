import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as adminApi from "@/lib/admin-api";
import type { PublicProject } from "@/types/public";

export default function AdminProjects() {
  const [projects, setProjects] = useState<PublicProject[]>([]);

  function load() {
    adminApi.fetchAdminProjects().then(setProjects).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("\u00BFEliminar este proyecto?")) return;
    try {
      await adminApi.deleteProject(id);
      toast.success("Proyecto eliminado");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Proyectos</h1>
          <p className="text-sm text-muted-foreground">
            Crea, edita y publica tus proyectos.
          </p>
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
              <TableHead>T\u00edtulo</TableHead>
              <TableHead>Categor\u00eda</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    {p.title}
                    {p.featured && <span className="ml-2 text-primary">\u2605</span>}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {p.category}
                  </TableCell>
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
                      <Link to={`/admin/projects/${p.id}`}>
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
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
                >
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
