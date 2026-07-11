import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { siteContentQuery } from "@/lib/content.functions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeadForm } from "@/components/LeadForm";
import { useLanguage } from "@/i18n/context";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/contacts")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
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
  const { data } = useSuspenseQuery(siteContentQuery);
  const { t, lang } = useLanguage();
  const globalContacts = data.contacts ?? {};
  
  const c = (() => {
    let resolved = (globalContacts[lang] ?? globalContacts.es ?? globalContacts) ?? {};
    
    if (lang === "es") {
      const needsEsFallback = !globalContacts.es || resolved.address === "Астурія, Іспанія" || resolved.hours?.includes("Пн");
      if (needsEsFallback) {
        resolved = {
          ...resolved,
          company: resolved.company || "Asturbau Construcción",
          address: "Asturias, España",
          hours: resolved.hours === "Пн–Сб: 9:00 – 19:00" || !resolved.hours ? "Lun - Sáb: 9:00 - 19:00" : resolved.hours,
          tagline: resolved.tagline === "Звʼяжіться з нами — підготуємо безкоштовний кошторис" || !resolved.tagline
            ? "Contáctenos — prepararemos un presupuesto gratuito"
            : resolved.tagline
        };
      }
    } else {
      const needsUkFallback = !globalContacts.uk || !resolved.address;
      if (needsUkFallback) {
        resolved = {
          ...resolved,
          company: resolved.company || "Asturbau Construcción",
          address: "Астурія, Іспанія",
          hours: resolved.hours || "Пн–Сб: 9:00 – 19:00",
          tagline: resolved.tagline || "Звʼяжіться з нами — підготуємо безкоштовний кошторис"
        };
      }
    }
    return resolved;
  })();

  const phone = globalContacts.phone || c.phone || "+34 643 329 216";
  const email = globalContacts.email || c.email || "info@asturbau.com";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader phone={phone} />
      
      {/* HERO SECTION WITH Abstract Rings (Image 1 style) */}
      <section className="hero-gradient text-primary-foreground relative overflow-hidden">
        {/* Abstract vector line design matching mockups */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="absolute -right-20 -top-20 w-80 h-80 text-accent/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="50" strokeDasharray="4 2" />
          </svg>
          <svg className="absolute -left-20 -bottom-20 w-96 h-96 text-accent/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="50" ry="25" transform="rotate(-30 50 50)" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="container-x py-24 md:py-36 relative z-10 animate-reveal-up text-center max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("contacts.tag")}</p>
          <h1 className="mt-4 text-5xl md:text-7xl font-display leading-[0.95]">{t("contacts.title")}</h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-white/75 leading-relaxed">{c.tagline}</p>
        </div>
      </section>

      {/* 3-COLUMN CONTACT CARDS (Image 1 style) */}
      <section className="py-12 bg-background -mt-12 relative z-20">
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal delay={0}>
            <div className="bg-[#181818] text-white p-8 rounded-2xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_40px_rgba(220,100,50,0.15)] hover:border-accent/30 transition-all duration-300 flex flex-col items-center text-center group h-full">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white/90">{t("contacts.label.phone")}</h3>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="mt-3 text-lg font-medium text-white/70 hover:text-accent transition-colors">
                {phone}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="bg-[#181818] text-white p-8 rounded-2xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_40px_rgba(220,100,50,0.15)] hover:border-accent/30 transition-all duration-300 flex flex-col items-center text-center group h-full">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white/90">{t("contacts.label.email")}</h3>
              <a href={`mailto:${email}`} className="mt-3 text-lg font-medium text-white/70 hover:text-accent transition-colors break-all">
                {email}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-[#181818] text-white p-8 rounded-2xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_40px_rgba(220,100,50,0.15)] hover:border-accent/30 transition-all duration-300 flex flex-col items-center text-center group h-full">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white/90">{t("contacts.label.hours")}</h3>
              <p className="mt-3 text-lg font-medium text-white/70">
                {c.hours || "Lun - Vie: 9:00 - 18:00"}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2-COLUMN DETAIL SECTION (Image 2 style) */}
      <section className="section-y bg-background pt-8 pb-16">
        <div className="container-x grid md:grid-cols-2 gap-12 items-start">
          <ScrollReveal>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("contacts.infoTag")}</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-display leading-[0.95]">{t("contacts.infoTitle")}</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {t("contacts.infoDesc")}
              </p>

              {/* 2x2 Grid of details */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t("contacts.whoTitle")}</h4>
                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{t("contacts.whoText")}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t("contacts.socialTag")}</h4>
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:underline decoration-accent/40 hover:decoration-accent transition-colors font-medium"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                    <a
                      href="https://t.me/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:underline decoration-accent/40 hover:decoration-accent transition-colors font-medium"
                    >
                      <Send className="h-4 w-4" /> Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form wrapper with premium soft card styling (Image 2 style) */}
          <ScrollReveal delay={150} animation="reveal-in">
            <div className="bg-card border border-border p-5 md:p-10 rounded-2xl shadow-elegant relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -mr-5 -mt-5" />
              <h2 className="text-3xl font-display uppercase tracking-wider">{t("contacts.formTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("contacts.formSub")}</p>
              <div className="mt-8"><LeadForm source="contacts" /></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SiteFooter phone={phone} email={email} />
    </div>
  );
}
