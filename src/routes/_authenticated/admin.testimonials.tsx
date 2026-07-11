import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/content.functions";
import { updateContent } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Star } from "lucide-react";

const DEFAULT_TESTIMONIALS_ES = [
  { name: "Marta G.", text: "El equipo terminó la reforma del piso a tiempo y con una calidad impecable. ¡Gracias por su profesionalidad!", rating: 5 },
  { name: "Carlos R.", text: "La reconstrucción del restaurante se hizo sin sobresaltos. Presupuesto transparente, trabajo cuidadoso — recomiendo.", rating: 5 },
  { name: "Olena P.", text: "Honestidad y responsabilidad — así es Asturbau. Volveremos a trabajar juntos.", rating: 5 },
];

const DEFAULT_TESTIMONIALS_UK = [
  { name: "Марта Г.", text: "Команда закінчила ремонт квартири вчасно та з бездоганною якістю. Дякуємо за професіоналізм!", rating: 5 },
  { name: "Карлос Р.", text: "Реконструкція ресторану пройшла без жодних проблем. Прозорий кошторис, акуратна робота — рекомендую.", rating: 5 },
  { name: "Олена П.", text: "Чесність та відповідальність — це про Asturbau. Обов'язково будемо співпрацювати знову.", rating: 5 },
];

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: TestimonialsEditor,
});

function TestimonialsEditor() {
  const get = useServerFn(getSiteContent);
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_content"], queryFn: () => get() });

  const [form, setForm] = useState<any>(null);
  const [activeLangTab, setActiveLangTab] = useState<"es" | "uk">("es");

  useEffect(() => {
    if (data?.home) {
      const isLegacy = !data.home.es && !data.home.uk;
      let esData = isLegacy ? { ...data.home } : (data.home.es || {});
      let ukData = isLegacy ? { ...data.home } : (data.home.uk || {});

      if (!esData.testimonials) esData.testimonials = DEFAULT_TESTIMONIALS_ES;
      if (!ukData.testimonials) ukData.testimonials = DEFAULT_TESTIMONIALS_UK;

      setForm({
        es: {
          testimonials: esData.testimonials || [],
          google_business_link: esData.google_business_link || "",
          google_review_link: esData.google_review_link || "",
        },
        uk: {
          testimonials: ukData.testimonials || [],
          google_business_link: ukData.google_business_link || "",
          google_review_link: ukData.google_review_link || "",
        }
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => {
      // Merge reviews and google links back into the full home page content object
      const updatedHome = {
        ...data.home,
        es: {
          ...(data.home?.es || {}),
          testimonials: form.es.testimonials,
          google_business_link: form.es.google_business_link,
          google_review_link: form.es.google_review_link,
        },
        uk: {
          ...(data.home?.uk || {}),
          testimonials: form.uk.testimonials,
          google_business_link: form.uk.google_business_link,
          google_review_link: form.uk.google_review_link,
        }
      };
      return upd({ data: { key: "home", value: updatedHome } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_content"] }); toast.success("Збережено"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });

  if (isLoading || !form) return <div className="text-muted-foreground">Завантаження...</div>;

  const l = form[activeLangTab] || { testimonials: [], google_business_link: "", google_review_link: "" };
  const set = (k: string, v: any) => {
    setForm({
      ...form,
      [activeLangTab]: {
        ...l,
        [k]: v
      }
    });
  };

  return (
    <div className="max-w-4xl bg-background border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display tracking-wide">Відгуки клієнтів</h1>
      </div>

      {/* Lang Switch */}
      <div className="flex gap-2 border-b border-border pb-px mb-6">
        <button
          type="button"
          onClick={() => setActiveLangTab("es")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeLangTab === "es"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Іспанська (ES)
        </button>
        <button
          type="button"
          onClick={() => setActiveLangTab("uk")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeLangTab === "uk"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Українська (UK)
        </button>
      </div>

      <div className="grid gap-6">
        {/* Google Business Connection */}
        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Зв'язок з google мій бізнес</h2>
          <p className="text-sm text-muted-foreground">
            Введіть посилання на ваш профіль Google Maps та форму написання відгуків, щоб підключити віджет на сайті.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Посилання на Google Business Profile (Maps)"
              value={l.google_business_link || ""}
              onChange={(v) => set("google_business_link", v)}
              placeholder="https://maps.google.com/?cid=..."
            />
            <Field
              label="Посилання для написання відгуку (Google Review Link)"
              value={l.google_review_link || ""}
              onChange={(v) => set("google_review_link", v)}
              placeholder="https://search.google.com/local/writereview?placeid=..."
            />
          </div>
        </div>

        {/* Local Testimonials List */}
        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Список відгуків на сайті</h2>
          <ArrayEditor
            label=""
            items={l.testimonials || []}
            onChange={(v) => set("testimonials", v)}
            renderItem={(item, ch) => (
              <div className="grid gap-3 flex-1">
                <div className="grid sm:grid-cols-3 gap-2 items-center">
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Ім'я клієнта</Label>
                    <Input placeholder="Ім'я" value={item.name || ""} onChange={(e) => ch({ ...item, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Оцінка</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                      value={String(item.rating ?? 5)}
                      onChange={(e) => ch({ ...item, rating: Number(e.target.value) })}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option value="4">⭐⭐⭐⭐ (4)</option>
                      <option value="3">⭐⭐⭐ (3)</option>
                      <option value="2">⭐⭐ (2)</option>
                      <option value="1">⭐ (1)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Текст відгуку</Label>
                  <Textarea placeholder="Текст відгуку" value={item.text || ""} onChange={(e) => ch({ ...item, text: e.target.value })} rows={2} className="mt-1" />
                </div>
              </div>
            )}
            newItem={() => ({ name: "", text: "", rating: 5 })}
          />
        </div>
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant">
          {save.isPending ? "Збереження..." : "Зберегти всі зміни"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      {multiline
        ? <Textarea className="mt-1" rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
        : <Input className="mt-1" value={value || ""} onChange={(e) => onChange(e.target.value)} />}
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
      {label && <Label>{label}</Label>}
      <div className="mt-2 grid gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start border border-border bg-muted/10 p-3 rounded-lg">
            <div className="flex-1">{renderItem(it, (v) => { const arr = [...items]; arr[i] = v; onChange(arr); })}</div>
            <Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])} className="mt-2 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" /> Додати відгук
        </Button>
      </div>
    </div>
  );
}
