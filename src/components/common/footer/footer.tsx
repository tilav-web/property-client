import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Send, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { logo } from "@/utils/shared";
import { COUNTRY_CONFIG } from "@/constants/country";
import { useQuery } from "@tanstack/react-query";
import { siteSettingsService } from "@/services/site-settings.service";

const FALLBACK_PHONES =
  COUNTRY_CONFIG.country === "UZ"
    ? ["+998 90 123 45 67"]
    : ["+60 113 902 9480", "+971 56 291 1117"];

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => siteSettingsService.get(),
    staleTime: 1000 * 60 * 5,
  });

  const footerPhones = (
    siteSettings?.contact_phones?.length
      ? siteSettings.contact_phones
      : FALLBACK_PHONES
  ).map((label) => ({ label, href: `tel:${label.replace(/\s/g, "")}` }));

  return (
    <footer className="bg-foreground text-background/80 mt-12">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Contact */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt={COUNTRY_CONFIG.brandName}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              {t("common.footer.description")}
            </p>
            <div className="space-y-3 pt-2">
              {footerPhones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="flex items-center gap-3 text-sm text-background/70 hover:text-primary transition-colors"
                >
                  <span className="flex items-center justify-center size-8 rounded-full bg-background/5">
                    <Phone size={14} />
                  </span>
                  <span>{p.label}</span>
                </a>
              ))}
              <a
                href="mailto:info@amaarproperties.com"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-primary transition-colors"
              >
                <span className="flex items-center justify-center size-8 rounded-full bg-background/5">
                  <Mail size={14} />
                </span>
                <span>info@amaarproperties.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg text-background mb-5">
              {t("common.footer.quick_links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/filter-nav?category=APARTMENT_SALE"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.buy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/filter-nav?category=APARTMENT_RENT"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.rent_apartments")}
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.new_projects")}
                </Link>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("pages.developers.title", "Developers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.map_nav", "Map")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-lg text-background mb-5">
              {t("common.footer.company")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.footer.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.footer.terms_of_service")}
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-chat"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {t("common.ai_chat", "AI Assistant")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices & Social */}
          <div>
            <h3 className="font-display text-lg text-background mb-5">
              {t("common.footer.offices")}
            </h3>
            <div className="space-y-4 mb-7">
              <div className="flex items-start gap-3 text-sm text-background/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>{t("common.footer.office_malaysia")}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-background/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>{t("common.footer.office_uae")}</span>
              </div>
            </div>

            <h3 className="font-display text-lg text-background mb-4">
              {t("common.footer.follow_us")}
            </h3>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="size-10 bg-background/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="size-10 bg-background/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="size-10 bg-background/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Send size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/50">
            &copy; {currentYear} {COUNTRY_CONFIG.brandName}. {t("common.footer.all_rights_reserved")}
          </p>
          <p className="text-xs text-background/40">
            {t("common.footer.made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
