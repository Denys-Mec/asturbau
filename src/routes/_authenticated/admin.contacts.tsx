import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/content.functions";
import { updateContent } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  component: ContactsEditor,
});

function ContactsEditor() {
  const get = useServerFn(getSiteContent);
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_content"], queryFn: () => get() });
  const [form, setForm] = useState<any>(null);
  const [activeLangTab, setActiveLangTab] = useState<"es" | "uk">("es");

  useEffect(() => {
    if (data?.contacts) {
      const isLegacy = !data.contacts.es && !data.contacts.uk;
      if (isLegacy) {
        setForm({
          phone: data.contacts.phone || "",
          email: data.contacts.email || "",
          es: {
            company: data.contacts.company || "",
            address: data.contacts.address || "",
            hours: data.contacts.hours || "",
            tagline: data.contacts.tagline || "",
          },
          uk: {
            company: data.contacts.company || "",
            address: data.contacts.address || "",
            hours: data.contacts.hours || "",
            tagline: data.contacts.tagline || "",
          }
        });
      } else {
        setForm({
          phone: data.contacts.phone || "",
          email: data.contacts.email || "",
          es: data.contacts.es || {},
          uk: data.contacts.uk || {},
        });
      }
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => upd({ data: { key: "contacts", value: form } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_content"] }); toast.success("Збережено"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });

  if (isLoading || !form) return <div className="text-muted-foreground">Завантаження...</div>;

  const l = form[activeLangTab] || {};
  const setGlobal = (k: string, v: any) => setForm({ ...form, [k]: v });
  const setLocal = (k: string, v: any) => {
    setForm({
      ...form,
      [activeLangTab]: {
        ...l,
        [k]: v
      }
    });
  };

  return (
    <div className="max-w-2xl bg-background border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display tracking-wide">Контакти</h1>
        <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm">
          {save.isPending ? "Збереження..." : "Зберегти"}
        </Button>
      </div>

      {/* Global Fields */}
      <div className="bg-card border border-border rounded-lg p-5 grid gap-4 mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Загальні контакти (однакові для всіх мов)</h2>
        <Row label="Телефон" v={form.phone} onChange={(v) => setGlobal("phone", v)} />
        <Row label="Email" v={form.email} onChange={(v) => setGlobal("email", v)} />
      </div>

      {/* Localized Fields */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Локалізовані контакти</h2>

        {/* Lang switch */}
        <div className="flex gap-2 border-b border-border pb-px mb-5">
          <button
            type="button"
            onClick={() => setActiveLangTab("es")}
            className={`px-4 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeLangTab === "es"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Іспанська (ES)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab("uk")}
            className={`px-4 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeLangTab === "uk"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Українська (UK)
          </button>
        </div>

        <div className="grid gap-4">
          <Row label="Компанія" v={l.company} onChange={(v) => setLocal("company", v)} />
          <Row label="Адреса" v={l.address} onChange={(v) => setLocal("address", v)} />
          <Row label="Графік роботи" v={l.hours} onChange={(v) => setLocal("hours", v)} />
          <Row label="Tagline (короткий слоган)" v={l.tagline} onChange={(v) => setLocal("tagline", v)} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant">
          {save.isPending ? "Збереження..." : "Зберегти"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" value={v || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
