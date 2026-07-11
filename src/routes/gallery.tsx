import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getGallery, getGalleryCategories, siteContentQuery } from "@/lib/content.functions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Lightbox } from "@/components/Lightbox";
import { useLanguage } from "@/i18n/context";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getYouTubeEmbedUrl } from "@/lib/utils";



const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
  staleTime: 60_000,
});
const categoriesQuery = queryOptions({
  queryKey: ["gallery_categories"],
  queryFn: () => getGalleryCategories(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/gallery")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(galleryQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(siteContentQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Portafolio — Asturbau Construcción" },
      { name: "description", content: "Fotos y vídeos de nuestras obras: reformas de pisos, reconstrucciones y locales comerciales en Asturias." },
      { property: "og:title", content: "Portafolio — Asturbau Construcción" },
      { property: "og:description", content: "Nuestras obras finalizadas." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),

  component: GalleryPage,
  errorComponent: ErrorComponent,
});

type Item = {
  id: string;
  url: string;
  type: string;
  title: string | null;
  thumbnail_url: string | null;
  orientation: string;
  category_id?: string | null;
};

type Category = { id: string; name: string; slug: string; sort_order: number };


const GAP = 8;
const TARGET_H = 260;

function defaultRatio(orientation: string) {
  if (orientation === "vertical") return 9 / 16;
  if (orientation === "square") return 1;
  return 16 / 9;
}

function JustifiedGallery({ items, onOpen }: { items: Item[]; onOpen: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setRatio = useCallback((id: string, r: number) => {
    if (!r || !isFinite(r)) return;
    setRatios((prev) => (prev[id] === r ? prev : { ...prev, [id]: r }));
  }, []);

  const rows = useMemo(() => {
    if (!width) return [] as { items: Item[]; height: number }[];
    const out: { items: Item[]; height: number }[] = [];
    let bucket: Item[] = [];
    let sumRatio = 0;
    for (const it of items) {
      const r = ratios[it.id] ?? defaultRatio(it.orientation);
      bucket.push(it);
      sumRatio += r;
      const gaps = (bucket.length - 1) * GAP;
      const projectedWidth = sumRatio * TARGET_H + gaps;
      if (projectedWidth >= width) {
        const h = (width - gaps) / sumRatio;
        out.push({ items: bucket, height: h });
        bucket = [];
        sumRatio = 0;
      }
    }
    if (bucket.length) {
      // last incomplete row: keep target height, but cap so it doesn't overflow
      const gaps = (bucket.length - 1) * GAP;
      const naturalW = sumRatio * TARGET_H + gaps;
      const h = naturalW > width ? (width - gaps) / sumRatio : TARGET_H;
      out.push({ items: bucket, height: h });
    }
    return out;
  }, [items, ratios, width]);

  return (
    <div ref={containerRef} className="w-full">
      {rows.map((row, ri) => (
        <div key={ri} className="flex" style={{ gap: GAP, marginBottom: GAP }}>
          {row.items.map((it) => {
            const r = ratios[it.id] ?? defaultRatio(it.orientation);
            const w = r * row.height;
            return (
              <button
                type="button"
                key={it.id}
                onClick={() => onOpen(it.id)}
                style={{ width: w, height: row.height }}
                className="relative overflow-hidden bg-secondary ring-1 ring-border/40 hover:ring-accent/60 transition shrink-0 cursor-zoom-in group rounded-lg"
              >
                {it.type === "video" ? (
                  getYouTubeEmbedUrl(it.url) ? (
                    <img
                      src={it.thumbnail_url || `https://img.youtube.com/vi/${it.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/)?.[2] || ""}/hqdefault.jpg`}
                      alt={it.title || "Asturbau project video"}
                      loading="lazy"
                      onLoad={() => {
                        setRatio(it.id, 16 / 9);
                      }}
                      className="w-full h-full object-cover block"
                    />
                  ) : (
                    <video
                      src={it.thumbnail_url ? it.url : `${it.url}#t=0.5`}
                      poster={it.thumbnail_url ?? undefined}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        if (v.videoWidth && v.videoHeight) setRatio(it.id, v.videoWidth / v.videoHeight);
                      }}
                      className="w-full h-full object-cover block pointer-events-none"
                    />
                  )
                ) : (
                  <img
                    src={it.url}
                    alt={it.title || "Asturbau project"}
                    loading="lazy"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) setRatio(it.id, img.naturalWidth / img.naturalHeight);
                    }}
                    className="w-full h-full object-cover block"
                  />
                )}
                {it.type === "video" && (
                  <span className="absolute inset-0 grid place-items-center bg-black/30 text-white text-2xl opacity-80 group-hover:opacity-100">▶</span>
                )}
              </button>

            );
          })}
        </div>
      ))}
    </div>
  );
}

function GalleryPage() {
  const { data: items } = useSuspenseQuery(galleryQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: content } = useSuspenseQuery(siteContentQuery);
  const { t } = useLanguage();
  const c = content.contacts ?? {};
  const list = items as Item[];
  const categories = cats as Category[];
  const [activeCat, setActiveCat] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeCat === "all") return list;
    if (activeCat === "__none__") return list.filter((i) => !i.category_id);
    return list.filter((i) => i.category_id === activeCat);
  }, [list, activeCat]);

  const openIndex = openId ? filtered.findIndex((i) => i.id === openId) : -1;
  const uncatCount = list.filter((i) => !i.category_id).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader phone={c.phone} />
      <section>
        <div className="container-x pt-16 pb-8">
          <ScrollReveal>
            <h1 className="mt-3 text-5xl md:text-6xl text-foreground font-display uppercase tracking-wider">{t("gallery.title")}</h1>
            <p className="mt-3 text-muted-foreground max-w-xl text-lg">{t("gallery.subtitle")}</p>
          </ScrollReveal>

          {categories.length > 0 && (
            <ScrollReveal delay={100}>
              <div className="mt-8 flex flex-wrap gap-2">
                <CatChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
                  {t("gallery.all")} ({list.length})
                </CatChip>
                {categories.map((cat) => {
                  const n = list.filter((i) => i.category_id === cat.id).length;
                  if (n === 0) return null;
                  return (
                    <CatChip key={cat.id} active={activeCat === cat.id} onClick={() => setActiveCat(cat.id)}>
                      {cat.name} ({n})
                    </CatChip>
                  );
                })}
                {uncatCount > 0 && (
                  <CatChip active={activeCat === "__none__"} onClick={() => setActiveCat("__none__")}>
                    {t("gallery.other")} ({uncatCount})
                  </CatChip>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <section className="flex-1">
        <div className="container-x pb-20">
          {filtered.length === 0 ? (
            <ScrollReveal>
              <div className="py-20 text-center text-muted-foreground">
                {list.length === 0 ? t("gallery.empty.all") : t("gallery.empty.cat")}
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal delay={200}>
              <JustifiedGallery items={filtered} onOpen={setOpenId} />
            </ScrollReveal>
          )}
        </div>
      </section>

      <SiteFooter phone={c.phone} email={c.email} />

      {openIndex >= 0 && (
        <Lightbox
          items={filtered}
          index={openIndex}
          onClose={() => setOpenId(null)}
          onIndexChange={(i) => setOpenId(filtered[i].id)}
        />
      )}
    </div>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
        active
          ? "bg-accent text-accent-foreground border-accent"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

