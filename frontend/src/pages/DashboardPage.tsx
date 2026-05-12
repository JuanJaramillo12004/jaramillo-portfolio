import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-8 rounded-lg border border-border p-4">
        <h2 className="text-lg font-medium text-foreground">Perfil</h2>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            Email: <span className="text-foreground">{user?.email}</span>
          </p>
          <p>
            Rol: <span className="text-foreground">{user?.role}</span>
          </p>
          <p>
            ID: <span className="text-foreground">{user?.id}</span>
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Aquí irá el panel de administración de proyectos.
      </p>
    </div>
  );
}
