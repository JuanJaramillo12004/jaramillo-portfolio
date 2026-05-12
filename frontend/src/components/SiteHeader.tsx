import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/projects", label: "Proyectos" },
  { to: "/about", label: "Sobre mí" },
  { to: "/contact", label: "Contacto" },
];

function setTheme(theme: string) {
  localStorage.setItem("theme", theme);
  document.documentElement.className = theme;
}

export default function SiteHeader() {
  const { user } = useAuth();
  const path = useLocation().pathname;
  const isAdmin = !!user && user.role === "admin";

  const [theme, setThemeState] = useState(
    () => localStorage.getItem("theme") ?? "dark",
  );

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  function isActive(to: string) {
    if (to === "/") return path === "/";
    return path.startsWith(to);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl tracking-tight text-foreground">
          <span className="text-primary">&#9670;</span> Portafolio
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm transition-colors ${
                isActive(n.to)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
          {isAdmin && (
            <Link
              to="/dashboard"
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
