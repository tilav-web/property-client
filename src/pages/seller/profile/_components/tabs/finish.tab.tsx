import { CheckCircle, Clock } from "lucide-react";

export default function FinishTab() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      {/* Tabriklash qismi */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tabriklaymiz!
        </h1>
        <p className="text-xl text-green-600 font-semibold">
          Ro'yxatdan o'tish muvaffaqiyatli yakunlandi
        </p>
      </div>

      {/* Tasdiqlash jarayoni haqida ma'lumot */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900 text-lg">
              Administrator tasdiqlashi kutilmoqda
            </h3>
            <p className="text-blue-800">
              Sizning ma'lumotlaringiz administrator tomonidan tekshirilmoqda. 
              Odatda bu jarayon <strong>24 soat</strong> ichida amalga oshiriladi.
            </p>
            <div className="bg-white border border-blue-100 rounded-lg p-3">
              <p className="text-blue-900 text-sm">
                📧 Tasdiqlanganidan so'ng sizga email orqali xabar yuboriladi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyingi qadamlar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">
          Keyingi qadamlar
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-gray-700">Ma'lumotlaringiz tekshirilmoqda</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-gray-500">Administrator tasdiqlashi</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-gray-500">Tasdiqlash emaili olish</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="pt-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Joriy holat</span>
          <span className="font-semibold">Tasdiqlanish kutilmoqda</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full w-1/3 animate-pulse"
            title="Ma'lumotlar tekshirilmoqda"
          ></div>
        </div>
      </div>

      {/* Qo'shimcha ma'lumot */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Agar 24 soat ichida tasdiqlanmasa, iltimos{" "}
          <span className="text-blue-600 font-medium">support@amaarmarket.uz</span>{" "}
          manziliga murojaat qiling
        </p>
      </div>
    </div>
  );
}