import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Settings as SettingsIcon,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import {
  CURRENCIES,
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from "@/constants/currencies";
import { useCurrencyStore } from "@/stores/currency.store";
import { useLanguageStore } from "@/stores/language.store";
import { useUserStore } from "@/stores/user.store";
import { userService } from "@/services/user.service";
import type { ILanguage } from "@/interfaces/language/language.interface";
import { ensureLanguageResources } from "@/i18n/i18n";
import BackButton from "@/components/common/buttons/back-button";

const LANGUAGES: { code: ILanguage; label: string }[] = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "ms", label: "Bahasa Melayu" },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUserStore();
  const { display, setDisplay } = useCurrencyStore();
  const { setLanguage } = useLanguageStore();

  // Account state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("pages.settings.errors.password_mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("pages.settings.errors.password_too_short"));
      return;
    }
    setSubmitting(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      toast.success(t("pages.settings.success.password_changed"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("pages.settings.errors.generic");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageChange = async (lan: ILanguage) => {
    try {
      if (user) {
        const backendLan = lan === "ms" ? "en" : lan;
        const formData = new FormData();
        formData.append("lan", backendLan);
        const data = await userService.update(formData);
        setUser(data);
      }
      setLanguage(lan);
      await ensureLanguageResources(lan);
      await i18n.changeLanguage(lan);
      toast.success(t("pages.settings.success.preferences_updated"));
    } catch (err) {
      console.error(err);
      toast.error(t("pages.settings.errors.generic"));
    }
  };

  const handleCurrencyChange = (code: CurrencyCode) => {
    setDisplay(code);
    toast.success(t("pages.settings.success.preferences_updated"));
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <BackButton className="mb-4" />

      <div className="mb-6 flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("pages.settings.title", "Settings")}
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "pages.settings.subtitle",
              "Manage your account and display preferences",
            )}
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="account" className="gap-2">
            <Lock size={14} />
            {t("pages.settings.tabs.account", "Account")}
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Sliders size={14} />
            {t("pages.settings.tabs.display", "Display")}
          </TabsTrigger>
        </TabsList>

        {/* ACCOUNT TAB */}
        <TabsContent value="account">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              {t("pages.settings.password.title", "Change password")}
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              {t(
                "pages.settings.password.subtitle",
                "Use a strong password (at least 6 characters)",
              )}
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label className="mb-1 block">
                  {t("pages.settings.password.current", "Current password")}
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle visibility"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-1 block">
                  {t("pages.settings.password.new", "New password")}
                </Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle visibility"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-1 block">
                  {t(
                    "pages.settings.password.confirm",
                    "Confirm new password",
                  )}
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("pages.settings.password.save", "Update password")}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              {t("pages.settings.account.contact", "Contact information")}
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              {t(
                "pages.settings.account.contact_hint",
                "Verified channels for login and notifications",
              )}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-gray-500">
                  {t("pages.settings.account.email", "Email")}
                </span>
                <span className="font-medium text-gray-900">
                  {user?.email?.value || "—"}
                  {user?.email?.value && !user.email.isVerified && (
                    <span className="ml-2 text-xs text-amber-600">
                      ({t("pages.settings.account.unverified", "unverified")})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-gray-500">
                  {t("pages.settings.account.phone", "Phone")}
                </span>
                <span className="font-medium text-gray-900">
                  {user?.phone?.value || "—"}
                  {user?.phone?.value && !user.phone.isVerified && (
                    <span className="ml-2 text-xs text-amber-600">
                      ({t("pages.settings.account.unverified", "unverified")})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* DISPLAY TAB */}
        <TabsContent value="display">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              {t("pages.settings.display.language", "Language")}
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              {t(
                "pages.settings.display.language_hint",
                "Interface language for the entire site",
              )}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                    i18n.language === l.code
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-xs uppercase text-gray-400">
                    {l.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              {t("pages.settings.display.currency", "Display currency")}
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              {t(
                "pages.settings.display.currency_hint",
                "All prices will be converted to your chosen currency",
              )}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUPPORTED_CURRENCIES.map((code) => {
                const meta = CURRENCIES[code as CurrencyCode];
                const active = display === code;
                return (
                  <button
                    key={code}
                    onClick={() => handleCurrencyChange(code as CurrencyCode)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{meta.code}</span>
                      <span className="text-xs text-gray-500">
                        {meta.symbol}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[5rem]">
                      {meta.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
