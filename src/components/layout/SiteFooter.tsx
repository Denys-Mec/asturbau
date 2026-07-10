import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteFooter({
  phone = "+34 643 329 216",
  email = "info@asturbau.com",
}: { phone?: string; email?: string }) {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-secondary mt-auto">
      <div className="container-x py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-wide">ASTURBAU</div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("brand.tagline")}</div>
          <p className="mt-4 text-sm text-muted-foreground">{t("footer.desc")}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">{t("footer.menu")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-accent">{t("nav.home")}</Link></li>
            <li><Link to="/services" className="hover:text-accent">{t("nav.services")}</Link></li>
            <li><Link to="/gallery" className="hover:text-accent">{t("nav.gallery")}</Link></li>
            <li><Link to="/contacts" className="hover:text-accent">{t("nav.contacts")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">{t("footer.contacts")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="hover:text-accent">{email}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">{t("footer.services")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{t("footer.svc1")}</li>
            <li>{t("footer.svc2")}</li>
            <li>{t("footer.svc3")}</li>
            <li>{t("footer.svc4")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Asturbau Construcción</span>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/auth" className="hover:text-accent">{t("footer.admin")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
