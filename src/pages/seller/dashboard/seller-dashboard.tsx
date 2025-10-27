import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Home,
  MessageSquare,
  Heart,
  Bookmark,
  DollarSign,
  TrendingUp,
  Eye,
  MapPin,
  Filter,
} from "lucide-react";

// Demo ma'lumotlar
const demoData = {
  overview: {
    totalProperties: 24,
    activeListings: 18,
    totalInquiries: 156,
    pendingInquiries: 12,
    totalLikes: 342,
    totalSaves: 89,
    monthlyRevenue: 12500000,
    conversionRate: 12.5,
  },
  properties: [
    {
      id: 1,
      title: {
        uz: "Yangi shahardagi 3 xonali kvartira",
        ru: "3-комнатная квартира в новом городе",
        en: "3-room apartment in new city",
      },
      category: "apartment",
      price: 85000,
      currency: "UZS",
      purpose: "for_rent",
      area: 75,
      bedrooms: 3,
      bathrooms: 2,
      is_premium: true,
      is_verified: true,
      rating: 4.5,
      liked: 23,
      saved: 8,
      inquiries: 15,
      status: "active",
    },
    {
      id: 2,
      title: {
        uz: "Markaziy ofis",
        ru: "Центральный офис",
        en: "Central office",
      },
      category: "office",
      price: 120000,
      currency: "UZS",
      purpose: "for_rent",
      area: 45,
      bedrooms: 0,
      bathrooms: 1,
      is_premium: false,
      is_verified: true,
      rating: 4.2,
      liked: 12,
      saved: 3,
      inquiries: 8,
      status: "active",
    },
  ],
  inquiries: [
    {
      id: 1,
      userName: "Ali Valiyev",
      propertyTitle: "Yangi shahardagi 3 xonali kvartira",
      type: "rent",
      offered_price: 80000,
      comment: "Uzoq muddatli ijara uchun qiziqaman",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      userName: "Dilnoza Xolmatova",
      propertyTitle: "Markaziy ofis",
      type: "purchase",
      offered_price: 115000,
      comment: "Biznesim uchun ofis kerak",
      status: "viewed",
      date: "2024-01-14",
    },
  ],
  analytics: {
    propertyTypes: [
      { name: "Kvartira", value: 12 },
      { name: "Ofis", value: 5 },
      { name: "Uy", value: 4 },
      { name: "Do'kon", value: 3 },
    ],
    purposeDistribution: [
      { name: "Ijaraga", value: 15 },
      { name: "Sotuvga", value: 7 },
      { name: "Tijorat", value: 2 },
    ],
    monthlyStats: [
      { month: "Yan", inquiries: 45, likes: 89, revenue: 8500000 },
      { month: "Fev", inquiries: 52, likes: 94, revenue: 9200000 },
      { month: "Mar", inquiries: 48, likes: 78, revenue: 8100000 },
      { month: "Apr", inquiries: 61, likes: 112, revenue: 12500000 },
    ],
  },
};

// Statistik kartochka komponenti
const StatCard = ({ title, value, icon, description, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
        {trend && (
          <span
            className={`ml-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

// Property kartasi komponenti
const PropertyCard = ({ property }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">{property.title.uz}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            {property.area}m² • {property.bedrooms} xona
          </CardDescription>
        </div>
        <div className="flex gap-1">
          {property.is_premium && <Badge variant="secondary">Premium</Badge>}
          {property.is_verified && (
            <Badge variant="default">Tasdiqlangan</Badge>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-2xl font-bold text-primary">
            {property.price.toLocaleString()} {property.currency}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {property.purpose.replace("_", " ")}
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
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4 text-green-500" />
          <span>{property.inquiries}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// So'rov kartasi komponenti
const InquiryCard = ({ inquiry }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    viewed: "bg-blue-100 text-blue-800",
    responded: "bg-green-100 text-green-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm">{inquiry.userName}</CardTitle>
            <CardDescription>{inquiry.propertyTitle}</CardDescription>
          </div>
          <Badge className={statusColors[inquiry.status]}>
            {inquiry.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{inquiry.comment}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">
            {inquiry.offered_price &&
              `${inquiry.offered_price.toLocaleString()} UZS`}
          </span>
          <span className="text-muted-foreground">{inquiry.date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
          <Button>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Umumiy ko'rinish
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Propertylar
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              So'rovlar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analitika
            </TabsTrigger>
          </TabsList>

          {/* Umumiy ko'rinish */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Jami Propertylar"
                value={demoData.overview.totalProperties}
                icon={<Home className="w-4 h-4 text-muted-foreground" />}
                description="Barcha listinglar"
                trend={8}
              />
              <StatCard
                title="Faol Listinglar"
                value={demoData.overview.activeListings}
                icon={<Eye className="w-4 h-4 text-muted-foreground" />}
                description="Aktiv propertylar"
              />
              <StatCard
                title="Oylik Daromad"
                value={`${(demoData.overview.monthlyRevenue / 1000000).toFixed(
                  1
                )}M UZS`}
                icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
                description="Joriy oy"
                trend={15}
              />
              <StatCard
                title="Konversiya"
                value={`${demoData.overview.conversionRate}%`}
                icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
                description="So'rovdan sotuvgacha"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="So'rovlar"
                value={demoData.overview.totalInquiries}
                icon={
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                }
                description={`${demoData.overview.pendingInquiries} kutilayotgan`}
                trend={12}
              />
              <StatCard
                title="Likes"
                value={demoData.overview.totalLikes}
                icon={<Heart className="w-4 h-4 text-muted-foreground" />}
                description="Foydalanuvchilar yoqtirishlari"
                trend={5}
              />
              <StatCard
                title="Saqlanganlar"
                value={demoData.overview.totalSaves}
                icon={<Bookmark className="w-4 h-4 text-muted-foreground" />}
                description="Property saqlashlar"
              />
            </div>

            {/* Eng yaxshi propertylar */}
            <Card>
              <CardHeader>
                <CardTitle>Eng Yaxshi Propertylar</CardTitle>
                <CardDescription>
                  Eng ko'p so'rov va like olgan propertylaringiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {demoData.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Propertylar */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Barcha Propertylar</CardTitle>
                <CardDescription>
                  Sizning barcha listinglaringiz ro'yxati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {demoData.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* So'rovlar */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demoData.inquiries.map((inquiry) => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>
          </TabsContent>

          {/* Analitika */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Property Turlari</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {demoData.analytics.propertyTypes.map((type, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{type.name}</span>
                        <Badge variant="secondary">{type.value}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maqsadlar Bo'yicha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {demoData.analytics.purposeDistribution.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span>{item.name}</span>
                          <Badge variant="secondary">{item.value}</Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Oylik Statistika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoData.analytics.monthlyStats.map((month, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{month.month}</span>
                          <span>
                            {(month.revenue / 1000000).toFixed(1)}M UZS
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{month.inquiries} so'rov</span>
                          <span>{month.likes} like</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
