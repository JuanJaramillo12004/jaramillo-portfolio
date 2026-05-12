import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as adminApi from "@/lib/admin-api";

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

export default function AdminProfile() {
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
    adminApi.fetchProfile().then((p) => {
      setV({
        full_name: p.full_name ?? "",
        headline: p.headline ?? "",
        bio: p.bio ?? "",
        avatar_url: p.avatar_url ?? "",
        location: p.location ?? "",
        email_public: p.email_public ?? "",
        resume_url: p.resume_url ?? "",
        social_links: JSON.stringify(p.social_links ?? {}, null, 2),
      });
    }).catch(() => {});
  }, []);

  function set<K extends keyof ProfileForm>(k: K, val: ProfileForm[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let social: Record<string, string> = {};
      try {
        social = JSON.parse(v.social_links || "{}");
      } catch {
        throw new Error("JSON de redes sociales inv\u00e1lido");
      }
      await adminApi.updateProfile({
        full_name: v.full_name || null,
        headline: v.headline || null,
        bio: v.bio || null,
        avatar_url: v.avatar_url || null,
        location: v.location || null,
        email_public: v.email_public || null,
        resume_url: v.resume_url || null,
        social_links: social,
      });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="font-display text-3xl text-foreground">Perfil p\u00fablico</h1>
      <p className="text-sm text-muted-foreground">
        Esta informaci\u00f3n aparece en el inicio, sobre m\u00ed y contacto.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre">
          <Input value={v.full_name} onChange={(e) => set("full_name", e.target.value)} />
        </Field>
        <Field label="Ubicaci\u00f3n">
          <Input value={v.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Email p\u00fablico">
          <Input type="email" value={v.email_public} onChange={(e) => set("email_public", e.target.value)} />
        </Field>
        <Field label="URL del CV">
          <Input value={v.resume_url} onChange={(e) => set("resume_url", e.target.value)} />
        </Field>
      </div>

      <Field label="Headline (titular del hero)">
        <Input value={v.headline} onChange={(e) => set("headline", e.target.value)} />
      </Field>

      <Field label="Bio">
        <Textarea rows={6} value={v.bio} onChange={(e) => set("bio", e.target.value)} />
      </Field>

      <Field label="URL del avatar">
        <Input value={v.avatar_url} onChange={(e) => set("avatar_url", e.target.value)} />
      </Field>

      <Field label='Redes sociales (JSON, p.ej. {"github":"https://\u2026","linkedin":"https://\u2026"})'>
        <Textarea
          rows={6}
          className="font-mono text-xs"
          value={v.social_links}
          onChange={(e) => set("social_links", e.target.value)}
        />
      </Field>

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando\u2026" : "Guardar perfil"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
