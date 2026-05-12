import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as adminApi from "@/lib/admin-api";

export type ProjectFormValues = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  status: string;
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

export default function ProjectForm({ initial }: { initial?: Partial<ProjectFormValues> }) {
  const navigate = useNavigate();
  const [v, setV] = useState<ProjectFormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProjectFormValues>(k: K, val: ProjectFormValues[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: v.title.trim(),
        slug: v.slug.trim() || undefined,
        category: v.category || undefined,
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
        await adminApi.updateProject(v.id, payload);
        toast.success("Proyecto actualizado");
      } else {
        await adminApi.createProject(payload);
        toast.success("Proyecto creado");
      }
      navigate("/admin/projects");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-3xl text-foreground">
        {v.id ? "Editar proyecto" : "Nuevo proyecto"}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="T\u00edtulo" required>
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
        <Field label="Categor\u00eda">
          <select
            value={v.category}
            onChange={(e) => set("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="personal">Personal</option>
            <option value="academic">Acad\u00e9mico</option>
            <option value="professional">Profesional</option>
          </select>
        </Field>
        <Field label="Estado">
          <select
            value={v.status}
            onChange={(e) => set("status", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </Field>
      </div>

      <Field label="Descripci\u00f3n corta">
        <Textarea rows={2} value={v.short_description} onChange={(e) => set("short_description", e.target.value)} />
      </Field>

      <Field label="Descripci\u00f3n larga">
        <Textarea rows={8} value={v.long_description} onChange={(e) => set("long_description", e.target.value)} />
      </Field>

      <Field label="URL de imagen de portada">
        <Input type="url" value={v.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} placeholder="https://\u2026" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Repositorio">
          <Input value={v.repo_url} onChange={(e) => set("repo_url", e.target.value)} />
        </Field>
        <Field label="Demo en vivo">
          <Input value={v.live_url} onChange={(e) => set("live_url", e.target.value)} />
        </Field>
        <Field label="Inicio">
          <Input type="date" value={v.start_date} onChange={(e) => set("start_date", e.target.value)} />
        </Field>
        <Field label="Fin">
          <Input type="date" value={v.end_date} onChange={(e) => set("end_date", e.target.value)} />
        </Field>
        <Field label="Orden">
          <Input type="number" value={v.display_order} onChange={(e) => set("display_order", Number(e.target.value))} />
        </Field>
        <Field label="Destacado">
          <label className="mt-2 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4" />
            Mostrar en la portada
          </label>
        </Field>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando\u2026" : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
