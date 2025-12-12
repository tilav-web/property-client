import { useQuery } from "@tanstack/react-query";
import { inquiryService } from "@/services/inquiry.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  MessageSquare,
  Building,
  User,
  DollarSign,
  Calendar,
  Check,
  X,
} from "lucide-react";
import type { IInquiry } from "@/interfaces/inquiry/inquiry.interface";
import { serverUrl } from "@/utils/shared";

export default function InquiriesPage() {

  const {
    data: inquiries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => inquiryService.findSellerInquiries(),
  });

  const getInitials = (
    firstName: string = "",
    lastName: string = ""
  ): string => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">So'rovlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Xatolik yuz berdi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">So'rovlar topilmadi</h3>
            <p className="text-muted-foreground">
              Hozircha yangi so'rovlar mavjud emas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry: IInquiry) => (
            <Card key={inquiry._id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`${serverUrl}/uploads${inquiry.user.avatar}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          inquiry.user.first_name,
                          inquiry.user.last_name
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {inquiry.user.first_name} {inquiry.user.last_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {inquiry?.user?.email?.value}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      inquiry.status === "pending" ? "default" : "secondary"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Mulk:</span>
                    {inquiry?.property?.title && (
                      <span>{inquiry?.property?.title}</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Taklif:</span>
                    <span>
                      {inquiry.offered_price?.toLocaleString() || "N/A"} UZS
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Turi:</span>
                    <span>{inquiry.type}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Sana:</span>
                    <span>{formatDate(inquiry.createdAt)}</span>
                  </div>
                </div>

                {inquiry.comment && (
                  <div className="bg-muted/50 rounded-lg p-3 mt-4">
                    <p className="text-sm font-medium mb-1">Izoh:</p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.comment}
                    </p>
                  </div>
                )}

                <div className="flex justify-end items-center pt-4 mt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                      Rad etish
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      Qabul qilish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
