import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListRecipients,
  adminAddRecipient,
  adminUpdateRecipient,
  adminDeleteRecipient,
  adminGetBotPassword,
  adminSetBotPassword,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const listFn = useServerFn(adminListRecipients);
  const addFn = useServerFn(adminAddRecipient);
  const updFn = useServerFn(adminUpdateRecipient);
  const delFn = useServerFn(adminDeleteRecipient);
  const getPwd = useServerFn(adminGetBotPassword);
  const setPwd = useServerFn(adminSetBotPassword);
  const qc = useQueryClient();

  const { data: recipients = [], isLoading } = useQuery({
    queryKey: ["recipients"],
    queryFn: () => listFn(),
  });
  const { data: pwdData } = useQuery({
    queryKey: ["bot_password"],
    queryFn: () => getPwd(),
  });

  const [newChat, setNewChat] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [pwdInput, setPwdInput] = useState("");

  const addMut = useMutation({
    mutationFn: () => addFn({ data: { chat_id: Number(newChat), name: newName, phone: newPhone } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recipients"] });
      setNewChat(""); setNewName(""); setNewPhone("");
      toast.success("Додано");
    },
    onError: (e: any) => toast.error(e?.message ?? "Помилка"),
  });
  const updMut = useMutation({
    mutationFn: (v: { id: string; active?: boolean; name?: string; phone?: string }) => updFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipients"] }),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["recipients"] }); toast.success("Видалено"); },
  });
  const pwdMut = useMutation({
    mutationFn: (password: string) => setPwd({ data: { password } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bot_password"] }); setPwdInput(""); toast.success("Пароль оновлено"); },
    onError: (e: any) => toast.error(e?.message ?? "Помилка"),
  });

  function generatePwd() {
    const chars = "abcdefghijkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 8; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPwdInput(p);
  }

  const currentPwd = pwdData?.password ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Сповіщення в Telegram</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Користувачі пишуть боту кодове слово — і автоматично починають отримувати сповіщення про нові заявки.
        </p>
      </div>

      {/* Bot password */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-medium">Кодове слово для бота</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Поточне слово показано нижче. Передайте його людині — вона має написати боту це слово, і її буде підписано.
          Повідомлення з паролем бот видалить автоматично.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="px-4 py-2 bg-muted rounded font-mono text-lg select-all flex-1">
            {currentPwd || "—"}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => { navigator.clipboard.writeText(currentPwd); toast.success("Скопійовано"); }}
            disabled={!currentPwd}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Input
            value={pwdInput}
            onChange={(e) => setPwdInput(e.target.value)}
            placeholder="Нове кодове слово (мін. 3 символи)"
            maxLength={100}
          />
          <Button type="button" variant="outline" onClick={generatePwd}>
            <RefreshCw className="h-4 w-4 mr-1" /> Згенерувати
          </Button>
          <Button onClick={() => pwdMut.mutate(pwdInput)} disabled={pwdInput.trim().length < 3 || pwdMut.isPending}>
            Зберегти
          </Button>
        </div>
      </section>

      {/* Recipients */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-medium">Отримувачі</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Список Telegram-чатів, куди йдуть сповіщення про нові заявки. Можна додати вручну, якщо знаєте chat_id.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-[140px_1fr_160px_auto] gap-2">
          <Input value={newChat} onChange={(e) => setNewChat(e.target.value)} placeholder="chat_id" />
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Імʼя" />
          <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Телефон (опц.)" />
          <Button onClick={() => addMut.mutate()} disabled={!newChat || addMut.isPending}>Додати</Button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="text-muted-foreground">Завантаження...</div>
          ) : recipients.length === 0 ? (
            <div className="text-muted-foreground text-sm py-6 text-center border border-dashed border-border rounded">
              Поки порожньо. Передайте кодове слово людині або додайте chat_id вручну.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Імʼя</th>
                  <th className="text-left py-2">Chat ID</th>
                  <th className="text-left py-2">Телефон</th>
                  <th className="text-left py-2">Активний</th>
                  <th className="text-left py-2">Додано</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r: any) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-3">{r.name || "—"}</td>
                    <td className="py-3 font-mono text-xs">{r.chat_id}</td>
                    <td className="py-3">{r.phone || "—"}</td>
                    <td className="py-3">
                      <Switch
                        checked={r.active}
                        onCheckedChange={(v) => updMut.mutate({ id: r.id, active: v })}
                      />
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("uk-UA")}</td>
                    <td className="py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Видалити?")) delMut.mutate(r.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
