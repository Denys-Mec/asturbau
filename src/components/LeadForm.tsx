import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { submitLead } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/context";

export function LeadForm({ source = "website", compact = false }: { source?: string; compact?: boolean }) {
  const { t } = useLanguage();
  const submit = useServerFn(submitLead);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, t("form.err.name")).max(100),
    phone: z.string().trim().min(3, t("form.err.phone")).max(30),
    email: z.string().trim().email(t("form.err.email")).max(255).optional().or(z.literal("")),
    message: z.string().max(2000).optional(),
  });

  const mut = useMutation({
    mutationFn: async (data: any) => submit({ data }),
    onSuccess: () => {
      toast.success(t("form.toast.ok"));
      setDone(true);
    },
    onError: (e: any) => toast.error(e?.message || t("form.toast.err")),
  });

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h3 className="text-xl">{t("form.thanks.title")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("form.thanks.text")}</p>
        <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>{t("form.thanks.again")}</Button>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    mut.mutate({ ...parsed.data, source });
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "grid gap-3" : "grid gap-4"}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="name">{t("form.name")}</Label>
          <Input id="name" name="name" required maxLength={100} className="mt-1 bg-background" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input id="phone" name="phone" required maxLength={30} placeholder="+34 ..." className="mt-1 bg-background" />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="email">{t("form.email")}</Label>
        <Input id="email" name="email" type="email" maxLength={255} className="mt-1 bg-background" />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="message">{t("form.message")}</Label>
        <Textarea id="message" name="message" rows={compact ? 3 : 5} maxLength={2000} className="mt-1 bg-background" placeholder={t("form.messagePh")} />
      </div>
      <Button type="submit" size="lg" disabled={mut.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
        {mut.isPending ? t("form.submitting") : t("form.submit")}
      </Button>
      <p className="text-xs text-muted-foreground">{t("form.consent")}</p>
    </form>
  );
}
