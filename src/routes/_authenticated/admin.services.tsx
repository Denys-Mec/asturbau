import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { siteContentQuery } from "@/lib/content.functions";
import { updateContent } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, ArrowUp, ArrowDown, ArrowLeft, Save, Sparkles } from "lucide-react";
import { RAW, type RawService } from "@/i18n/services";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const get = useServerFn(() => Promise.resolve()); // dummy for query hydration
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(siteContentQuery);

  const [services, setServices] = useState<RawService[] | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<"es" | "uk">("es");

  useEffect(() => {
    if (data) {
      setServices(data.services || RAW);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => upd({ data: { key: "services", value: services } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_content"] });
      toast.success("Всі послуги успішно збережено в базі даних!");
    },
    onError: (e: any) => toast.error(e?.message || "Помилка при збереженні"),
  });

  if (isLoading || !services) return <div className="text-muted-foreground p-6">Завантаження послуг...</div>;

  const handleMove = (index: number, dir: "up" | "down") => {
    const nextIndex = dir === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= services.length) return;
    const list = [...services];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;
    setServices(list);
  };

  const handleDelete = (index: number) => {
    if (confirm("Ви впевнені, що хочете видалити цю послугу?")) {
      setServices(services.filter((_, i) => i !== index));
      if (editingIndex === index) setEditingIndex(null);
      else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
    }
  };

  const handleAdd = () => {
    const newService: RawService = {
      slug: `nova-posluha-${Date.now()}`,
      image: "",
      es: {
        shortTitle: "Nuevo servicio",
        title: "Nuevo servicio de reformas",
        shortDesc: "Descripción corta en español.",
        desc: "Descripción larga detallada en español.",
        features: ["Característica 1", "Característica 2"],
        includes: [
          { title: "Fase 1", items: ["Trabajo A", "Trabajo B"] }
        ]
      },
      uk: {
        shortTitle: "Нова послуга",
        title: "Нова послуга з ремонту",
        shortDesc: "Короткий опис українською мовою.",
        desc: "Детальний довгий опис українською мовою.",
        features: ["Перевага 1", "Перевага 2"],
        includes: [
          { title: "Етап 1", items: ["Робота А", "Робота Б"] }
        ]
      }
    };
    setServices([...services, newService]);
    setEditingIndex(services.length);
  };

  const updateEditingService = (field: keyof RawService | "es" | "uk", value: any, subfield?: string) => {
    if (editingIndex === null) return;
    const list = [...services];
    const s = { ...list[editingIndex] };

    if (field === "es" || field === "uk") {
      s[field] = { ...s[field], [subfield!]: value };
    } else {
      (s as any)[field] = value;
    }

    list[editingIndex] = s;
    setServices(list);
  };

  if (editingIndex !== null) {
    const s = services[editingIndex];
    const l = s[activeLangTab];

    return (
      <div className="max-w-4xl bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setEditingIndex(null)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Назад до списку
          </Button>
          <div className="text-sm text-muted-foreground font-medium">Редагування послуги: {s.slug}</div>
        </div>

        {/* Global properties */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Slug (URL ідентифікатор)</Label>
            <Input
              value={s.slug}
              onChange={(e) => updateEditingService("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g. remont-vannykh-ta-plytka"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Посилання на зображення (URL або шлях до asset)</Label>
            <Input
              value={s.image}
              onChange={(e) => updateEditingService("image", e.target.value)}
              placeholder="e.g. /src/assets/collage-bathroom.jpg або HTTPS посилання"
              className="mt-1"
            />
          </div>
        </div>

        {/* Lang switch */}
        <div className="flex gap-2 border-b border-border pb-px mb-6">
          <button
            type="button"
            onClick={() => setActiveLangTab("es")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeLangTab === "es"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Іспанська версія (ES)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab("uk")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeLangTab === "uk"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Українська версія (UK)
          </button>
        </div>

        {/* Localized inputs */}
        <div className="grid gap-5">
          <div>
            <Label>Короткий заголовок (для меню/навігації)</Label>
            <Input
              value={l.shortTitle}
              onChange={(e) => updateEditingService(activeLangTab, e.target.value, "shortTitle")}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Повний заголовок сторінки</Label>
            <Input
              value={l.title}
              onChange={(e) => updateEditingService(activeLangTab, e.target.value, "title")}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Короткий опис (для списків)</Label>
            <Input
              value={l.shortDesc}
              onChange={(e) => updateEditingService(activeLangTab, e.target.value, "shortDesc")}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Повний детальний опис (підтримує переноси рядків)</Label>
            <Textarea
              rows={8}
              value={l.desc}
              onChange={(e) => updateEditingService(activeLangTab, e.target.value, "desc")}
              className="mt-1"
            />
          </div>

          {/* Features Editor */}
          <div className="border border-border/80 rounded-lg p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-3">Особливості / Ключові переваги</h3>
            <ArrayEditor
              label=""
              items={l.features || []}
              onChange={(v) => updateEditingService(activeLangTab, v, "features")}
              renderItem={(item, ch) => (
                <Input value={item} onChange={(e) => ch(e.target.value)} placeholder="Перевага" />
              )}
              newItem={() => ""}
            />
          </div>

          {/* Includes Editor */}
          <div className="border border-border/80 rounded-lg p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-3">Що входить у вартість (Етапи робіт)</h3>
            <ArrayEditor
              label=""
              items={l.includes || []}
              onChange={(v) => updateEditingService(activeLangTab, v, "includes")}
              renderItem={(block, ch) => (
                <div className="border border-border bg-background p-4 rounded-md w-full grid gap-3">
                  <div>
                    <Label className="text-xs">Назва етапу (e.g. Fase técnica / Початковий етап)</Label>
                    <Input
                      value={block.title}
                      onChange={(e) => ch({ ...block, title: e.target.value })}
                      placeholder="Назва блоку"
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Список робіт</Label>
                    <ArrayEditor
                      label=""
                      items={block.items || []}
                      onChange={(it) => ch({ ...block, items: it })}
                      renderItem={(sub, subch) => (
                        <Input value={sub} onChange={(e) => subch(e.target.value)} placeholder="Робота/послуга" className="h-8" />
                      )}
                      newItem={() => ""}
                    />
                  </div>
                </div>
              )}
              newItem={() => ({ title: "Новий етап", items: [] })}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={() => setEditingIndex(null)}>
            Назад до списку
          </Button>
          <Button onClick={() => setEditingIndex(null)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Завершити редагування
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display tracking-wide">Управління послугами</h1>
          <p className="text-sm text-muted-foreground mt-1">Додавайте, видаляйте або редагуйте повний контент сторінок послуг</p>
        </div>
        <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1 shadow-sm">
          <Plus className="h-4 w-4" /> Додати послугу
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Порядок</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Назва (ES)</th>
              <th className="p-4">Назва (UK)</th>
              <th className="p-4 text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {services.map((s, i) => (
              <tr key={s.slug} className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleMove(i, "up")}
                      disabled={i === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleMove(i, "down")}
                      disabled={i === services.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs max-w-[120px] truncate">{s.slug}</td>
                <td className="p-4 text-sm font-medium">{s.es.shortTitle}</td>
                <td className="p-4 text-sm">{s.uk.shortTitle}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="outline" size="sm" onClick={() => setEditingIndex(i)}>
                      Редагувати
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDelete(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-between items-center bg-background/80 backdrop-blur-md p-4 border border-border rounded-lg shadow-elegant">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent" /> Зміни зберігаються локально. Натисніть кнопку праворуч для публікації на сайті.
        </div>
        <Button
          size="lg"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 shadow-elegant"
        >
          <Save className="h-4 w-4" />
          {save.isPending ? "Збереження..." : "Опублікувати всі послуги"}
        </Button>
      </div>
    </div>
  );
}

function ArrayEditor<T>({ label, items, onChange, renderItem, newItem }: {
  label: string;
  items: T[];
  onChange: (v: T[]) => void;
  renderItem: (item: T, change: (v: T) => void) => React.ReactNode;
  newItem: () => T;
}) {
  return (
    <div>
      {label && <Label className="text-xs">{label}</Label>}
      <div className="mt-1 grid gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start w-full">
            <div className="flex-1 w-full">{renderItem(it, (v) => { const arr = [...items]; arr[i] = v; onChange(arr); })}</div>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="xs" className="h-7 text-xs inline-flex items-center w-fit px-2 mt-1" onClick={() => onChange([...items, newItem()])}>
          <Plus className="h-3 w-3 mr-1" /> Додати
        </Button>
      </div>
    </div>
  );
}
