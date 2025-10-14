import { useTranslation } from "react-i18next";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";

export default function OtpConfirmation() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [params] = useSearchParams();
  const id = params.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (otp.length !== 6) {
        toast.error(t("common.error"), {
          description: t("pages.otp_page.error_invalid_code"),
        });
        setIsLoading(false);
        return;
      }
      if (!id || !otp) return;
      const data = await userService.otpConfirm({ id, code: otp });
      setUser(data.user);
      handleStorage({ key: "access_token", value: data.access_token });
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    try {
      setIsLoading(true);
      if (!id) return;
      const data = await userService.optResend(id);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex max-w-6xl shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-green-600 lg:to-emerald-700">
          <div className="max-w-md text-center text-white p-8">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {t("pages.otp_page.title")}
              </h1>
              <p className="text-green-100 text-lg">
                {t("pages.otp_page.subtitle")}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("pages.otp_page.confirm_code")}
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                {t("pages.otp_page.code_sent_to")}
              </p>
              <p className="font-medium text-gray-900 mt-1 text-lg">
                email@example.com
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
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
              <div className="text-center text-sm text-gray-600">
                <p>{t("pages.otp_page.enter_code")}</p>
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {t("pages.otp_page.resend_code")}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("pages.otp_page.confirming") : t("pages.otp_page.confirm_button")}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                className="text-gray-600 hover:text-gray-500"
                onClick={() => window.history.back()}
              >
                {t("pages.otp_page.go_back")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
