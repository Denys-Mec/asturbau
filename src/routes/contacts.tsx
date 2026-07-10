import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Phone, Mail, Clock } from "lucide-react";
import { getSiteContent } from "@/lib/content.functions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeadForm } from "@/components/LeadForm";
import { useLanguage } from "@/i18n/context";

const contentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: () => getSiteContent(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/contacts")({
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  head: () => ({
    meta: [
      { title: "Contacto — Asturbau Construcción" },
      { name: "description", content: "Teléfono, email y dirección de Asturbau Construcción en Asturias. Envíenos una solicitud — prepararemos un presupuesto gratuito." },
      { property: "og:title", content: "Contacto — Asturbau Construcción" },
      { property: "og:description", content: "Contáctenos para un presupuesto gratuito." },
      { property: "og:url", content: "/contacts" },
    ],
    links: [{ rel: "canonical", href: "/contacts" }],
  }),
  component: ContactsPage,
  errorComponent: ErrorComponent,
});

function ContactsPage() {
  const { data } = useSuspenseQuery(contentQuery);
  const { t } = useLanguage();
  const c = data.contacts ?? {};

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader phone={c.phone} />
      <section className="hero-gradient text-primary-foreground">
        <div className="container-x py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("contacts.tag")}</p>
          <h1 className="mt-3 text-5xl md:text-6xl">{t("contacts.title")}</h1>
          <p className="mt-4 max-w-xl text-white/75">{c.tagline}</p>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-x grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl">{t("contacts.dataTitle")}</h2>
            <div className="mt-8 space-y-5">
              <Row icon={<Phone className="h-5 w-5" />} label={t("contacts.label.phone")} value={c.phone} href={`tel:${(c.phone || "").replace(/\s/g, "")}`} />
              <Row icon={<Mail className="h-5 w-5" />} label={t("contacts.label.email")} value={c.email} href={`mailto:${c.email}`} />

              <Row icon={<Clock className="h-5 w-5" />} label={t("contacts.label.hours")} value={c.hours} />
            </div>
            <div className="mt-10 p-6 bg-secondary border-l-4 border-accent">
              <h3 className="text-lg">{t("contacts.whoTitle")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("contacts.whoText")}
              </p>
            </div>
          </div>
          <div className="bg-card border border-border p-6 md:p-8 rounded-lg shadow-elegant">
            <h2 className="text-2xl">{t("contacts.formTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("contacts.formSub")}</p>
            <div className="mt-6"><LeadForm source="contacts" /></div>
          </div>
        </div>
      </section>

      <SiteFooter phone={c.phone} email={c.email} />
    </div>
  );
}

function Row({ icon, label, value, href }: { icon: React.ReactNode; label: string; value?: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 grid place-items-center bg-accent/10 text-accent shrink-0">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {href ? <a href={href} className="text-lg font-medium hover:text-accent">{value}</a> : <div className="text-lg font-medium">{value}</div>}
      </div>
    </div>
  );
}
