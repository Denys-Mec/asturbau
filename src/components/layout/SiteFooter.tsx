import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteFooter({
  phone = "+34 643 329 216",
  email = "info@asturbau.com",
}: { phone?: string; email?: string }) {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#181818] text-white rounded-t-[2rem] md:rounded-t-[3rem] mt-auto border-t border-white/5 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
      <div className="container-x py-16 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-3xl tracking-wider text-accent">ASTURBAU</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-1 font-semibold">{t("brand.tagline")}</div>
          <p className="mt-5 text-sm text-white/60 leading-relaxed">{t("footer.desc")}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">{t("footer.menu")}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/" className="hover:text-accent transition-colors">{t("nav.home")}</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">{t("nav.services")}</Link></li>
            <li><Link to="/gallery" className="hover:text-accent transition-colors">{t("nav.gallery")}</Link></li>
            <li><Link to="/contacts" className="hover:text-accent transition-colors">{t("nav.contacts")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">{t("footer.contacts")}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent transition-colors">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="hover:text-accent transition-colors break-all">{email}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">{t("footer.services")}</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>{t("footer.svc1")}</li>
            <li>{t("footer.svc2")}</li>
            <li>{t("footer.svc3")}</li>
            <li>{t("footer.svc4")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x py-6 text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Asturbau — Reformas y Construcción</span>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link to="/auth" className="hover:text-accent transition-colors">{t("footer.admin")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
