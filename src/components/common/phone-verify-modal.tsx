import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/stores/user.store";
import { userService } from "@/services/user.service";

interface Props {
  open: boolean;
  onSuccess: () => void;
}

export default function PhoneVerifyModal({ open, onSuccess }: Props) {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState(user?.phone?.value ?? "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await userService.requestPhoneVerification(phone);
      setStep("otp");
      setCode("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? t("common.error", "Xatolik yuz berdi");
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const updatedUser = await userService.confirmPhoneOtp(code);
      setUser(updatedUser);
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? t("common.error", "Xatolik yuz berdi");
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "phone" ? (
              <>
                <Phone size={18} />
                {t("phone_verify.title", "Telefon raqamni tasdiqlang")}
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                {t("phone_verify.otp_title", "SMS kodni kiriting")}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t(
                "phone_verify.subtitle",
                "Property joylash uchun telefon raqamingizni tasdiqlang."
              )}
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998901234567"
              required
              autoFocus
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {loading
                ? t("common.loading", "Yuborilmoqda...")
                : t("phone_verify.send_otp", "Kod yuborish")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmOtp} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t(
                "phone_verify.otp_subtitle",
                `${phone} raqamiga yuborilgan 6 xonali kodni kiriting.`
              )}
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              autoFocus
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {loading
                ? t("common.loading", "Tekshirilmoqda...")
                : t("phone_verify.confirm", "Tasdiqlash")}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError(null);
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              {t("phone_verify.back", "Orqaga")}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
