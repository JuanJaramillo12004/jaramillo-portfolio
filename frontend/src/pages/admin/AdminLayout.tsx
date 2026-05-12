import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, UserIcon, LogOut, Home, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Proyectos", icon: FolderKanban, exact: false },
  { to: "/admin/experiences", label: "Experiencia", icon: Briefcase, exact: false },
  { to: "/admin/profile", label: "Perfil", icon: UserIcon, exact: false },
] as const;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(to: string, exact: boolean) {
    if (exact) return path === to;
    return path.startsWith(to);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-6 md:flex">
        <Link to="/" className="mb-10 font-display text-xl text-foreground">
          <span className="text-primary">&#9670;</span> Admin
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(it.to, it.exact)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <it.icon className="size-4" />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-border pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <Home className="size-4" /> Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <LogOut className="size-4" /> Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <div className="mb-6 text-sm text-muted-foreground">
            {user?.email}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
