import { useState, useEffect } from "react";
import { MapPin, Mail, FileDown } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import * as publicApi from "@/lib/public-api";
import type { PublicProfile, PublicExperience } from "@/types/public";

function formatRange(
  start: string | null,
  end: string | null,
  current: boolean,
) {
  const f = (d: string) =>
    new Date(d).toLocaleDateString("es", {
      month: "short",
      year: "numeric",
    });
  if (!start) return current ? "Actual" : "";
  return `${f(start)} — ${current ? "Actual" : end ? f(end) : ""}`;
}

export default function AboutPage() {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [experiences, setExperiences] = useState<PublicExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([publicApi.fetchProfile(), publicApi.fetchExperiences()])
      .then(([p, ex]) => {
        setProfile(p);
        setExperiences(ex);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <header className="mb-16">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
            Bio
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            {profile?.full_name ?? "Sobre mí"}
          </h1>
          {profile?.headline && (
            <p className="mt-4 text-xl text-muted-foreground">
              {profile.headline}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile?.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {profile.location}
              </span>
            )}
            {profile?.email_public && (
              <a
                href={`mailto:${profile.email_public}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="size-4" /> {profile.email_public}
              </a>
            )}
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <FileDown className="size-4" /> CV
              </a>
            )}
          </div>
        </header>

        {profile?.bio && (
          <section className="mb-20 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
            {profile.bio}
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 className="mb-8 font-display text-3xl text-foreground">
              Trayectoria
            </h2>
            <ol className="relative space-y-10 border-l border-border pl-6">
              {experiences.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[31px] top-2 size-3 rounded-full border-2 border-primary bg-background" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-foreground">
                      {e.role}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {formatRange(e.start_date, e.end_date, e.is_current)}
                    </span>
                  </div>
                  <p className="text-sm text-primary/90">
                    {e.organization}
                    {e.location ? ` \u00B7 ${e.location}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-2 text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
