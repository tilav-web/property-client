import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../_services/admin.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Home,
  User,
  Briefcase,
  CheckCircle,
  Megaphone,
  Hourglass,
  DollarSign,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard-statistics"],
    queryFn: adminService.getDashboardStatistics,
  });

  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading dashboard statistics: {error?.message}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Properties",
      value: data?.totalProperties,
      icon: <Home className="h-4 w-4 text-muted-foreground" />,
      description: "All properties in the system",
    },
    {
      title: "Approved Properties",
      value: data?.approvedProperties,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      description: "Properties approved by admin",
    },
    {
      title: "Total Users",
      value: data?.totalUsers,
      icon: <User className="h-4 w-4 text-muted-foreground" />,
      description: "Total registered users",
    },
    {
      title: "Total Sellers",
      value: data?.totalSellers,
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      description: "Total registered sellers",
    },
    {
      title: "Total Advertisements",
      value: data?.totalAdvertises,
      icon: <Megaphone className="h-4 w-4 text-muted-foreground" />,
      description: "All advertisements in the system",
    },
    {
      title: "Approved Advertisements",
      value: data?.approvedAdvertises,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      description: "Advertisements approved by admin",
    },
    {
      title: "Pending Advertisements",
      value: data?.pendingAdvertises,
      icon: <Hourglass className="h-4 w-4 text-muted-foreground" />,
      description: "Advertisements awaiting approval",
    },
    {
      title: "Paid Advertisements",
      value: data?.paidAdvertises,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: "Advertisements with paid status",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value !== undefined ? stat.value : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
