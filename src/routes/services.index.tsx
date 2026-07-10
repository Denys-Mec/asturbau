import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getServices } from "@/i18n/services";
import { useLanguage } from "@/i18n/context";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Nuestros servicios — Asturbau Construcción" },
      { name: "description", content: "Lista completa de servicios de Asturbau Construcción: reformas de pisos, casas, oficinas, locales comerciales, proyectos de diseño y trabajos de ingeniería en Asturias." },
      { property: "og:title", content: "Nuestros servicios — Asturbau Construcción" },
      { property: "og:description", content: "Lista completa de áreas de trabajo de Asturbau Construcción en Asturias." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
  errorComponent: ErrorComponent,
});

function ServicesIndex() {
  const { lang, t } = useLanguage();
  const services = getServices(lang);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="section-y">
          <div className="container-x max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("servicesIndex.tag")}</p>
            <h1 className="mt-3 text-4xl md:text-5xl">{t("servicesIndex.title")}</h1>
            <p className="mt-4 text-muted-foreground">
              {t("servicesIndex.text")}
            </p>

            <ul className="mt-10 space-y-4 text-lg">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="inline-flex items-center gap-2 text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
