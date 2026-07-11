import { createFileRoute, ErrorComponent, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { Lightbox } from "@/components/Lightbox";
import { getGallery, siteContentQuery } from "@/lib/content.functions";
import { getServices, getServiceBySlug, serviceExists } from "@/i18n/services";
import { useLanguage } from "@/i18n/context";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getYouTubeEmbedUrl } from "@/lib/utils";

const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(siteContentQuery);
    if (!serviceExists(params.slug)) throw notFound();
    await context.queryClient.ensureQueryData(galleryQuery);
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.slug ? getServiceBySlug(loaderData.slug, "es") : undefined;
    if (!s) return { meta: [{ title: "Servicio no encontrado" }] };
    return {
      meta: [
        { title: `${s.title} — Asturbau Construcción` },
        { name: "description", content: s.desc.slice(0, 160) },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.desc.slice(0, 200) },
        { property: "og:image", content: s.image },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/services/${s.slug}` }],
    };
  },
  component: ServicePage,
  errorComponent: ErrorComponent,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl">{t("service.notFound")}</h1>
        <Button asChild className="mt-6"><Link to="/services">{t("service.notFound.back")}</Link></Button>
      </div>
    </div>
  );
}

function ServicePage() {
  const { slug } = Route.useLoaderData() as { slug: string };
  const { lang, t } = useLanguage();
  const s = getServiceBySlug(slug, lang)!;
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const others = getServices(lang).filter((x) => x.slug !== s.slug);

  const galleryList = (gallery ?? []) as Array<any>;
  const tag = `service:${s.slug}`;
  const portfolio = galleryList
    .filter((g) => Array.isArray(g.featured_pages) && g.featured_pages.includes(tag))
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate">
          <div className="absolute inset-0 -z-10">
            <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
          </div>
          <div className="container-x py-20 md:py-32 animate-reveal-up">

            <h1 className="mt-3 text-4xl md:text-6xl text-white max-w-3xl">{s.title}</h1>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#lead-form">{t("service.leadCta")}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white hover:text-foreground">
                <Link to="/contacts"><Phone className="h-4 w-4 mr-2" /> {t("service.contact")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="section-y">
          <div className="container-x">
            <ScrollReveal className="max-w-3xl">
              <h2 className="mt-3 text-3xl md:text-4xl">{t("service.aboutTitle")}</h2>
              <div className="mt-6 space-y-5 text-lg text-muted-foreground leading-relaxed">
                {s.desc.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                {s.includes.map((block) => (
                  <p key={block.title}>
                    <span className="text-foreground font-medium">{block.title}: </span>
                    {block.items.join(", ")}.
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PORTFOLIO */}
        {portfolio.length > 0 && (
          <section className="section-y bg-secondary">
            <div className="container-x">
              <ScrollReveal className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("service.portfolio.tag")}</p>
                <h2 className="mt-3 text-4xl md:text-5xl">{t("service.portfolio.title")}</h2>
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

        {/* LEAD FORM */}
        <section id="lead-form" className="section-y bg-secondary scroll-mt-20">
          <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("service.order.tag")}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{t("service.order.title")}</h2>
              <p className="mt-3 text-muted-foreground">{t("service.order.text")}</p>
            </ScrollReveal>
            <ScrollReveal delay={200} animation="reveal-in">
              <LeadForm />
            </ScrollReveal>
          </div>
        </section>

        {/* OTHER SERVICES */}
        <section className="section-y bg-background">
          <div className="container-x">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl">{t("service.others")}</h2>
            </ScrollReveal>
            <ul className="mt-8 space-y-4 text-lg">
              {others.map((o, idx) => (
                <ScrollReveal key={o.slug} delay={idx * 100}>
                  <li>
                    <Link
                      to="/services/$slug"
                      params={{ slug: o.slug }}
                      className="inline-flex items-center gap-2 text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
                    >
                      {o.shortTitle}
                    </Link>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

      </main>
      <SiteFooter />

      {lightboxIndex >= 0 && (
        <Lightbox
          items={portfolio}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
