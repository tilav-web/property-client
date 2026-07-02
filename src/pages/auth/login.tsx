import { COUNTRY_CONFIG } from "@/constants/country";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { loginYupSchema } from "@/schemas/login.schema";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";
import { useUiStore } from "@/stores/ui.store";
import { useMemo, useState } from "react";
import { PHONE_AUTH_ENABLED } from "@/constants/feature-flags";
import { registerHouseImage } from "@/utils/shared";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserStore();
  const { closeLoginDialog } = useUiStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  const isStandalonePage = location.pathname === "/auth/login";

  const identifierLabel = useMemo(
    () =>
      authMethod === "email"
        ? t("pages.login_page.email")
        : t("pages.login_page.phone", "Phone"),
    [authMethod, t],
  );

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    userService.googleLogin();
  };

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        const data = await userService.login({
          identifier:
            authMethod === "phone"
              ? values.identifier.replaceAll(/[\s-]/g, "")
              : values.identifier.trim(),
          password: values.password,
        });

        setUser(data.user);
        handleStorage({ key: "access_token", value: data.access_token });
        closeLoginDialog();
        navigate("/", { replace: true });
      } catch (error: any) {
        console.error(error);
        toast.error(t("common.error", "Error"), {
          description:
            error?.response?.data?.message ||
            t("pages.login_page.login_failed", "Login failed"),
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
    validationSchema: loginYupSchema,
  });

  const formSurface = (
    <div className="w-full max-w-[460px] bg-white p-5 sm:p-8 lg:p-10">
      <div className="mb-5 sm:mb-8 space-y-1.5 sm:space-y-2">
        <p className="text-sm font-medium text-primary">
          {t("pages.login_page.sign_in")}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl text-foreground">
          {t("pages.login_page.welcome_back", "Welcome back")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t(
            "pages.login_page.helper_text",
            "Sign in to continue browsing listings, messages, and saved properties.",
          )}
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || formik.isSubmitting}
          className="flex h-11 sm:h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {t("pages.login_page.google")}
        </button>

        <button
          onClick={() => userService.appleLogin()}
          disabled={formik.isSubmitting}
          className="flex h-11 sm:h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          {t("pages.login_page.apple")}
        </button>

        <button
          onClick={() => userService.facebookLogin()}
          disabled={formik.isSubmitting}
          className="flex h-11 sm:h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {t("pages.login_page.facebook")}
        </button>
      </div>

      <div className="relative my-4 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-muted-foreground">
            {t("pages.login_page.or")}
          </span>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-3.5 sm:space-y-5">
        {PHONE_AUTH_ENABLED && (
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                formik.setFieldValue("identifier", "");
              }}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-all",
                authMethod === "email"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("pages.login_page.email")}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                formik.setFieldValue("identifier", "");
              }}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-all",
                authMethod === "phone"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("pages.login_page.phone", "Phone")}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="identifier"
            className="text-sm font-medium text-foreground"
          >
            {identifierLabel}
          </label>
          <input
            id="identifier"
            name="identifier"
            type={authMethod === "email" ? "email" : "tel"}
            inputMode={authMethod === "phone" ? "tel" : undefined}
            autoComplete={authMethod === "email" ? "email" : "tel"}
            value={formik.values.identifier}
            className={cn(
              "h-11 sm:h-12 w-full rounded-xl border bg-card px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground",
              "focus:border-primary focus:ring-4 focus:ring-primary/10",
              formik.touched.identifier && formik.errors.identifier
                ? "border-red-500"
                : "border-border",
            )}
            placeholder={
              authMethod === "email" ? "email@example.com" : "+998901234567"
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.identifier && formik.errors.identifier && (
            <p className="text-sm text-red-500">{formik.errors.identifier}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {t("pages.login_page.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formik.values.password}
              className={cn(
                "h-11 sm:h-12 w-full rounded-xl border bg-card px-4 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground",
                "focus:border-primary focus:ring-4 focus:ring-primary/10",
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-border",
              )}
              placeholder="********"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm capitalize text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm flex-wrap">
          <label
            htmlFor="remember-me"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span>{t("pages.login_page.remember_me")}</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="font-medium text-foreground transition-colors hover:text-primary whitespace-nowrap"
          >
            {t("pages.login_page.forgot_password")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex h-11 sm:h-12 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formik.isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            t("pages.login_page.sign_in")
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("pages.login_page.no_account")}{" "}
        <Link
          to="/auth"
          className="font-semibold text-foreground transition-colors hover:text-primary"
        >
          {t("pages.login_page.sign_up")}
        </Link>
      </div>
    </div>
  );

  if (!isStandalonePage) {
    return <div className="p-6 sm:p-8">{formSurface}</div>;
  }

  return (
    <div className="min-h-screen bg-[rgb(248,249,251)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="relative hidden flex-1 lg:block">
          <img
            src={registerHouseImage}
            alt="Luxury property"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white xl:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-white/80">
              {COUNTRY_CONFIG.brandName}
            </p>
            <h2 className="max-w-md text-3xl font-semibold leading-tight xl:text-4xl">
              {t(
                "pages.login_page.hero_title",
                "Your next property conversation starts here.",
              )}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
              {t(
                "pages.login_page.hero_text",
                "Track saved homes, continue seller conversations, and move between listings, maps, and AI search without losing context.",
              )}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center lg:w-[46%]">
          {formSurface}
        </div>
      </div>
    </div>
  );
}
