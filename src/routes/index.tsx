import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import {
  ArrowRight, Home, Building2, Layers, Flame, Hammer, Bath,
  Phone, Star, MessageCircle, Send,
  Wrench, Paintbrush, Ruler, HardHat, Droplet, Lightbulb, Plug,
} from "lucide-react";
import { getGallery, siteContentQuery } from "@/lib/content.functions";
import { getServices } from "@/i18n/services";
import { useLanguage } from "@/i18n/context";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/hero-construction.jpg";
import collageBathroom from "@/assets/collage-bathroom.jpg";
import collageKitchen from "@/assets/collage-kitchen.jpg";
import collageLiving from "@/assets/collage-living.jpg";
import svcApartment from "@/assets/svc-apartment.jpg";
import svcDrywall from "@/assets/svc-drywall.jpg";
import svcRestaurant from "@/assets/svc-restaurant.jpg";
import svcHeating from "@/assets/svc-heating.jpg";

const SERVICE_IMAGES: Record<string, string> = {
  "remont-pid-kliuch": collageLiving,
  "remont-ofisiv-ta-komertsii": svcRestaurant,
  "planuvannia-ta-pereplanuvannia": collageKitchen,
  "inzhenerni-merezhi": svcHeating,
  "montazh-gipsokartonu": svcDrywall,
  "remont-vannykh-ta-plytka": collageBathroom
};

const PATH_MAP: Record<string, string> = {
  "/src/assets/collage-living.jpg": collageLiving,
  "/src/assets/svc-restaurant.jpg": svcRestaurant,
  "/src/assets/collage-kitchen.jpg": collageKitchen,
  "/src/assets/svc-heating.jpg": svcHeating,
  "/src/assets/svc-drywall.jpg": svcDrywall,
  "/src/assets/collage-bathroom.jpg": collageBathroom
};

const ICON_MAP: Record<string, any> = {
  home: Home,
  building: Building2,
  layers: Layers,
  flame: Flame,
  hammer: Hammer,
  bath: Bath,
  wrench: Wrench,
  paintbrush: Paintbrush,
  ruler: Ruler,
  hardhat: HardHat,
  droplet: Droplet,
  lightbulb: Lightbulb,
  plug: Plug
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery),
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

// Icons matched to services
const ICONS = [Home, Building2, Layers, Flame, Hammer, Bath];

const DEFAULT_TESTIMONIALS = [
  { name: "Marta G.", text: "El equipo terminó la reforma del piso a tiempo y con una calidad impecable. ¡Gracias por su profesionalidad!", rating: 5 },
  { name: "Carlos R.", text: "La reconstrucción del restaurante se hizo sin sobresaltos. Presupuesto transparente, trabajo cuidadoso — recomiendo.", rating: 5 },
  { name: "Olena P.", text: "Honestidad y responsabilidad — así es Asturbau. Volveremos a trabajar juntos.", rating: 5 },
];

function HomePage() {
  const { lang, t } = useLanguage();
  const { data } = useSuspenseQuery(siteContentQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const SERVICE_DEFS = getServices(lang);
  
  const h = (() => {
    let resolved = (data.home?.[lang] ?? data.home?.es ?? data.home) ?? {};
    
    if (lang === "es") {
      const needsEsFallback = !data.home?.es || resolved.about_title === "Наші переваги" || resolved.process?.some((p: any) => p.title === "Перший контакт");
      if (needsEsFallback) {
        resolved = {
          ...resolved,
          hero_title: resolved.hero_title || "Asturbau Construcción",
          hero_subtitle: resolved.hero_subtitle === "Професійний ремонт квартир, офісів та комерційних приміщень під ключ в Астурії (Хіхон, Ов'єдо, Авілес)" || !resolved.hero_subtitle
            ? "Reformas integrales y acabados en Asturias (Gijón, Oviedo, Avilés)"
            : resolved.hero_subtitle,
          hero_cta: resolved.hero_cta || "Solicitar presupuesto gratis",
          about_title: "Nuestras ventajas",
          about_text: "En el sector de las reformas y acabados, la calidad del trabajo y el cumplimiento de los plazos son claves. Asturbau ofrece reformas integrales llave en mano en Gijón, Oviedo y Avilés. Creamos espacios ergonómicos, seguros y duraderos basándonos en cálculos minuciosos y soluciones tecnológicas contrastadas.",
          advantages: resolved.advantages?.some((a: string) => a.includes("Багаторічний")) || !resolved.advantages
            ? [
                "Años de experiencia práctica en reformas y acabados",
                "Ejecución de proyectos llave en mano",
                "Altos estándares de calidad en cada etapa",
                "Presupuesto transparente y detallado",
                "Cumplimiento de los plazos acordados",
                "Contacto continuo con el cliente",
                "Enfoque individualizado para cada proyecto",
                "Trabajamos con propiedades residenciales y comerciales",
                "Uso de tecnologías y materiales modernos",
                "Control de calidad en todo momento"
              ]
            : resolved.advantages,
          values_title: resolved.values_title === "Наші цінності" || !resolved.values_title ? "Nuestros valores" : resolved.values_title,
          values_text: resolved.values_text?.includes("Компанія Asturbau") || !resolved.values_text
            ? "Asturbau es un equipo de profesionales con más de 10 años de experiencia en reformas e instalaciones en Asturias. Trabajamos con honestidad, transparencia y responsabilidad: presupuesto cerrado por contrato, uso de materiales certificados y reporte continuo al cliente sobre el avance de los trabajos."
            : resolved.values_text,
          process: resolved.process?.some((p: any) => p.title === "Перший контакт") || !resolved.process
            ? [
                { step: "01", title: "Primer contacto", desc: "Analizamos sus necesidades, ideas y objetivos para el proyecto." },
                { step: "02", title: "Visita técnica", desc: "Visitamos el inmueble para realizar mediciones y evaluar el estado actual." },
                { step: "03", title: "Presupuesto", desc: "Elaboramos un cálculo de costes desglosado con materiales, mano de obra y plazos." },
                { step: "04", title: "Firma del contrato", desc: "Fijamos el alcance del trabajo, precio cerrado y fechas de entrega en el contrato." },
                { step: "05", title: "Ejecución de obra", desc: "Realizamos los trabajos según la planificación y normativas técnicas." },
                { step: "06", title: "Control de calidad", desc: "Supervisamos rigurosamente cada fase para asegurar acabados de nivel superior." },
                { step: "07", title: "Entrega de llaves", desc: "Recepción del proyecto terminado, limpieza final y entrega de garantías." }
              ]
            : resolved.process
        };
      }
    } else {
      const needsUkFallback = !data.home?.uk || !resolved.about_title;
      if (needsUkFallback) {
        resolved = {
          ...resolved,
          hero_title: resolved.hero_title || "Asturbau Construcción",
          hero_subtitle: resolved.hero_subtitle || "Професійний ремонт квартир, офісів та комерційних приміщень під ключ в Астурії (Хіхон, Ов'єдо, Авілес)",
          hero_cta: resolved.hero_cta || "Залишити заявку",
          about_title: "Наші переваги",
          about_text: resolved.about_text || "У сфері ремонту та оздоблення житла і комерційної нерухомості якість робіт та чітке дотримання технологій є найважливішими чинниками. Компанія Asturbau пропонує професійний ремонт під ключ у Хіхоні, Ов'єдо та Авілесі. Ми не просто виконуємо технічне завдання, а створюємо ергономічний, безпечний та довговічний простір для життя та бізнесу на основі детальних розрахунків та перевірених технологій.",
          advantages: resolved.advantages || [
            "Багаторічний практичний досвід у сфері ремонту та оздоблення",
            "Виконання робіт «під ключ»",
            "Високі стандарти якості на кожному етапі",
            "Прозорість кошторису та вартості робіт",
            "Дотримання узгоджених термінів",
            "Постійний звʼязок із замовником",
            "Індивідуальний підхід до кожного проєкту",
            "Робота як з приватними, так і з комерційними обʼєктами",
            "Використання сучасних технологій та матеріалів",
            "Контроль якості на всіх етапах виконання"
          ],
          values_title: resolved.values_title || "Наші цінності",
          values_text: resolved.values_text || "Компанія Asturbau — це команда кваліфікованих майстрів із понад 10-річним досвідом у сфері внутрішнього оздоблення та інженерних робіт в Астурії. Ми працюємо чесно, прозоро та відповідально: фіксуємо остаточну вартість робіт у договорі, використовуємо сертифіковані матеріали, що відповідають чинним нормативам, та забезпечуємо повну поетапну звітність перед замовником на кожній стадії оздоблювальних робіт.",
          process: resolved.process || [
            { step: "01", title: "Перший контакт", desc: "Обговорюємо ваші потреби та задачі" },
            { step: "02", title: "Виїзд на обʼєкт", desc: "Приїжджаємо на обʼєкт, робимо заміри й оцінюємо обсяг майбутніх робіт." },
            { step: "03", title: "Кошторис", desc: "Готуємо повний розрахунок вартості з деталізованим списком матеріалів, робіт і встановлюємо терміни виконання." },
            { step: "04", title: "Договір", desc: "Фіксуємо обсяг, терміни та ціну" },
            { step: "05", title: "Виконання", desc: "Робота згідно з графіком" },
            { step: "06", title: "Контроль", desc: "Контроль якості на всіх етапах" },
            { step: "07", title: "Здача обʼєкта", desc: "Приймання готового результату" }
          ]
        };
      }
    }
    return resolved;
  })();

  const c = data.contacts ?? {};

  const process: Array<{ step: string; title: string; desc: string }> = h.process ?? [];
  const testimonials: Array<{ name: string; text: string; rating?: number }> =
    h.testimonials ?? DEFAULT_TESTIMONIALS;
  const galleryList = (gallery ?? []) as Array<any>;
  const featured = galleryList.filter((g) => g.featured_on_home);
  const portfolio = featured
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

  const FAQ = h.faq ?? [
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
          <div className="md:col-span-7 animate-reveal-up">
            <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t("hero.badge")}
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl leading-[0.95]">
              {h.hero_title || t("hero.title.default")}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              {h.hero_subtitle || t("hero.subtitle")}
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
          <ScrollReveal className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("about.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{h.about_title || t("about.title")}</h2>
            {h.about_text ? (
              <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
                {h.about_text}
              </p>
            ) : (
              <>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  {t("about.p1")}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("about.p2")}&nbsp;
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("about.p3")}
                </p>
              </>
            )}
          </ScrollReveal>
          <ScrollReveal className="md:col-span-6" delay={200}>
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-[58%] aspect-[4/3] overflow-hidden border border-border shadow-lg rounded-lg">
                <img src={collageBathroom} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute top-[18%] right-0 w-[48%] aspect-[3/4] overflow-hidden border border-border shadow-xl rounded-lg">
                <img src={collageKitchen} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-[12%] w-[62%] aspect-[4/3] overflow-hidden border border-border shadow-lg rounded-lg">
                <img src={collageLiving} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-y bg-secondary">
        <div className="container-x">
          <ScrollReveal className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("services.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("services.title")}</h2>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-4">
            {(h.services_cards || SERVICE_DEFS.map((s: any) => ({
              title: s.title,
              desc: s.shortDesc,
              image: s.image,
              serviceSlug: s.slug
            }))).map((s: any, i: number) => {
              const Icon = ICON_MAP[s.icon] || ICONS[i % ICONS.length];
              const smSpans = ["sm:col-span-4", "sm:col-span-2", "sm:col-span-2", "sm:col-span-4", "sm:col-span-4", "sm:col-span-2"];
              const span = smSpans[i % smSpans.length];
              const bgImage = PATH_MAP[s.image] || s.image || SERVICE_IMAGES[s.serviceSlug] || collageLiving;
              return (
                <ScrollReveal
                  key={i}
                  className={span}
                  delay={i * 100}
                >
                  <Link
                    id={`service-${i}`}
                    to="/services/$slug"
                    params={{ slug: s.serviceSlug || "remont-pid-kliuch" }}
                    className="group relative overflow-hidden bg-card border border-border hover:border-accent transition-colors min-h-[360px] md:min-h-[420px] isolate flex flex-col justify-end scroll-mt-20 w-full h-full rounded-lg"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center -z-10"
                      style={{ backgroundImage: `url(${bgImage})` }}
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
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal className="mt-10 flex justify-center" delay={300}>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">{t("services.all")} <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>


      {/* PROCESS */}
      <section className="section-y bg-background">
        <div className="container-x grid md:grid-cols-12 gap-12 items-start">
          {/* Left Column (Sticky Title & Intro) */}
          <div className="md:col-span-5 md:sticky md:top-28">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("process.tag")}</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-display leading-[0.95]">{t("process.title")}</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {t("process.intro")}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column (Alternating Vertical Timeline) */}
          <div className="md:col-span-7">
            <div className="relative flex flex-col gap-12">
              {/* Vertical line running all the way */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-px border-l border-dashed border-accent/40 z-0" />

              {process.map((p, i) => {
                const isEven = i % 2 === 0;
                return (
                  <ScrollReveal
                    key={p.step}
                    className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-x-6 md:gap-x-10 items-start relative"
                    delay={i * 150}
                  >
                    {/* Left side text block (visible on desktop for odd items) */}
                    <div className={`hidden md:block ${isEven ? "" : "text-right"}`}>
                      {!isEven && (
                        <div className="pt-1">
                          <h3 className="text-xl font-semibold text-foreground">{p.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                        </div>
                      )}
                    </div>

                    {/* Central Circle */}
                    <div className="col-start-1 md:col-start-2 flex justify-center pt-1.5 z-10">
                      <div className="h-8 w-8 rounded-full border border-accent bg-background text-accent flex items-center justify-center text-[11px] font-semibold tracking-wider shadow-sm transition-transform hover:scale-110 duration-300">
                        {p.step}
                      </div>
                    </div>

                    {/* Right side text block (visible on mobile, and on desktop for even items) */}
                    <div className={`col-start-2 ${isEven ? "md:col-start-3 text-left" : "md:col-start-3 md:hidden text-left"}`}>
                      <div className="pt-1">
                        <h3 className="text-xl font-semibold text-foreground">{p.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      {portfolio.length > 0 && (
        <section className="section-y bg-secondary">
          <div className="container-x">
            <ScrollReveal className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("portfolio.tag")}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{t("portfolio.title")}</h2>
            </ScrollReveal>
            <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              <div className="flex gap-3 sm:gap-2 pb-2">
                {portfolio.map((item, idx) => (
                  <ScrollReveal
                    key={item.id}
                    delay={idx * 100}
                    className="shrink-0 snap-start"
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="relative block w-[280px] sm:w-[320px] md:w-[360px] aspect-[3/4] overflow-hidden bg-concrete-dark group cursor-zoom-in rounded-lg"
                      aria-label={item.title ?? t("portfolio.altDefault")}
                    >
                      {item.type === "video" ? (
                        getYouTubeEmbedUrl(item.url) ? (
                          <img
                            src={item.thumbnail_url || `https://img.youtube.com/vi/${item.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/)?.[2] || ""}/hqdefault.jpg`}
                            alt={item.title ?? t("portfolio.altDefault")}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.thumbnail_url ? item.url : `${item.url}#t=0.5`}
                            poster={item.thumbnail_url ?? undefined}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                          />
                        )
                      ) : (
                        <img
                          src={item.thumbnail_url ?? item.url}
                          alt={item.title ?? t("portfolio.altDefault")}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <ScrollReveal className="mt-10 flex justify-center" delay={200}>
              <Button asChild variant="outline">
                <Link to="/gallery">{t("portfolio.viewMore")}{"\u00a0"}<ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section-y bg-background">
        <div className="container-x">
          <ScrollReveal className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("testimonials.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("testimonials.title")}</h2>
          </ScrollReveal>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {testimonials.map((tt, i) => (
              <ScrollReveal
                key={i}
                delay={i * 150}
                className="bg-card border border-border p-6 flex flex-col rounded-lg"
              >
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
              </ScrollReveal>
            ))}
          </div>
          
          {/* Google Business Review CTA */}
          {(h.google_business_link || h.google_review_link) && (
            <ScrollReveal className="mt-12" delay={250}>
              <div className="max-w-xl mx-auto bg-card border border-border p-6 rounded-2xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute -inset-px bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-2xl blur-lg group-hover:opacity-100 transition duration-1000 opacity-70" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-semibold text-lg">G</span>
                    <span className="text-red-500 font-semibold text-lg">o</span>
                    <span className="text-amber-500 font-semibold text-lg">o</span>
                    <span className="text-blue-500 font-semibold text-lg">g</span>
                    <span className="text-green-500 font-semibold text-lg">l</span>
                    <span className="text-red-500 font-semibold text-lg">e</span>
                    <span className="text-foreground/60 text-sm ml-1 font-medium">Business</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lang === "es" 
                      ? "Valoramos su opinión. Comparta su experiencia con nosotros en Google Business."
                      : "Ми цінуємо вашу думку! Поділіться своїм досвідом роботи з нами в Google Business."}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {h.google_business_link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={h.google_business_link} target="_blank" rel="noopener noreferrer">
                          {lang === "es" ? "Ver perfil en Maps" : "Дивитись профіль на Картах"}
                        </a>
                      </Button>
                    )}
                    {h.google_review_link && (
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                        <a href={h.google_review_link} target="_blank" rel="noopener noreferrer">
                          {lang === "es" ? "Escribir reseña" : "Написати відгук"}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* TRUST */}
      <section className="section-y bg-concrete-dark text-primary-foreground">
        <div className="container-x grid md:grid-cols-12 gap-10 items-center">
          <ScrollReveal className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("trust.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{!h.values_title || h.values_title === "Наші цінності" ? t("trust.titleDefault") : h.values_title}</h2>
            <p className="mt-5 text-white/75 leading-relaxed whitespace-pre-line">{h.values_text}</p>
          </ScrollReveal>
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            {TRUST.map((s, i) => (
              <ScrollReveal key={s.l} delay={i * 150} className="bg-concrete-dark/40 border border-white/10 p-8 text-center rounded-lg shadow-card">
                <div className="font-display text-5xl text-accent">{s.n}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-white/60">{s.l}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="lead-form" className="container-x py-12 md:py-16 scroll-mt-20">
        <div className="hero-gradient text-primary-foreground rounded-3xl px-4 py-8 md:p-16 shadow-elegant relative overflow-hidden">
          {/* Abstract circles background overlay (Image 1 style) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <svg className="absolute -right-20 -bottom-20 w-80 h-80 text-accent/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="40" />
              <circle cx="50" cy="50" r="50" strokeDasharray="4 2" />
            </svg>
            <svg className="absolute -left-20 -top-20 w-72 h-72 text-accent/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="50" ry="25" transform="rotate(-30 50 50)" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
            <ScrollReveal className="md:col-span-6">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("cta.tag")}</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase tracking-wider">{t("cta.title")}</h2>
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
            </ScrollReveal>
            <ScrollReveal className="bg-card text-foreground p-5 md:p-8 rounded-2xl shadow-elegant" delay={200} animation="reveal-in">
              <h3 className="text-2xl font-display uppercase tracking-wider">{t("cta.leadTitle")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("cta.leadSub")}</p>
              <div className="mt-5"><LeadForm source="cta" /></div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="section-y bg-background scroll-mt-20">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <ScrollReveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("faq.tag")}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("faq.title")}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {t("faq.text")}
            </p>
          </ScrollReveal>
          <div className="md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <AccordionItem value={`item-${i}`} className="border-border">
                    <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:text-accent hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                </ScrollReveal>
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
