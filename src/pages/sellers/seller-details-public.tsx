import { useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import Loading from "@/components/common/loadings/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useLanguageStore } from "@/stores/language.store";
import PropertyCard from "@/components/common/property-card";
import type { IProperty } from "@/interfaces/property/property.interface";
import { defaultImageAvatar } from "@/utils/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Hash, Home, User } from "lucide-react";
import { format } from "date-fns";
import type { IYttSeller } from "@/interfaces/users/ytt-yeller.interface";
import type { ISelfEmployedSeller } from "@/interfaces/users/self-employed-seller.interface";
import type { IPhysical } from "@/interfaces/users/physical.interface";
import type { IMchjSeller } from "@/interfaces/users/mchj-seller.interface";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import InstagramButton from "@/components/common/buttons/instagram-button";
import TelegramButton from "@/components/common/buttons/telegram-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex items-center gap-4">
    <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md font-semibold">{value}</p>
    </div>
  </div>
);

const renderBusinessTypeDetails = (data: {
  business_type: string;
  ytt?: IYttSeller;
  mchj?: IMchjSeller;
  self_employed?: ISelfEmployedSeller;
  physical?: IPhysical;
}) => {
  switch (data.business_type) {
    case "ytt":
      return (
        data.ytt && (
          <Card>
            <CardHeader>
              <CardTitle>YTT Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<Building className="w-5 h-5 text-gray-600" />}
                label="Company Name"
                value={data.ytt!.company_name}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="INN"
                value={data.ytt!.inn}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="PINFL"
                value={data.ytt!.pinfl}
              />
              <DetailItem
                icon={<Home className="w-5 h-5 text-gray-600" />}
                label="Business Registration Address"
                value={data.ytt!.business_reg_address}
              />
            </CardContent>
          </Card>
        )
      );
    case "mchj":
      return (
        data.mchj && (
          <Card>
            <CardHeader>
              <CardTitle>MCHJ Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<Building className="w-5 h-5 text-gray-600" />}
                label="Company Name"
                value={data.mchj!.company_name}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="STIR"
                value={data.mchj!.stir}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="OKED"
                value={data.mchj!.oked}
              />
              <DetailItem
                icon={<Home className="w-5 h-5 text-gray-600" />}
                label="Registration Address"
                value={data.mchj!.registration_address}
              />
            </CardContent>
          </Card>
        )
      );
    case "self_employed":
      return (
        data.self_employed && (
          <Card>
            <CardHeader>
              <CardTitle>Self-Employed Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<User className="w-5 h-5 text-gray-600" />}
                label="First Name"
                value={data.self_employed!.first_name}
              />
              <DetailItem
                icon={<User className="w-5 h-5 text-gray-600" />}
                label="Last Name"
                value={data.self_employed!.last_name}
              />
              <DetailItem
                icon={<Calendar className="w-5 h-5 text-gray-600" />}
                label="Birth Date"
                value={format(new Date(data.self_employed!.birth_date), "PPP")}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="JSHSHIR"
                value={data.self_employed!.jshshir}
              />
              <DetailItem
                icon={<Home className="w-5 h-5 text-gray-600" />}
                label="Registration Address"
                value={data.self_employed!.registration_address}
              />
            </CardContent>
          </Card>
        )
      );
    case "physical":
      return (
        data.physical && (
          <Card>
            <CardHeader>
              <CardTitle>Physical Person Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<User className="w-5 h-5 text-gray-600" />}
                label="First Name"
                value={data.physical!.first_name}
              />
              <DetailItem
                icon={<User className="w-5 h-5 text-gray-600" />}
                label="Last Name"
                value={data.physical!.last_name}
              />
              <DetailItem
                icon={<Calendar className="w-5 h-5 text-gray-600" />}
                label="Birth Date"
                value={format(new Date(data.physical!.birth_date), "PPP")}
              />
              <DetailItem
                icon={<Hash className="w-5 h-5 text-gray-600" />}
                label="JSHSHIR"
                value={data.physical!.jshshir}
              />
            </CardContent>
          </Card>
        )
      );
    default:
      return null;
  }
};

export default function PublicSellerDetailsPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { language } = useLanguageStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seller", sellerId, language],
    queryFn: () => sellerService.findOne(sellerId!, language),
    enabled: !!sellerId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading seller details.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={data.user.avatar ?? defaultImageAvatar} />
                <AvatarFallback>
                  {data.user.first_name?.[0]}
                  {data.user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">
                {data.user.first_name} {data.user.last_name}
              </h1>
              <div className="mt-2">
                <Badge>{data.business_type}</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <CallButton phone={data.user.phone.value} />
              <MailButton mail={data.user.email.value} />
              {data.instagram && <InstagramButton username={data.instagram} />}
              {data.telegram && <TelegramButton username={data.telegram} />}
              {data.whatsapp && <WhatsAppButton phone={data.whatsapp} />}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">{renderBusinessTypeDetails(data)}</div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.properties.map((property: IProperty) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}