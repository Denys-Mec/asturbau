import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Phone, Images, Inbox, Home, Bell, Briefcase, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const checkAdmin = useServerFn(checkIsAdmin);
  const { data, isLoading } = useQuery({ queryKey: ["is_admin"], queryFn: () => checkAdmin() });
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
    router.invalidate();
  }

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Завантаження...</div>;
  }

  if (!data?.isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl">Доступ заборонено</h1>
          <p className="mt-2 text-muted-foreground">У вашого облікового запису немає ролі admin. Зверніться до власника сайту.</p>
          <Button className="mt-6" onClick={signOut}>Вийти</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="container-x h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display text-xl tracking-wide">ASTURBAU · Admin</Link>
            <nav className="hidden md:flex items-center gap-1">
              <AdminLink to="/admin" icon={<Inbox className="h-4 w-4" />}>Заявки</AdminLink>
              <AdminLink to="/admin/content" icon={<FileText className="h-4 w-4" />}>Головна</AdminLink>
              <AdminLink to="/admin/services" icon={<Briefcase className="h-4 w-4" />}>Послуги</AdminLink>
              <AdminLink to="/admin/contacts" icon={<Phone className="h-4 w-4" />}>Контакти</AdminLink>
              <AdminLink to="/admin/testimonials" icon={<MessageSquare className="h-4 w-4" />}>Відгуки</AdminLink>
              <AdminLink to="/admin/gallery" icon={<Images className="h-4 w-4" />}>Галерея</AdminLink>
              <AdminLink to="/admin/notifications" icon={<Bell className="h-4 w-4" />}>Сповіщення</AdminLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/"><Home className="h-4 w-4 mr-1" /> Сайт</Link></Button>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1" /> Вийти</Button>
          </div>
        </div>
        <nav className="md:hidden border-t border-border container-x py-2 flex gap-1 overflow-x-auto">
          <AdminLink to="/admin">Заявки</AdminLink>
          <AdminLink to="/admin/content">Головна</AdminLink>
          <AdminLink to="/admin/services">Послуги</AdminLink>
          <AdminLink to="/admin/contacts">Контакти</AdminLink>
          <AdminLink to="/admin/testimonials">Відгуки</AdminLink>
          <AdminLink to="/admin/gallery">Галерея</AdminLink>
          <AdminLink to="/admin/notifications">Сповіщення</AdminLink>
        </nav>
      </header>
      <main className="container-x py-8">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLink({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/admin" }}
      activeProps={{ className: "bg-accent text-accent-foreground" }}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-foreground/80 hover:bg-muted whitespace-nowrap"
    >
      {icon}{children}
    </Link>
  );
}
