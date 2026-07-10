import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listLeads, updateLeadStatus, deleteLead } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: LeadsPage,
});

const STATUSES = [
  { value: "new", label: "Нова", color: "default" as const },
  { value: "in_progress", label: "В роботі", color: "secondary" as const },
  { value: "done", label: "Виконано", color: "outline" as const },
  { value: "archived", label: "Архів", color: "outline" as const },
];

function LeadsPage() {
  const list = useServerFn(listLeads);
  const update = useServerFn(updateLeadStatus);
  const del = useServerFn(deleteLead);
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: () => list() });
  const updateMut = useMutation({
    mutationFn: (v: { id: string; status: any }) => update({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Оновлено"); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Видалено"); },
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl">Заявки</h1>
          <p className="text-sm text-muted-foreground mt-1">Усього: {leads.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Завантаження...</div>
      ) : leads.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground rounded-lg">Заявок поки немає</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Дата</th>
                <th className="text-left px-4 py-3">Імʼя</th>
                <th className="text-left px-4 py-3">Телефон</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Повідомлення</th>
                <th className="text-left px-4 py-3">Джерело</th>
                <th className="text-left px-4 py-3">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l: any) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">{new Date(l.created_at).toLocaleString("uk-UA")}</td>
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-accent hover:underline">{l.phone}</a></td>
                  <td className="px-4 py-3">{l.email ? <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a> : "—"}</td>
                  <td className="px-4 py-3 max-w-xs whitespace-pre-wrap">{l.message || "—"}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{l.source || "—"}</Badge></td>
                  <td className="px-4 py-3">
                    <Select value={l.status} onValueChange={(v) => updateMut.mutate({ id: l.id, status: v })}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Видалити заявку?")) delMut.mutate(l.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
