import { useInquiryResponseStore } from "@/stores/inquiry-response.store";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  User,
  Home,
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageSellerButton from "@/components/common/buttons/message-seller-button";

export default function InquiryResponsesTab() {
  const { t, i18n } = useTranslation();
  const { inquiryResponses, isLoading, fetchMyInquiryResponses } =
    useInquiryResponseStore();

  useEffect(() => {
    fetchMyInquiryResponses();
  }, [fetchMyInquiryResponses]);

  const approved = useMemo(
    () => inquiryResponses.filter((r) => r.status === "approved"),
    [inquiryResponses],
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return t("pages.profile_page.approved_offers.hours_ago", {
        count: diffHours,
        defaultValue: "{{count}}h ago",
      });
    }

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

  if (approved.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("pages.profile_page.approved_offers.empty_title")}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {t("pages.profile_page.approved_offers.empty_subtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 p-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <p className="text-sm text-green-800">
          {t("pages.profile_page.approved_offers.info_banner", {
            count: approved.length,
          })}
        </p>
      </div>

      <div className="grid gap-4">
        {approved.map((response) => (
          <div
            key={response._id}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {response.seller.user?.avatar ? (
                      <img
                        src={response.seller.user?.avatar}
                        alt={response.seller.user?.first_name || ""}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">
                      {response.seller.user?.first_name}{" "}
                      {response.seller.user?.last_name}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      {t("pages.profile_page.approved_offers.approved_badge")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(response.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/property/${response.property._id}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm whitespace-nowrap"
              >
                {t("pages.profile_page.approved_offers.view_property")}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

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

              {response.property.photos &&
                response.property.photos.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {response.property.photos
                      .slice(0, 3)
                      .map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt=""
                            className="w-20 h-16 rounded-md object-cover"
                          />
                          {index === 2 &&
                            response.property.photos &&
                            response.property.photos.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center text-white text-xs font-medium">
                                +{response.property.photos.length - 3}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                )}
            </div>

            {response.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm">
                    {t("pages.profile_page.approved_offers.seller_response")}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-line text-sm">
                  {response.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to={`/property/${response.property._id}`}>
                  <Home className="h-3 w-3" />
                  {t("pages.profile_page.approved_offers.property_page")}
                </Link>
              </Button>
              {response.seller.user?._id && (
                <MessageSellerButton
                  sellerId={response.seller.user._id}
                  propertyId={response.property._id}
                  variant="default"
                  className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
