import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getServices } from "@/i18n/services";
import { useLanguage } from "@/i18n/context";

export function SiteHeader({ phone = "+34 643 329 216" }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const services = getServices(lang);

  const NAV = [
    { to: "/", label: t("nav.home") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/contacts", label: t("nav.contacts") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="h-9 w-9 grid place-items-center bg-foreground text-background font-display text-lg">A</div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide text-foreground">ASTURBAU</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("brand.tagline")}</div>
          </div>
        </Link>


        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            activeProps={{ className: "text-accent" }}
            activeOptions={{ exact: true }}
          >{t("nav.home")}</Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-accent transition-colors outline-none">
              {t("nav.services")} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {services.map((s) => (
                <DropdownMenuItem key={s.slug} asChild>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="cursor-pointer">{s.shortTitle}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/gallery"
            className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            activeProps={{ className: "text-accent" }}
          >{t("nav.gallery")}</Link>
          <Link
            to="/contacts"
            className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            activeProps={{ className: "text-accent" }}
          >{t("nav.contacts")}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Phone className="h-4 w-4 text-accent" /> {phone}
          </a>
        </div>

        <div className="flex items-center md:hidden">
          <button onClick={() => setOpen((v) => !v)} aria-label={t("nav.menu")}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium"
              >{item.label}</Link>
            ))}
            <div className="py-2">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("nav.services")}</div>
              <div className="flex flex-col gap-2 pl-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setOpen(false)}
                    className="text-sm text-foreground/80"
                  >{s.shortTitle}</Link>
                ))}
              </div>
            </div>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="py-2 text-base font-medium text-accent">{phone}</a>
          </div>
        </div>
      )}
    </header>
  );
}
