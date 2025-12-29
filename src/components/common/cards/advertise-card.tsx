import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";

interface Props {
  advertise: IAdvertise;
}

// --- Status konfiguratsiyasi
const statusConfig = {
  pending: {
    label: "Kutilmoqda",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  approved: {
    label: "Tasdiqlangan",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rad etilgan",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  expired: {
    label: "Muddati tugagan",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertCircle,
  },
} as const;

// --- Reklama turi konfiguratsiyasi
const typeConfig = {
  banner: { label: "Banner", color: "bg-blue-50 text-blue-700" },
  aside: { label: "Yon reklama", color: "bg-purple-50 text-purple-700" },
  image: { label: "Rasm", color: "bg-orange-50 text-orange-700" },
} as const;

export default function AdvertiseCard({ advertise }: Props) {
  // Agar status yoki type noto‘g‘ri bo‘lsa — default holatni tanlaymiz
  const statusInfo =
    statusConfig[
      advertise?.status?.toLowerCase() as keyof typeof statusConfig
    ] || statusConfig["pending"];
  const StatusIcon = statusInfo.icon;

  const typeInfo =
    typeConfig[advertise?.type as keyof typeof typeConfig] ||
    typeConfig["image"];

  // Sana formatlash
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy");
    } catch {
      return "-";
    }
  };

  // URL qisqartirish
  const shortenUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url?.length > 25 ? `${url.substring(0, 25)}...` : url;
    }
  };

  return (
    <Card className="w-full max-w-md bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Kontent */}
      <CardContent className="p-0">
        {/* Tasvir qismi */}
        <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {advertise?.image ? (
            <img
              src={advertise.image}
              alt="Reklama tasviri"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                <ExternalLink size={24} />
              </div>
              <span className="text-sm">Tasvir mavjud emas</span>
            </div>
          )}

          {/* Reklama turi */}
          <div className="absolute flex z-10 top-0 flex-row-reverse justify-between items-center w-full p-2">
            <div>
              <Badge
                className={`flex items-center gap-1.5 px-3 rounded-full text-xs font-medium hover:text-white cursor-pointer border ${statusInfo.color}`}
              >
                {StatusIcon && <StatusIcon size={14} />}
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <Badge
                className={`px-2 py-1 text-xs font-medium rounded-md hover:text-white cursor-pointer ${typeInfo.color}`}
              >
                {typeInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Ma’lumotlar */}
        <div className="p-4 space-y-4">
          {/* URL va narx */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <ExternalLink size={16} className="text-blue-500" />
              <a
                href={advertise?.target}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {advertise?.target ? shortenUrl(advertise.target) : "No URL"}
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-lg font-bold text-green-600">
              <span>
                {advertise?.price
                  ? advertise.price?.toLocaleString("uz-UZ")
                  : "0"}
              </span>
              <span className="text-sm font-normal text-gray-500">
                {advertise?.currency || ""}
              </span>
            </div>
          </div>

          {/* Muddat */}
          {advertise?.from && advertise?.to && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} />
                  <span>Muddati:</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-gray-900">
                    {formatDate(advertise.from)}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-900">
                    {formatDate(advertise.to)}
                  </span>
                </div>
              </div>

              {/* Kunlar */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Davomiylik:</span>
                <span className="font-medium">{advertise?.days ?? 0} kun</span>
              </div>
            </div>
          )}

          {/* To‘lov holati */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">To'lov holati:</span>
            <Badge
              variant={
                advertise?.payment_status === "paid" ? "default" : "secondary"
              }
              className={`text-xs ${
                advertise?.payment_status === "paid"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }`}
            >
              {advertise?.payment_status === "paid"
                ? "To'langan"
                : "Kutilmoqda"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
