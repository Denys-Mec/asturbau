import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Вхід — Asturbau" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Вхід виконано");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <div className="font-display text-3xl tracking-wide">ASTURBAU</div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Адмін-панель</div>
        </Link>
        <form onSubmit={onSubmit} className="bg-card p-8 border border-border rounded-lg shadow-elegant grid gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" className="mt-1" />
          </div>
          <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? "Вхід..." : "Увійти"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Реєстрація відключена. Облікові записи створює власник.
          </p>
        </form>
      </div>
    </div>
  );
}
