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
  useEffect(() => { if (data?.contacts) setForm(data.contacts); }, [data]);

  const save = useMutation({
    mutationFn: () => upd({ data: { key: "contacts", value: form } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_content"] }); toast.success("Збережено"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });

  if (isLoading || !form) return <div className="text-muted-foreground">Завантаження...</div>;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl mb-6">Контакти</h1>
      <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
        <Row label="Компанія" v={form.company} onChange={(v) => set("company", v)} />
        <Row label="Телефон" v={form.phone} onChange={(v) => set("phone", v)} />
        <Row label="Email" v={form.email} onChange={(v) => set("email", v)} />
        <Row label="Адреса" v={form.address} onChange={(v) => set("address", v)} />
        <Row label="Графік" v={form.hours} onChange={(v) => set("hours", v)} />
        <Row label="Tagline" v={form.tagline} onChange={(v) => set("tagline", v)} />
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
