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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { statisticService } from "@/services/statistic.service";
import Loading from "@/components/common/loadings/loading";
import { propertyService } from "@/services/property.service";
import { inquiryService } from "@/services/inquiry.service";
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
  Legend,
  Bar,
} from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

// Statistik kartochka komponenti
const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Property kartasi komponenti
const PropertyCard = ({ property }: { property: IProperty }) => {
  const apartmentProperty = property as IApartmentRent | IApartmentSale;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{property.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {apartmentProperty.area}m² • {apartmentProperty.bedrooms} xona
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {property.is_premium && <Badge variant="secondary">Premium</Badge>}
            {property.status === "APPROVED" && (
              <Badge variant="default">Tasdiqlangan</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-2xl font-bold text-primary">
              {property.currency === 'rm'
                ? `RM ${property.price.toLocaleString()}`
                : `${property.price.toLocaleString()} so'm`}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Rating:</span>
              <span className="font-medium">{property.rating}/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Likes:</span>
              <span className="font-medium">{property.liked}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{property.liked}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-4 h-4 text-blue-500" />
            <span>{property.saved}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// So'rov kartasi komponenti
const InquiryCard = ({ inquiry }: { inquiry: IInquiry }) => {
  const statusColors: Record<IInquiry["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    viewed: "bg-blue-100 text-blue-800",
    responded: "bg-green-100 text-green-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm">{inquiry.user.first_name}</CardTitle>
            <CardDescription>{inquiry.property.title}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Badge className={statusColors[inquiry.status]}>
              {inquiry.status}
            </Badge>
            {inquiry.response && <Badge variant="secondary">Javob berilgan</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{inquiry.comment}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">
            {inquiry.offered_price &&
              (inquiry.property.currency === 'rm'
                ? `RM ${inquiry.offered_price.toLocaleString()}`
                : `${inquiry.offered_price.toLocaleString()} so'm`)}
          </span>
          <span className="text-muted-foreground">
            {new Date(inquiry.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SellerDashboard() {
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => statisticService.getSellerDashboard(),
  });

  const {
    data: propertiesData,
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
  } = useQuery({
    queryKey: ["my-properties"],
    queryFn: () => propertyService.findMyProperties({ page: 1, limit: 10 }),
  });

  const {
    data: inquiriesData,
    isLoading: isInquiriesLoading,
    isError: isInquiriesError,
  } = useQuery({
    queryKey: ["my-inquiries"],
    queryFn: () => inquiryService.findSellerInquiries(),
  });

  const analyticsData = [
    { name: "Properties", value: dashboardData?.totalProperties || 0 },
    { name: "Inquiries", value: dashboardData?.totalInquiries || 0 },
    { name: "Likes", value: dashboardData?.totalLikes || 0 },
    { name: "Saves", value: dashboardData?.totalSaves || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sarlavha */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              Sizning propertylaringiz statistikasi va boshqaruvi
            </p>
          </div>
        </div>

        {/* Umumiy ko'rinish */}
        <div className="space-y-6">
          {isDashboardLoading ? (
            <Loading />
          ) : isDashboardError ? (
            <div>Error loading dashboard.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Jami Propertylar"
                value={dashboardData?.totalProperties}
                icon={<Home className="w-4 h-4 text-muted-foreground" />}
                description="Barcha listinglar"
              />
              <StatCard
                title="Jami So'rovlar"
                value={dashboardData?.totalInquiries}
                icon={
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                }
                description="Barcha so'rovlar"
              />
              <StatCard
                title="Jami Like-lar"
                value={dashboardData?.totalLikes}
                icon={<Heart className="w-4 h-4 text-muted-foreground" />}
                description="Foydalanuvchilar yoqtirishlari"
              />
              <StatCard
                title="Jami Saqlanganlar"
                value={dashboardData?.totalSaves}
                icon={<Bookmark className="w-4 h-4 text-muted-foreground" />}
                description="Property saqlashlar"
              />
            </div>
          )}
        </div>

        {/* Analitika */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analitika</CardTitle>
              <CardDescription>
                Statistik ma'lumotlarning grafik ko'rinishi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* So'rovlar */}
        <div className="space-y-6">
          {isInquiriesLoading ? (
            <Loading />
          ) : isInquiriesError ? (
            <div>Error loading inquiries.</div>
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>So'nggi So'rovlar</CardTitle>
                            <CardDescription>
                              Sizning listinglaringizga kelgan so'nggi so'rovlar
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {inquiriesData?.map((inquiry: IInquiry) => (
                                <InquiryCard key={inquiry._id} inquiry={inquiry} />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
          
                    {/* Propertylar */}
                    <div className="space-y-6">
                      {isPropertiesLoading ? (
                        <Loading />
                      ) : isPropertiesError ? (
                        <div>Error loading properties.</div>
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>Barcha Propertylar</CardTitle>
                            <CardDescription>
                              Sizning barcha listinglaringiz ro'yxati
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {propertiesData?.properties.map((property: IProperty) => (
                                <PropertyCard key={property._id} property={property} />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>      </div>
    </div>
  );
}
