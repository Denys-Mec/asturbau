import { useLanguage } from "@/i18n/context";
import type { Lang } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const OPTS: { code: Lang; label: string; flag: string; aria: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸", aria: "Español" },
  { code: "uk", label: "Українська", flag: "🇺🇦", aria: "Українська" },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const current = OPTS.find((o) => o.code === lang) ?? OPTS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground/90 hover:text-foreground transition-colors outline-none"
        aria-label={t("lang.switch")}
      >
        <span aria-hidden className="text-base leading-none">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTS.map((o) => {
          const active = o.code === lang;
          return (
            <DropdownMenuItem
              key={o.code}
              onClick={() => setLang(o.code)}
              className="flex cursor-pointer items-center justify-between gap-4"
              aria-label={o.aria}
            >
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="text-base leading-none">{o.flag}</span>
                <span className="text-sm">{o.label}</span>
              </span>
              {active && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
