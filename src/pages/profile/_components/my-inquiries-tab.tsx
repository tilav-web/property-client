import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
  SendHorizonal,
  User,
  BadgeDollarSign,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { inquiryService } from "@/services/inquiry.service";
import type { TInquiryStatus, TInquiryType } from "@/interfaces/inquiry/inquiry.interface";

interface MySentInquiry {
  _id: string;
  type: TInquiryType;
  status: TInquiryStatus;
  offered_price?: number;
  rental_period?: { from: string; to: string };
  comment: string;
  createdAt: string;
  property: {
    _id: string;
    title: string;
    photos?: string[];
    price?: number;
    currency?: string;
  };
  seller?: {
    _id: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
  response?: {
    _id: string;
    status: "approved" | "rejected";
    description: string;
    createdAt: string;
  };
}

const STATUS_CONFIG: Record<TInquiryStatus, { label: string; className: string }> = {
  pending:   { label: "Kutilmoqda",      className: "bg-gray-100 text-gray-700" },
  viewed:    { label: "Ko'rildi",        className: "bg-blue-100 text-blue-700" },
  responded: { label: "Javob berildi",   className: "bg-purple-100 text-purple-700" },
  accepted:  { label: "Qabul qilindi",   className: "bg-green-100 text-green-700" },
  rejected:  { label: "Rad etildi",      className: "bg-red-100 text-red-700" },
  canceled:  { label: "Bekor qilindi",   className: "bg-gray-100 text-gray-500" },
};

const TYPE_LABELS: Record<TInquiryType, string> = {
  purchase: "Sotib olish",
  rent:     "Ijaraga olish",
  mortgage: "Ipoteka",
};

export default function MyInquiriesTab() {
  const { i18n } = useTranslation();
  const [inquiries, setInquiries] = useState<MySentInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    inquiryService
      .findMySentInquiries()
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffH = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (diffH < 24) return `${diffH}s oldin`;
    return date.toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-16">
        <SendHorizonal className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Yuborilgan takliflar yo'q
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Siz hali birorta ham taklif yubormagansiz. Property sahifasida sotuvchiga taklif yuboring.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Propertylarni ko'rish</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {inquiries.map((inquiry) => {
          const statusCfg = STATUS_CONFIG[inquiry.status];
          const photo = inquiry.property.photos?.[0];

          return (
            <div
              key={inquiry._id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
            >
              {/* Header: property info + status */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {photo ? (
                    <img
                      src={photo}
                      alt={inquiry.property.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      to={`/property/${inquiry.property._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 block"
                    >
                      {inquiry.property.title}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[inquiry.type]}
                  </span>
                </div>
              </div>

              {/* Offered price */}
              {inquiry.offered_price !== undefined && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <BadgeDollarSign className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-gray-700">
                    Taklif narxi:{" "}
                    <span className="font-semibold text-green-700">
                      {inquiry.offered_price.toLocaleString()}{" "}
                      {inquiry.property.currency ?? "USD"}
                    </span>
                  </span>
                </div>
              )}

              {/* Rental period */}
              {inquiry.rental_period && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-gray-700">
                    {new Date(inquiry.rental_period.from).toLocaleDateString()} —{" "}
                    {new Date(inquiry.rental_period.to).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Comment */}
              {inquiry.comment && (
                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-3 text-sm text-gray-700">
                  <MessageSquare className="h-3.5 w-3.5 inline mr-1.5 text-gray-400" />
                  {inquiry.comment}
                </div>
              )}

              {/* Seller info */}
              {inquiry.seller && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {inquiry.seller.avatar ? (
                      <img src={inquiry.seller.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                  <span>
                    Sotuvchi:{" "}
                    <span className="font-medium text-gray-700">
                      {inquiry.seller.first_name} {inquiry.seller.last_name}
                    </span>
                  </span>
                </div>
              )}

              {/* Seller response */}
              {inquiry.response && (
                <div
                  className={`rounded-lg p-4 border mt-2 ${
                    inquiry.response.status === "approved"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        inquiry.response.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inquiry.response.status === "approved"
                        ? "✅ Qabul qilindi"
                        : "❌ Rad etildi"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(inquiry.response.createdAt)}
                    </span>
                  </div>
                  {inquiry.response.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {inquiry.response.description}
                    </p>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link to={`/property/${inquiry.property._id}`}>
                    <Home className="h-3 w-3" />
                    Propertyga o'tish
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
