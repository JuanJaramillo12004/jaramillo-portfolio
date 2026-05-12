import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email, password });
        toast.success("Bienvenido");
        navigate("/dashboard");
      } else {
        await register({ email, password });
        toast.success("Cuenta creada");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Inicio
        </Link>

        <h1 className="font-display text-4xl">
          {mode === "login" ? "Acceso admin" : "Crear cuenta"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Ingresa para gestionar tu portafolio."
            : "Crea tu cuenta de administrador."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1.5"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "¿No tienes cuenta? Crear una" : "Ya tengo cuenta"}
        </button>
      </div>
    </div>
  );
}
