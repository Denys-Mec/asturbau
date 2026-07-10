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
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentEditor,
});

function ContentEditor() {
  const get = useServerFn(getSiteContent);
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_content"], queryFn: () => get() });

  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (data?.home) setForm(data.home); }, [data]);

  const save = useMutation({
    mutationFn: () => upd({ data: { key: "home", value: form } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_content"] }); toast.success("Збережено"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });

  if (isLoading || !form) return <div className="text-muted-foreground">Завантаження...</div>;

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl mb-6">Головна сторінка</h1>

      <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
        <h2 className="text-xl">Hero</h2>
        <Field label="Заголовок" value={form.hero_title} onChange={(v) => set("hero_title", v)} />
        <Field label="Підзаголовок" value={form.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} multiline />
        <Field label="Текст кнопки" value={form.hero_cta} onChange={(v) => set("hero_cta", v)} />
      </div>

      <div className="bg-card border border-border rounded-lg p-6 grid gap-4 mt-6">
        <h2 className="text-xl">Про нас</h2>
        <Field label="Заголовок" value={form.about_title} onChange={(v) => set("about_title", v)} />
        <Field label="Текст" value={form.about_text} onChange={(v) => set("about_text", v)} multiline rows={6} />
        <ArrayEditor label="Переваги" items={form.advantages || []} onChange={(v) => set("advantages", v)} renderItem={(item, ch) => <Input value={item} onChange={(e) => ch(e.target.value)} />} newItem={() => ""} />
      </div>

      <div className="bg-card border border-border rounded-lg p-6 grid gap-4 mt-6">
        <h2 className="text-xl">Послуги</h2>
        <ArrayEditor
          label=""
          items={form.services || []}
          onChange={(v) => set("services", v)}
          renderItem={(item, ch) => (
            <div className="grid sm:grid-cols-2 gap-2 flex-1">
              <Input placeholder="Назва" value={item.title} onChange={(e) => ch({ ...item, title: e.target.value })} />
              <Input placeholder="Опис" value={item.desc} onChange={(e) => ch({ ...item, desc: e.target.value })} />
            </div>
          )}
          newItem={() => ({ title: "", desc: "" })}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6 grid gap-4 mt-6">
        <h2 className="text-xl">Процес</h2>
        <ArrayEditor
          label=""
          items={form.process || []}
          onChange={(v) => set("process", v)}
          renderItem={(item, ch) => (
            <div className="grid sm:grid-cols-3 gap-2 flex-1">
              <Input placeholder="Крок" value={item.step} onChange={(e) => ch({ ...item, step: e.target.value })} />
              <Input placeholder="Назва" value={item.title} onChange={(e) => ch({ ...item, title: e.target.value })} />
              <Input placeholder="Опис" value={item.desc} onChange={(e) => ch({ ...item, desc: e.target.value })} />
            </div>
          )}
          newItem={() => ({ step: "", title: "", desc: "" })}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6 grid gap-4 mt-6">
        <h2 className="text-xl">Чому обирають нас?</h2>
        <Field label="Заголовок" value={form.values_title} onChange={(v) => set("values_title", v)} />
        <Field label="Текст" value={form.values_text} onChange={(v) => set("values_text", v)} multiline rows={4} />
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
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">{renderItem(it, (v) => { const arr = [...items]; arr[i] = v; onChange(arr); })}</div>
            <Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}>
          <Plus className="h-4 w-4 mr-1" /> Додати
        </Button>
      </div>
    </div>
  );
}
