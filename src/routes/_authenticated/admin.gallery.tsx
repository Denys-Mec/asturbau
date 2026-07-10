import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  adminListGallery, createGalleryItem, deleteGalleryItem, updateGalleryItem, createUploadUrl,
  adminListCategories, createCategory, updateCategory, deleteCategory,
} from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Upload, Link as LinkIcon, ArrowUp, ArrowDown, Star, Plus, Play, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

const NO_CATEGORY = "__none__";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[іїєґ]/g, (c) => ({ і: "i", ї: "i", є: "e", ґ: "g" } as any)[c] ?? c)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `cat-${Date.now()}`;
}

function GalleryAdmin() {
  const list = useServerFn(adminListGallery);
  const create = useServerFn(createGalleryItem);
  const update = useServerFn(updateGalleryItem);
  const del = useServerFn(deleteGalleryItem);
  const upload = useServerFn(createUploadUrl);
  const listCats = useServerFn(adminListCategories);
  const createCat = useServerFn(createCategory);
  const delCat = useServerFn(deleteCategory);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; current: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlForm, setUrlForm] = useState({ type: "image" as "image" | "video", url: "", title: "", orientation: "vertical" as const, category_id: NO_CATEGORY });
  const [activeCat, setActiveCat] = useState<string>("all");
  const [newCatName, setNewCatName] = useState("");
  const [defaultCat, setDefaultCat] = useState<string>(NO_CATEGORY);
  const [preview, setPreview] = useState<any | null>(null);

  const { data: items = [] } = useQuery({ queryKey: ["admin_gallery"], queryFn: () => list() });
  const { data: categories = [] } = useQuery({ queryKey: ["admin_categories"], queryFn: () => listCats() });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin_gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  };
  const refreshCats = () => {
    qc.invalidateQueries({ queryKey: ["admin_categories"] });
    qc.invalidateQueries({ queryKey: ["gallery_categories"] });
  };

  const createMut = useMutation({
    mutationFn: (v: any) => create({ data: v }),
    onSuccess: () => { refresh(); toast.success("Додано"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });
  const updateMut = useMutation({
    mutationFn: (v: any) => update({ data: v }),
    onSuccess: refresh,
  });
  const delMut = useMutation({
    mutationFn: (item: any) => del({ data: { id: item.id, storage_path: extractPath(item.url) } }),
    onSuccess: () => { refresh(); toast.success("Видалено"); },
  });
  const createCatMut = useMutation({
    mutationFn: (v: any) => createCat({ data: v }),
    onSuccess: () => { refreshCats(); toast.success("Категорію додано"); setNewCatName(""); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });
  const delCatMut = useMutation({
    mutationFn: (id: string) => delCat({ data: { id } }),
    onSuccess: () => { refreshCats(); refresh(); toast.success("Категорію видалено"); },
  });

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const { path, token } = await upload({ data: { filename: file.name } });
      const { error } = await supabase.storage.from("gallery").uploadToSignedUrl(path, token, file);
      if (error) throw error;
      const url = `/api/public/gallery/${encodeURIComponent(path)}`;
      const type = file.type.startsWith("video/") ? "video" : "image";
      const orientation = await detectOrientation(file, type);
      const maxOrder = items.reduce((m: number, i: any) => Math.max(m, i.sort_order), 0);
      await createMut.mutateAsync({
        type, url, orientation, sort_order: maxOrder + 1, title: file.name,
        category_id: defaultCat === NO_CATEGORY ? null : defaultCat,
      });
    } catch (e: any) {
      toast.error(e?.message || "Помилка завантаження");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleFiles(files: FileList | File[] | null) {
    if (!files) return;
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setProgress({ done: 0, total: arr.length, current: arr[0].name });
    for (let i = 0; i < arr.length; i++) {
      setProgress({ done: i, total: arr.length, current: arr[i].name });
      await handleFile(arr[i]);
    }
    setProgress(null);
  }

  function move(item: any, dir: -1 | 1) {
    const idx = filtered.findIndex((i: any) => i.id === item.id);
    const swap = filtered[idx + dir];
    if (!swap) return;
    updateMut.mutate({ id: item.id, sort_order: swap.sort_order });
    updateMut.mutate({ id: swap.id, sort_order: item.sort_order });
  }

  function addByUrl() {
    if (!urlForm.url) { toast.error("Вкажіть URL"); return; }
    const maxOrder = items.reduce((m: number, i: any) => Math.max(m, i.sort_order), 0);
    createMut.mutate({
      type: urlForm.type, url: urlForm.url, title: urlForm.title,
      orientation: urlForm.orientation, sort_order: maxOrder + 1,
      category_id: urlForm.category_id === NO_CATEGORY ? null : urlForm.category_id,
    });
    setUrlForm({ ...urlForm, url: "", title: "" });
  }

  function addCategory() {
    const name = newCatName.trim();
    if (!name) { toast.error("Назва категорії"); return; }
    const maxOrder = categories.reduce((m: number, c: any) => Math.max(m, c.sort_order ?? 0), 0);
    createCatMut.mutate({ name, slug: slugify(name), sort_order: maxOrder + 1 });
  }

  const filtered = useMemo(() => {
    if (activeCat === "all") return items;
    if (activeCat === NO_CATEGORY) return items.filter((i: any) => !i.category_id);
    return items.filter((i: any) => i.category_id === activeCat);
  }, [items, activeCat]);

  const featuredCount = items.filter((i: any) => (i.featured_pages?.length ?? 0) > 0 || i.featured_on_home).length;

  return (
    <div>
      <h1 className="text-3xl mb-2">Галерея</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Зірочка ★ позначає медіа, які відображаються на головній або на сторінках послуг ({featuredCount} обрано).
      </p>

      {/* Categories management */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Категорії</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((c: any) => (
            <div key={c.id} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full pl-3 pr-1 py-1 text-sm">
              <span>{c.name}</span>
              <button
                type="button"
                className="ml-1 text-muted-foreground hover:text-destructive"
                onClick={() => { if (confirm(`Видалити категорію «${c.name}»? Медіа залишиться без категорії.`)) delCatMut.mutate(c.id); }}
                title="Видалити"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {categories.length === 0 && <span className="text-sm text-muted-foreground">Поки немає категорій. Медіа без категорії все одно показується в портфоліо.</span>}
        </div>
        <div className="flex gap-2">
          <Input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Назва нової категорії (напр. Кухні)"
            onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }}
          />
          <Button onClick={addCategory} type="button"><Plus className="h-4 w-4 mr-1" />Додати</Button>
        </div>
      </div>

      {/* Add media */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <Button variant={mode === "upload" ? "default" : "outline"} size="sm" onClick={() => setMode("upload")}><Upload className="h-4 w-4 mr-1" />Завантажити файл</Button>
          <Button variant={mode === "url" ? "default" : "outline"} size="sm" onClick={() => setMode("url")}><LinkIcon className="h-4 w-4 mr-1" />Додати за URL</Button>
        </div>

        {mode === "upload" ? (
          <div>
            <div className="mb-3 max-w-xs">
              <Label>Категорія для нових файлів</Label>
              <Select value={defaultCat} onValueChange={setDefaultCat}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>Без категорії</SelectItem>
                  {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Перетягніть фото або відео сюди</p>
              <p className="text-xs text-muted-foreground mt-1">або натисніть, щоб обрати файли з компʼютера</p>
              <p className="text-[11px] text-muted-foreground mt-2">Можна одразу декілька. Підтримуються JPG, PNG, WEBP, MP4, MOV.</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            {progress && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="truncate pr-2">{progress.current}</span>
                  <span>{progress.done + (uploading ? 0 : 1)} / {progress.total}</span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${((progress.done + (uploading ? 0.5 : 1)) / progress.total) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Тип</Label>
              <Select value={urlForm.type} onValueChange={(v: any) => setUrlForm({ ...urlForm, type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Зображення</SelectItem>
                  <SelectItem value="video">Відео</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Орієнтація</Label>
              <Select value={urlForm.orientation} onValueChange={(v: any) => setUrlForm({ ...urlForm, orientation: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Вертикальна</SelectItem>
                  <SelectItem value="horizontal">Горизонтальна</SelectItem>
                  <SelectItem value="square">Квадратна</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Категорія</Label>
              <Select value={urlForm.category_id} onValueChange={(v) => setUrlForm({ ...urlForm, category_id: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>Без категорії</SelectItem>
                  {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>URL</Label>
              <Input className="mt-1" value={urlForm.url} onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <Label>Назва (необовʼязково)</Label>
              <Input className="mt-1" value={urlForm.title} onChange={(e) => setUrlForm({ ...urlForm, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={addByUrl}>Додати</Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>Усі ({items.length})</FilterChip>
        <FilterChip active={activeCat === NO_CATEGORY} onClick={() => setActiveCat(NO_CATEGORY)}>
          Без категорії ({items.filter((i: any) => !i.category_id).length})
        </FilterChip>
        {categories.map((c: any) => {
          const n = items.filter((i: any) => i.category_id === c.id).length;
          return (
            <FilterChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name} ({n})
            </FilterChip>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map((it: any, i: number) => (
          <div key={it.id} className="bg-card border border-border rounded-md overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => setPreview(it)}
              className="relative aspect-[3/4] bg-muted overflow-hidden group block w-full"
              title="Переглянути"
            >
              {it.type === "video"
                ? <VideoThumb src={it.url} />
                : <img src={it.url} alt={it.title || ""} className="w-full h-full object-cover" loading="lazy" />}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-black rounded-full p-2">
                  <Play className="h-4 w-4 fill-current" />
                </div>
              </div>
              {((it.featured_pages?.length ?? 0) > 0 || it.featured_on_home) && (
                <div className="absolute top-1 left-1 bg-accent text-accent-foreground rounded-full p-1 shadow">
                  <Star className="h-3 w-3 fill-current" />
                </div>
              )}
            </button>
            <div className="p-2 flex-1 flex flex-col gap-2">
              <div className="text-xs truncate" title={it.title}>{it.title || "—"}</div>
              <div className="text-[10px] uppercase text-muted-foreground">{it.type} · {it.orientation}</div>

              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Категорія</Label>
                <Select
                  value={it.category_id ?? NO_CATEGORY}
                  onValueChange={(v) => updateMut.mutate({ id: it.id, category_id: v === NO_CATEGORY ? null : v })}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CATEGORY}>Без категорії</SelectItem>
                    {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Відображати на</Label>
                <PlacementSelect
                  value={normalizePages(it)}
                  onChange={(pages) => updateMut.mutate({
                    id: it.id,
                    featured_pages: pages,
                    featured_on_home: pages.includes("home"),
                  })}
                />
              </div>

              <div className="mt-auto flex gap-1">
                <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => move(it, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" disabled={i === filtered.length - 1} onClick={() => move(it, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { if (confirm("Видалити?")) delMut.mutate(it); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">Поки нічого немає.</div>}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black border-border">
          <DialogTitle className="sr-only">{preview?.title || "Перегляд"}</DialogTitle>
          {preview && (
            preview.type === "video"
              ? <video src={preview.url} controls autoPlay playsInline className="w-full max-h-[80vh] object-contain bg-black" />
              : <img src={preview.url} alt={preview.title || ""} className="w-full max-h-[80vh] object-contain bg-black" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
        active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function extractPath(url: string): string | undefined {
  const m = url.match(/\/api\/public\/gallery\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

async function detectOrientation(file: File, type: "image" | "video"): Promise<"vertical" | "horizontal" | "square"> {
  return new Promise((resolve) => {
    if (type === "image") {
      const img = new Image();
      img.onload = () => {
        const r = img.width / img.height;
        resolve(r > 1.15 ? "horizontal" : r < 0.85 ? "vertical" : "square");
      };
      img.onerror = () => resolve("vertical");
      img.src = URL.createObjectURL(file);
    } else {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        const r = v.videoWidth / v.videoHeight;
        resolve(r > 1.15 ? "horizontal" : r < 0.85 ? "vertical" : "square");
      };
      v.onerror = () => resolve("vertical");
      v.src = URL.createObjectURL(file);
    }
  });
}

function VideoThumb({ src }: { src: string }) {
  const [poster, setPoster] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.src = src;
    const capture = () => {
      try {
        const c = document.createElement("canvas");
        c.width = v.videoWidth || 320;
        c.height = v.videoHeight || 240;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(v, 0, 0, c.width, c.height);
        if (!cancelled) setPoster(c.toDataURL("image/jpeg", 0.7));
      } catch {
        /* ignore */
      }
    };
    const onLoaded = () => {
      try { v.currentTime = Math.min(0.1, (v.duration || 1) / 2); } catch { capture(); }
    };
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("seeked", capture);
    return () => { cancelled = true; v.removeEventListener("loadeddata", onLoaded); v.removeEventListener("seeked", capture); v.src = ""; };
  }, [src]);
  return poster
    ? <img src={poster} alt="" className="w-full h-full object-cover" />
    : <div className="w-full h-full bg-muted grid place-items-center text-[10px] text-muted-foreground">video</div>;
}

function normalizePages(it: any): string[] {
  const arr: string[] = Array.isArray(it.featured_pages) ? [...it.featured_pages] : [];
  if (it.featured_on_home && !arr.includes("home")) arr.push("home");
  return arr;
}

const PLACEMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "home", label: "Головна сторінка" },
  ...SERVICES.map((s) => ({ value: `service:${s.slug}`, label: s.shortTitle })),
];

function PlacementSelect({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string, on: boolean) => {
    const set = new Set(value);
    if (on) set.add(v); else set.delete(v);
    onChange(Array.from(set));
  };
  const labels = PLACEMENT_OPTIONS.filter((o) => value.includes(o.value)).map((o) => o.label);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="mt-1 w-full h-8 px-2 text-xs text-left border border-input bg-background rounded-md flex items-center justify-between gap-1 hover:bg-accent/10"
        >
          <span className="truncate">
            {labels.length === 0 ? <span className="text-muted-foreground">Ніде не показувати</span> : labels.join(", ")}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[60vh] overflow-y-auto">
        <DropdownMenuLabel>Де відображати</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PLACEMENT_OPTIONS.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.value}
            checked={value.includes(o.value)}
            onCheckedChange={(v) => toggle(o.value, !!v)}
            onSelect={(e) => e.preventDefault()}
          >
            {o.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
