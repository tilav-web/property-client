import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";

type Step = "email" | "otp" | "new-password" | "success";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await userService.forgotPassword(email);
      setUserId(data.userId);
      setStep("otp");
    } catch {
      setError(t("pages.forgot_password.email_not_found"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError(t("pages.otp_page.error_invalid_code"));
      return;
    }
    setStep("new-password");
    setError("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError(t("pages.forgot_password.password_min_length"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("pages.forgot_password.passwords_not_match"));
      return;
    }

    setIsLoading(true);
    try {
      await userService.resetPassword({
        userId,
        code: otpCode,
        newPassword,
      });
      setStep("success");
    } catch {
      setError(t("pages.forgot_password.reset_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      await userService.forgotPassword(email);
    } catch {
      setError(t("pages.forgot_password.resend_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          {/* Step 1: Email */}
          {step === "email" && (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
                <Mail className="h-7 w-7 text-yellow-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t("pages.forgot_password.title")}
              </h1>
              <p className="mb-6 text-sm text-gray-500">
                {t("pages.forgot_password.subtitle")}
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("pages.login_page.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="h-11 w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-500"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("pages.forgot_password.send_code")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={14} className="mr-1 inline" />
                  {t("pages.login_page.sign_in")}
                </Link>
              </div>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <button
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={16} />
                {t("common.back")}
              </button>

              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t("pages.otp_page.confirm_code")}
              </h1>
              <p className="mb-1 text-sm text-gray-500">
                {t("pages.otp_page.code_sent_to")}
              </p>
              <p className="mb-6 text-sm font-medium text-gray-800">{email}</p>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(val) => setOtpCode(val)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={otpCode.length < 6}
                  className="h-11 w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-500"
                >
                  {t("pages.forgot_password.verify_code")}
                </Button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="w-full text-center text-sm text-yellow-700 hover:underline disabled:opacity-50"
                >
                  {t("pages.otp_page.resend_code")}
                </button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === "new-password" && (
            <>
              <button
                onClick={() => {
                  setStep("otp");
                  setError("");
                }}
                className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={16} />
                {t("common.back")}
              </button>

              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t("pages.forgot_password.new_password_title")}
              </h1>
              <p className="mb-6 text-sm text-gray-500">
                {t("pages.forgot_password.new_password_subtitle")}
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("pages.forgot_password.new_password")}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("pages.forgot_password.confirm_password")}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="h-11 w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-500"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("pages.forgot_password.reset_button")}
                </Button>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t("pages.forgot_password.success_title")}
              </h1>
              <p className="mb-6 text-sm text-gray-500">
                {t("pages.forgot_password.success_subtitle")}
              </p>
              <Link to="/auth/login">
                <Button className="h-11 w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-500">
                  {t("pages.login_page.sign_in")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
