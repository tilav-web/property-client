import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OtpConfirmation() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 daqiqa
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Vaqt hisobi
  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // OTPni tasdiqlash
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (otp.length !== 6) {
      alert("Iltimos, 6 xonalik kodni to'liq kiriting");
      setIsLoading(false);
      return;
    }

    // Tasdiqlash logikasi
    console.log("OTP Code:", otp);

    // Simulyatsiya
    setTimeout(() => {
      setIsLoading(false);
      alert("OTP muvaffaqiyatli tasdiqlandi!");
    }, 2000);
  };

  // Yangi OTP so'rash
  const handleResendOTP = () => {
    setIsLoading(true);
    setIsResendDisabled(true);
    setTimeLeft(120);
    setOtp("");

    // Yangi OTP yuborish logikasi
    console.log("Yangi OTP so'ralmoqda...");

    setTimeout(() => {
      setIsLoading(false);
      alert("Yangi kod emailingizga yuborildi!");
    }, 1500);
  };

  // Vaqtni formatlash
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Chap tomondagi rasm va kontent */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-green-600 lg:to-emerald-700">
        <div className="max-w-md text-center text-white p-8">
          <div className="mb-8">
            {/* OTP rasmi/ikonkasi */}
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
            <h1 className="text-4xl font-bold mb-4">Xavfsizlik tasdiqlashi</h1>
            <p className="text-green-100 text-lg">
              Kodni tasdiqlash orqali hisobingizning xavfsizligini ta'minlang
            </p>
          </div>
        </div>
      </div>

      {/* O'ng tomondagi OTP forma */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Xavfsizlik tasdiqlashi
            </h2>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Kodni tasdiqlang
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Tasdiqlash kodini quyidagi email manziliga yubordik
              </p>
              <p className="font-medium text-gray-900 mt-1 text-lg">
                email@example.com
              </p>
            </div>

            {/* OTP Input - shadcn/ui komponenti */}
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
                <p>6 xonalik kodni kiriting</p>
              </div>

              {/* Vaqt hisobi */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Kod amal qilish vaqti:{" "}
                  <span
                    className={`font-mono font-bold ${
                      timeLeft < 30 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>

              {/* Qayta yuborish tugmasi */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isResendDisabled || isLoading}
                  className="text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isResendDisabled
                    ? "Kodni qayta yuborish"
                    : "Kodni qayta yuborish"}
                </Button>
              </div>

              {/* Tasdiqlash tugmasi */}
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Tasdiqlanmoqda..." : "Kodni tasdiqlash"}
              </Button>
            </form>

            {/* Orqaga qaytish */}
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                className="text-gray-600 hover:text-gray-500"
                onClick={() => window.history.back()}
              >
                ← Orqaga qaytish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
