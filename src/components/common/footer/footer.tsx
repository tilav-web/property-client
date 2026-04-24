import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Send, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { logo } from "@/utils/shared";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Contact */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <img
                src={logo}
                alt="Amaar Properties"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              {t("common.footer.description")}
            </p>
            <div className="space-y-3">
              <a
                href="tel:+601139029480"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Phone size={16} />
                <span>+60 113 902 9480</span>
              </a>
              <a
                href="tel:+971562911117"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Phone size={16} />
                <span>+971 56 291 1117</span>
              </a>
              <a
                href="mailto:info@amaarproperties.com"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Mail size={16} />
                <span>info@amaarproperties.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              {t("common.footer.quick_links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/filter-nav?category=APARTMENT_SALE"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.buy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/filter-nav?category=APARTMENT_RENT"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.rent_apartments")}
                </Link>
              </li>
              <li>
                <Link
                  to="/filter-nav?is_new=1"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.new_projects")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              {t("common.footer.company")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.footer.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("common.footer.terms_of_service")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices & Social */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              {t("common.footer.offices")}
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{t("common.footer.office_malaysia")}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{t("common.footer.office_uae")}</span>
              </div>
            </div>

            <h3 className="text-white font-semibold mb-4">
              {t("common.footer.follow_us")}
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors"
              >
                <Send size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Amaar Properties. {t("common.footer.all_rights_reserved")}
          </p>
          <p className="text-xs text-gray-600">
            {t("common.footer.made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
