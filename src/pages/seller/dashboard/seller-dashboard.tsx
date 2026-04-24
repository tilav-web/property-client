import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  MessageSquare,
  Heart,
  Bookmark,
  MapPin,
  Plus,
  Star,
  TrendingUp,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { statisticService } from "@/services/statistic.service";
import { formatPrice } from "@/utils/format-price";
import Loading from "@/components/common/loadings/loading";
import { propertyService } from "@/services/property.service";
import { inquiryService } from "@/services/inquiry.service";
import { useUserStore } from "@/stores/user.store";
import type { IProperty } from "@/interfaces/property/property.interface";
import type { IInquiry } from "@/interfaces/inquiry/inquiry.interface";
import type { IApartmentRent } from "@/interfaces/property/categories/apartment-rent.interface";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  accent: string;
  description?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  accent,
  description,
}: StatCardProps) => (
  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            accent,
          )}
        >
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value ?? 0}</div>
      <p className="mt-1 text-sm font-medium text-gray-600">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      )}
    </CardContent>
  </Card>
);

const PropertyMiniCard = ({ property }: { property: IProperty }) => {
  const ap = property as IApartmentRent | IApartmentSale;
  const titleText =
    typeof property.title === "string"
      ? property.title
      : ((property.title as Record<string, string> | undefined)?.en ??
        "Listing");
  const photo = property.photos?.[0];

  return (
    <Link
      to={`/property/${property._id}`}
      className="group flex gap-3 rounded-xl border bg-white p-3 hover:shadow-md transition-shadow"
    >
      {photo ? (
        <img
          src={photo}
          alt={titleText}
          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
          <Home className="h-6 w-6 text-gray-400" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
            {titleText}
          </h4>
          <div className="flex shrink-0 gap-1">
            {property.is_premium && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                ⭐
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm font-bold text-blue-600 mt-0.5">
          {formatPrice(property.price, property.currency)}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {ap.bedrooms !== undefined && <span>🛏 {ap.bedrooms}</span>}
          {ap.area !== undefined && <span>📐 {ap.area}m²</span>}
          <span className="flex items-center gap-0.5">
            <Heart size={11} /> {property.liked ?? 0}
          </span>
          <span className="flex items-center gap-0.5">
            <Star size={11} /> {property.rating ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

const InquiryMiniCard = ({ inquiry }: { inquiry: IInquiry }) => {
  const statusColor: Record<IInquiry["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    viewed: "bg-blue-100 text-blue-700",
    responded: "bg-green-100 text-green-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    canceled: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {inquiry.user.first_name}
          </p>
          <p className="truncate text-xs text-gray-500">
            {inquiry.property.title}
          </p>
        </div>
        <Badge
          className={cn("h-5 px-1.5 text-[10px]", statusColor[inquiry.status])}
        >
          {inquiry.status}
        </Badge>
      </div>
      <p className="line-clamp-2 text-xs text-gray-600">{inquiry.comment}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-blue-600">
          {inquiry.offered_price
            ? formatPrice(inquiry.offered_price, inquiry.property.currency)
            : ""}
        </span>
        <span className="text-gray-400">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => statisticService.getSellerDashboard(),
  });

  const { data: propertiesData, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: () => propertyService.findMyProperties({ page: 1, limit: 6 }),
  });

  const { data: inquiriesData, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ["my-inquiries"],
    queryFn: () => inquiryService.findSellerInquiries(),
  });

  const analyticsData = [
    {
      name: t("seller_dashboard.chart.properties", {
        defaultValue: "Properties",
      }),
      value: dashboardData?.totalProperties || 0,
    },
    {
      name: t("seller_dashboard.chart.inquiries", {
        defaultValue: "Inquiries",
      }),
      value: dashboardData?.totalInquiries || 0,
    },
    {
      name: t("seller_dashboard.chart.likes", { defaultValue: "Likes" }),
      value: dashboardData?.totalLikes || 0,
    },
    {
      name: t("seller_dashboard.chart.saves", { defaultValue: "Saves" }),
      value: dashboardData?.totalSaves || 0,
    },
  ];

  const recentInquiries = (inquiriesData ?? []).slice(0, 6);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 p-6 text-white shadow-sm">
          <div>
            <p className="text-sm text-white/80">
              {t("seller_dashboard.welcome", { defaultValue: "Welcome back," })}
            </p>
            <h1 className="mt-0.5 text-2xl md:text-3xl font-bold">
              {user?.first_name || "Seller"} 👋
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {t("seller_dashboard.subtitle", {
                defaultValue:
                  "Here's an overview of your listings and inquiries.",
              })}
            </p>
          </div>
          <Link to="/seller/properties/create">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90"
            >
              <Plus size={16} className="mr-1" />
              {t("seller_dashboard.add_property", {
                defaultValue: "Add property",
              })}
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        {isDashboardLoading ? (
          <Loading />
        ) : isDashboardError ? (
          <div className="text-sm text-red-600">
            {t("seller_dashboard.error_stats", {
              defaultValue: "Failed to load stats",
            })}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("seller_dashboard.stats.properties", {
                defaultValue: "Properties",
              })}
              value={dashboardData?.totalProperties}
              icon={<Home className="w-5 h-5 text-blue-600" />}
              accent="bg-blue-50"
            />
            <StatCard
              title={t("seller_dashboard.stats.inquiries", {
                defaultValue: "Inquiries",
              })}
              value={dashboardData?.totalInquiries}
              icon={<MessageSquare className="w-5 h-5 text-amber-600" />}
              accent="bg-amber-50"
            />
            <StatCard
              title={t("seller_dashboard.stats.likes", {
                defaultValue: "Likes",
              })}
              value={dashboardData?.totalLikes}
              icon={<Heart className="w-5 h-5 text-rose-600" />}
              accent="bg-rose-50"
            />
            <StatCard
              title={t("seller_dashboard.stats.saves", {
                defaultValue: "Saved",
              })}
              value={dashboardData?.totalSaves}
              icon={<Bookmark className="w-5 h-5 text-emerald-600" />}
              accent="bg-emerald-50"
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Analytics */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  {t("seller_dashboard.analytics", {
                    defaultValue: "Analytics",
                  })}
                </CardTitle>
                <CardDescription>
                  {t("seller_dashboard.analytics_description", {
                    defaultValue: "Your activity at a glance",
                  })}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData}
                  margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent inquiries */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-amber-600" />
                  {t("seller_dashboard.recent_inquiries", {
                    defaultValue: "Recent inquiries",
                  })}
                </CardTitle>
                <CardDescription>
                  {recentInquiries.length}{" "}
                  {t("seller_dashboard.recent_inquiries_count", {
                    defaultValue: "new",
                  })}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isInquiriesLoading ? (
                <Loading />
              ) : recentInquiries.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  {t("seller_dashboard.no_inquiries", {
                    defaultValue: "No inquiries yet",
                  })}
                </p>
              ) : (
                recentInquiries.map((inq: IInquiry) => (
                  <InquiryMiniCard key={inq._id} inquiry={inq} />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent properties */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home size={18} className="text-blue-600" />
                {t("seller_dashboard.recent_properties", {
                  defaultValue: "Recent properties",
                })}
              </CardTitle>
              <CardDescription>
                {t("seller_dashboard.recent_properties_description", {
                  defaultValue: "Your latest listings",
                })}
              </CardDescription>
            </div>
            <Link to="/seller/properties">
              <Button variant="ghost" size="sm">
                <Eye size={14} className="mr-1" />
                {t("seller_dashboard.view_all", { defaultValue: "View all" })}
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isPropertiesLoading ? (
              <Loading />
            ) : !propertiesData?.properties?.length ? (
              <div className="py-8 text-center">
                <Home className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">
                  {t("seller_dashboard.no_properties", {
                    defaultValue: "No properties yet",
                  })}
                </p>
                <Link to="/seller/properties/create">
                  <Button className="mt-4" size="sm">
                    <Plus size={14} className="mr-1" />
                    {t("seller_dashboard.add_first", {
                      defaultValue: "Add your first property",
                    })}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {propertiesData.properties.map((p: IProperty) => (
                  <PropertyMiniCard key={p._id} property={p} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Keep MapPin export available for TS purposes (unused)
void MapPin;
