import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/i18n/context";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Сторінку не знайдено.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">На головну</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Сталася помилка</h1>
        <p className="mt-2 text-sm text-muted-foreground">Спробуйте оновити сторінку.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
        >Спробувати знову</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Asturbau Construcción — Будівництво та ремонт під ключ в Астурії" },
      { name: "description", content: "Asturbau Construcción — професійний ремонт квартир, будинків, офісів та комерційних обʼєктів в Астурії. Робота під ключ, прозорий кошторис, дотримання термінів." },
      { property: "og:site_name", content: "Asturbau Construcción" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#2d2d2d" },
      { property: "og:title", content: "Asturbau Construcción — Будівництво та ремонт під ключ в Астурії" },
      { name: "twitter:title", content: "Asturbau Construcción — Будівництво та ремонт під ключ в Астурії" },
      { property: "og:description", content: "Asturbau Construcción — професійний ремонт квартир, будинків, офісів та комерційних обʼєктів в Астурії. Робота під ключ, прозорий кошторис, дотримання термінів." },
      { name: "twitter:description", content: "Asturbau Construcción — професійний ремонт квартир, будинків, офісів та комерційних обʼєктів в Астурії. Робота під ключ, прозорий кошторис, дотримання термінів." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/36fe45e2-216a-4e48-8d02-90a55367a4c3/id-preview-e41b90ce--749a0d9e-8187-45c8-91f0-2db4755cde07.lovable.app-1782187432426.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/36fe45e2-216a-4e48-8d02-90a55367a4c3/id-preview-e41b90ce--749a0d9e-8187-45c8-91f0-2db4755cde07.lovable.app-1782187432426.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GeneralContractor",
        "name": "Asturbau Construcción",
        "description": "Будівельно-ремонтна компанія в Астурії",
        "telephone": "+34 643 329 216",
        "areaServed": "Asturias, Spain"
      }) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Outlet />
        <Toaster richColors position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );

}
