import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import type { PublicExperience } from "@/types/public";

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<PublicExperience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "",
    organization: "",
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    display_order: 0,
  });

  function load() {
    adminApi.fetchAdminExperiences().then(setExperiences).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({
      role: "",
      organization: "",
      location: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      display_order: 0,
    });
    setEditingId(null);
  }

  function edit(e: PublicExperience) {
    setEditingId(e.id);
    setForm({
      role: e.role,
      organization: e.organization,
      location: e.location ?? "",
      description: e.description ?? "",
      start_date: e.start_date ?? "",
      end_date: e.end_date ?? "",
      is_current: e.is_current,
      display_order: e.display_order,
    });
  }

  async function save() {
    try {
      const payload = {
        role: form.role,
        organization: form.organization,
        location: form.location || null,
        description: form.description || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_current: form.is_current,
        display_order: Number(form.display_order) || 0,
      };

      if (editingId) {
        await adminApi.updateExperience(editingId, payload);
        toast.success("Experiencia actualizada");
      } else {
        await adminApi.createExperience(payload);
        toast.success("Experiencia creada");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function remove(id: string) {
    if (!confirm("\u00BFEliminar esta experiencia?")) return;
    try {
      await adminApi.deleteExperience(id);
      toast.success("Experiencia eliminada");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            Experiencia
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu trayectoria profesional y acad\u00e9mica.
          </p>
        </div>
      </div>

      <div className="mt-8 mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg text-foreground mb-4">
          {editingId ? "Editar experiencia" : "Nueva experiencia"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Cargo <span className="text-destructive">*</span>
            </label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Organizaci\u00f3n <span className="text-destructive">*</span>
            </label>
            <input
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Ubicaci\u00f3n
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Orden
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <label className="flex items-center gap-2 pb-1 text-sm">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(e) =>
                  setForm({ ...form, is_current: e.target.checked })
                }
                className="size-4"
              />
              Actual
            </label>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Inicio
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Fin
            </label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              disabled={form.is_current}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Descripci\u00f3n
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={save}>
            {editingId ? "Actualizar" : "Agregar"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cargo</TableHead>
              <TableHead>Organizaci\u00f3n</TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.length > 0 ? (
              experiences.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-foreground">
                    {e.role}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.organization}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.start_date ?? ""}{e.start_date && e.end_date ? " — " : ""}{e.end_date ?? ""}
                    {e.is_current ? "Actual" : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => edit(e)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(e.id)}
                    >
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
                  No hay experiencias. Agrega la primera.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
