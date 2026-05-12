export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <p>&copy; {new Date().getFullYear()} &mdash; Construido con cuidado.</p>
        <p className="font-display italic">Dise&ntilde;o &amp; c&oacute;digo.</p>
      </div>
    </footer>
  );
}
