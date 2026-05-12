import { useState, useEffect } from "react";
import { Mail, Globe } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import * as publicApi from "@/lib/public-api";
import type { PublicProfile } from "@/types/public";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Globe,
};

export default function ContactPage() {
  const [profile, setProfile] = useState<PublicProfile | null>(null);

  useEffect(() => {
    publicApi.fetchProfile().then(setProfile).catch(() => {});
  }, []);

  const social = (profile?.social_links ?? {}) as Record<string, string>;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
          Contacto
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground">
          Hablemos.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Si tienes un proyecto, una idea o simplemente quieres saludar,
          escr&iacute;beme.
        </p>

        {profile?.email_public && (
          <a
            href={`mailto:${profile.email_public}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground"
          >
            <Mail className="size-5" /> {profile.email_public}
          </a>
        )}

        {Object.keys(social).length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Tambi&eacute;n estoy en
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = iconMap[key.toLowerCase()] ?? Globe;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm capitalize hover:border-primary/40"
                  >
                    <Icon className="size-4" /> {key}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
