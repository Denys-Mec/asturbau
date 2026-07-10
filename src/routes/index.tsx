import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import {
  ArrowRight, Home, Building2, Layers, Flame,
  Phone, Star, MessageCircle, Send,
} from "lucide-react";
import { getSiteContent, getGallery } from "@/lib/content.functions";
import { getServices } from "@/i18n/services";
import { useLanguage } from "@/i18n/context";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/hero-construction.jpg";
import collageBathroom from "@/assets/collage-bathroom.jpg";
import collageKitchen from "@/assets/collage-kitchen.jpg";
import collageLiving from "@/assets/collage-living.jpg";
import svcApartment from "@/assets/svc-apartment.jpg";
import svcDrywall from "@/assets/svc-drywall.jpg";
import svcRestaurant from "@/assets/svc-restaurant.jpg";
import svcHeating from "@/assets/svc-heating.jpg";

// Images matched to services in DB order
const SERVICE_IMAGES = [svcApartment, svcRestaurant, svcDrywall, svcHeating];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const contentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: () => getSiteContent(),
  staleTime: 60_000,
});
const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(contentQuery),
      context.queryClient.ensureQueryData(galleryQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Asturbau Construcción — Reformas llave en mano y construcción en Asturias | Gijón, Oviedo, Avilés" },
      { name: "description", content: "Reforma integral de pisos, casas, oficinas y locales comerciales en Asturias llave en mano. Más de 10 años de experiencia, equipo propio de especialistas, presupuesto transparente, garantía de calidad. Gijón, Oviedo, Avilés." },
      { name: "keywords", content: "reformas Asturias, reformas llave en mano Gijón, construcción Oviedo, reformas integrales Asturias, reformas Gijón, reformas Oviedo, reformas Avilés, reforma de pisos, reforma de obra nueva, reforma de casas, reforma de oficinas, reforma de chalets, reforma de adosados, reforma de viviendas de segunda mano, reforma de local comercial, reforma cosmética, reforma integral, reforma premium, cambio de distribución, proyecto de diseño, fontanería, electricidad, calefacción, alicatado, carpintería, pintura, pladur, Asturbau Construcción" },
      { property: "og:title", content: "Asturbau Construcción — Reformas llave en mano en Asturias" },
      { property: "og:description", content: "Reforma integral y construcción en Gijón, Oviedo y Avilés. Más de 10 años de experiencia, presupuesto transparente, cumplimiento de plazos." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
  errorComponent: ErrorComponent,
});

// Icons matched to services in DB order
const ICONS = [Home, Building2, Layers, Flame];

const DEFAULT_TESTIMONIALS = [
  { name: "Marta G.", text: "El equipo terminó la reforma del piso a tiempo y con una calidad impecable. ¡Gracias por su profesionalidad!", rating: 5 },
  { name: "Carlos R.", text: "La reconstrucción del restaurante se hizo sin sobresaltos. Presupuesto transparente, trabajo cuidadoso — recomiendo.", rating: 5 },
  { name: "Olena P.", text: "Honestidad y responsabilidad — así es Asturbau. Volveremos a trabajar juntos.", rating: 5 },
];

function HomePage() {
  const { lang, t } = useLanguage();
  const { data } = useSuspenseQuery(contentQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const SERVICE_DEFS = getServices(lang);
  const h = data.home ?? {};
  const c = data.contacts ?? {};
  const services: Array<{ title: string; desc: string }> = h.services ?? [];

  const process: Array<{ step: string; title: string; desc: string }> = h.process ?? [];
  const testimonials: Array<{ name: string; text: string; rating?: number }> =
    h.testimonials ?? DEFAULT_TESTIMONIALS;
  const galleryList = (gallery ?? []) as Array<any>;
  const featured = galleryList.filter((g) => g.featured_on_home);
  const portfolio = (featured.length > 0 ? featured : galleryList)
    .slice()
    .sort((a, b) => {
      if (a.featured_on_home && b.featured_on_home) {
        return (a.home_sort_order ?? 0) - (b.home_sort_order ?? 0);
      }
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const phone = c.phone || "+34 643 329 216";
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  const TRUST = [
    { n: t("trust.item1.n"), l: t("trust.item1.l") },
    { n: t("trust.item2.n"), l: t("trust.item2.l") },
    { n: t("trust.item3.n"), l: t("trust.item3.l") },
    { n: t("trust.item4.n"), l: t("trust.item4.l") },
  ];

  const FAQ = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader phone={phone} />

      {/* HERO */}
      <section className="hero-gradient text-primary-foreground relative overflow-hidden">
        <img
          src={heroImage}
          alt="Asturbau — construcción en Asturias"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />
        <div className="container-x relative py-24 md:py-36 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t("hero.badge")}
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl leading-[0.95]">
              {h.hero_title || t("hero.title.default")}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#lead-form">{h.hero_cta || t("hero.cta.default")} <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link to="/gallery">{t("hero.cta.gallery")}</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat n={t("hero.stat1.n")} l={t("hero.stat1.l")} />
              <Stat n={t("hero.stat2.n")} l={t("hero.stat2.l")} />
              <Stat n={t("hero.stat3.n")} l={t("hero.stat3.l")} />
            </div>
          </div>
        </div>
      </section>


      {/* ABOUT */}
      <section className="section-y bg-background">
        <div className="container-x grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("about.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("about.title")}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {t("about.p1")}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("about.p2")}&nbsp;
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("about.p3")}
            </p>

          </div>
          <div className="md:col-span-6">
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-[58%] aspect-[4/3] overflow-hidden border border-border shadow-lg">
                <img src={collageBathroom} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute top-[18%] right-0 w-[48%] aspect-[3/4] overflow-hidden border border-border shadow-xl">
                <img src={collageKitchen} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-[12%] w-[62%] aspect-[4/3] overflow-hidden border border-border shadow-lg">
                <img src={collageLiving} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-y bg-secondary">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("services.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("services.title")}</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-4">
            {services.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              const img = SERVICE_IMAGES[i % SERVICE_IMAGES.length];
              const smSpans = ["sm:col-span-4", "sm:col-span-2", "sm:col-span-2", "sm:col-span-4", "sm:col-span-4", "sm:col-span-2"];
              const span = smSpans[i % smSpans.length];
              return (
                <Link
                  key={s.title}
                  id={`service-${i}`}
                  to="/services/$slug"
                  params={{ slug: SERVICE_DEFS[i % SERVICE_DEFS.length].slug }}
                  className={`group relative overflow-hidden bg-card border border-border hover:border-accent transition-colors min-h-[360px] md:min-h-[420px] isolate flex flex-col justify-end scroll-mt-20 ${span}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center -z-10"
                    style={{ backgroundImage: `url(${img})` }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15 -z-10"
                    aria-hidden
                  />
                  <div className="absolute top-6 left-6">
                    <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                  </div>
                  <div className="relative p-6 md:p-8">
                    <h3 className="text-xl text-white [text-shadow:0_2px_8px_rgb(0_0_0_/_0.6)]">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/85 [text-shadow:0_1px_6px_rgb(0_0_0_/_0.7)]">{s.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-accent text-sm font-medium">
                      {t("services.more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">{t("services.all")} <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>


      {/* PROCESS */}
      <section className="section-y bg-background">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("process.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("process.title")}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {process.map((p, i) => {
              const isLast = i === process.length - 1;
              const hideSm = (i + 1) % 2 === 0 || isLast;
              const hideLg = (i + 1) % 4 === 0 || isLast;
              return (
                <div key={p.step} className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-accent text-accent flex items-center justify-center text-[11px] font-semibold tracking-wider">
                      {p.step}
                    </div>
                    <div
                      className={`hidden flex-1 border-t border-dashed border-accent/40 ${hideSm ? "" : "sm:block"} ${hideLg ? "lg:hidden" : "lg:block"}`}
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      {portfolio.length > 0 && (
        <section className="section-y bg-secondary">
          <div className="container-x">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("portfolio.tag")}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{t("portfolio.title")}</h2>
            </div>
            <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              <div className="flex gap-3 sm:gap-2 pb-2">
                {portfolio.map((item, idx) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative block w-[78%] sm:w-[320px] md:w-[360px] aspect-[3/4] overflow-hidden bg-concrete-dark group shrink-0 snap-start cursor-zoom-in"
                    aria-label={item.title ?? t("portfolio.altDefault")}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.thumbnail_url ? item.url : `${item.url}#t=0.5`}
                        poster={item.thumbnail_url ?? undefined}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      />
                    ) : (
                      <img
                        src={item.thumbnail_url ?? item.url}
                        alt={item.title ?? t("portfolio.altDefault")}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/gallery">{t("portfolio.viewMore")}{"\u00a0"}<ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section-y bg-background">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("testimonials.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("testimonials.title")}</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {testimonials.map((tt, i) => (
              <div key={i} className="bg-card border border-border p-6 flex flex-col">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: tt.rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground/85 leading-relaxed flex-1">«{tt.text}»</p>
                <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
                  <div
                    aria-hidden
                    className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center font-display text-base tracking-wide"
                  >
                    {getInitials(tt.name)}
                  </div>
                  <div className="text-sm font-medium">{tt.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-y bg-concrete-dark text-primary-foreground">
        <div className="container-x grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("trust.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{!h.values_title || h.values_title === "Наші цінності" ? t("trust.titleDefault") : h.values_title}</h2>
            <p className="mt-5 text-white/75 leading-relaxed whitespace-pre-line">{h.values_text}</p>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-px bg-white/10">
            {TRUST.map((s) => (
              <div key={s.l} className="bg-concrete-dark p-8 text-center">
                <div className="font-display text-5xl text-accent">{s.n}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="lead-form" className="section-y hero-gradient text-primary-foreground scroll-mt-20">
        <div className="container-x grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("cta.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("cta.title")}</h2>
            <p className="mt-5 text-white/75 leading-relaxed">
              {t("cta.text")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={phoneHref}><Phone className="mr-2 h-4 w-4" /> {t("cta.call")}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <a href="https://t.me/" target="_blank" rel="noreferrer">
                  <Send className="mr-2 h-4 w-4" /> Telegram
                </a>
              </Button>

            </div>
          </div>
          <div className="bg-card text-foreground p-8 rounded-lg shadow-elegant">
            <h3 className="text-2xl">{t("cta.leadTitle")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("cta.leadSub")}</p>
            <div className="mt-5"><LeadForm source="cta" /></div>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="section-y bg-background scroll-mt-20">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("faq.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("faq.title")}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {t("faq.text")}
            </p>
          </div>
          <div className="md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:text-accent hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>


      <SiteFooter phone={phone} email={c.email} />

      {lightboxIndex >= 0 && portfolio[lightboxIndex] && (
        <Lightbox
          items={portfolio}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-4xl text-accent">{n}</div>
      <div className="text-xs uppercase tracking-wider text-white/60 mt-1">{l}</div>
    </div>
  );
}
