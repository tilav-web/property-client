import { useInquiryResponseStore } from "@/stores/inquiry-response.store";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Home,
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InquiryResponsesTab() {
  const { inquiryResponses, isLoading, fetchMyInquiryResponses } =
    useInquiryResponseStore();

  useEffect(() => {
    fetchMyInquiryResponses();
  }, [fetchMyInquiryResponses]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} soat oldin`;
    }

    return date.toLocaleDateString("uz-UZ", {
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

  if (inquiryResponses.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Hozircha javoblar yo'q
        </h3>
        <p className="text-gray-500">
          Sizning so'rovingizga hali hech kim javob bermagan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {inquiryResponses.map((response) => (
          <div
            key={response._id}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
          >
            {/* Sotuvchi ma'lumotlari */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {response.seller.user?.avatar ? (
                      <img
                        src={response.seller.user?.avatar}
                        alt={
                          response.seller.user?.first_name || "Foydalanuvchi"
                        }
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  {response.status === "approved" && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {response.seller.user?.first_name}{" "}
                      {response.seller.user?.last_name}
                    </h3>
                    {response.status === "approved" && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Qabul qilindi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(response.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/property/${response.property._id}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                Uyni ko'rish
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Uy haqida ma'lumot */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-gray-400" />
                <Link
                  to={`/property/${response.property._id}`}
                  className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                >
                  {response.property.title}
                </Link>
              </div>

              {/* Uy rasmlari */}
              {response.property.photos &&
                response.property.photos.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {response.property.photos
                      .slice(0, 3)
                      .map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Uy rasmi ${index + 1}`}
                            className="w-20 h-16 rounded-md object-cover"
                          />
                          {index === 2 &&
                            response.property.photos &&
                            response.property.photos.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center text-white text-xs">
                                +{response.property.photos.length - 3}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                )}
            </div>

            {/* Sotuvchi javobi */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  Sotuvchi javobi:
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">
                {response.description || "Sotuvchi izoh qoldirmagan"}
              </p>
            </div>

            {/* Aloqa va boshqa ma'lumotlar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Email:</span>
                  <a
                    href={`mailto:${response.seller.user?.email?.value}`}
                    className="text-blue-600 hover:underline"
                  >
                    {response.seller.user?.email?.value}
                  </a>
                </div>
                {response.inquiry?.type && (
                  <div className="mt-1">
                    <span className="text-gray-500">So'rov turi:</span>
                    <span className="ml-1 font-medium">
                      {response.inquiry.type === "rent" ? "Ijara" : "Sotuv"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link to={`/property/${response.property._id}`}>
                    <Home className="h-3 w-3" />
                    Uy sahifasi
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  <a href={`mailto:${response.seller.user?.email?.value}`}>
                    <MessageSquare className="h-3 w-3" />
                    Javob berish
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
