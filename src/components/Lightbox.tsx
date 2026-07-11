import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

export type LightboxItem = {
  id: string;
  url: string;
  type: string;
  title?: string | null;
  thumbnail_url?: string | null;
};

type Props = {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function Lightbox({ items, index, onClose, onIndexChange }: Props) {
  const total = items.length;
  const item = items[index];
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);

  const prev = useCallback(() => onIndexChange((index - 1 + total) % total), [index, total, onIndexChange]);
  const next = useCallback(() => onIndexChange((index + 1) % total), [index, total, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-thumb-id="${item?.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [item?.id]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white/80 text-sm shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="truncate pr-4">
          <span className="text-white/50">{index + 1} / {total}</span>
          {item.title && <span className="ml-3 text-white">{item.title}</span>}
        </div>
        <button
          onClick={onClose}
          aria-label="Закрити"
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main media */}
      <div
        className="relative flex-1 flex items-center justify-center px-2 sm:px-12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => {
          if (touchStartX.current !== null) setTouchDelta(e.touches[0].clientX - touchStartX.current);
        }}
        onTouchEnd={() => {
          if (Math.abs(touchDelta) > 50) {
            if (touchDelta < 0) next(); else prev();
          }
          touchStartX.current = null;
          setTouchDelta(0);
        }}
      >
        <button
          onClick={prev}
          aria-label="Попереднє"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {item.type === "video" ? (
          getYouTubeEmbedUrl(item.url) ? (
            <iframe
              key={item.id}
              src={getYouTubeEmbedUrl(item.url)!}
              className="w-full max-w-[800px] aspect-video object-contain rounded-lg border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              key={item.id}
              src={item.url}
              poster={item.thumbnail_url ?? undefined}
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full object-contain"
            />
          )
        ) : (
          <img
            key={item.id}
            src={item.url}
            alt={item.title || "media"}
            className="max-h-full max-w-full object-contain select-none"
            draggable={false}
          />
        )}

        <button
          onClick={next}
          aria-label="Наступне"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails strip */}
      <div
        ref={stripRef}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 flex gap-2 px-4 py-3 overflow-x-auto bg-black/40 border-t border-white/5 scrollbar-thin"
      >
        {items.map((it, i) => {
          const active = i === index;
          const thumb = it.thumbnail_url || (it.type === "image" ? it.url : undefined);
          return (
            <button
              key={it.id}
              data-thumb-id={it.id}
              onClick={() => onIndexChange(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden ring-2 transition ${
                active ? "ring-accent" : "ring-transparent hover:ring-white/30"
              }`}
              aria-label={`Перейти до ${i + 1}`}
            >
              {thumb ? (
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 grid place-items-center text-[10px] text-white/60">video</div>
              )}
              {it.type === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-black/30 text-white text-xs">▶</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
