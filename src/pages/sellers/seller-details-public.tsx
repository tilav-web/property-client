import { useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import Loading from "@/components/common/loadings/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverUrl } from "@/utils/shared";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useLanguageStore } from "@/stores/language.store";
import PropertyCard from "@/components/common/property-card";
import type { IProperty } from "@/interfaces/property/property.interface";

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
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage src={`${serverUrl}/${data.user.avatar}`} />
          <AvatarFallback>
            {data.user.first_name?.[0]}
            {data.user.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">
          {data.user.first_name} {data.user.last_name}
        </h1>
        <p className="text-muted-foreground">{data.user.email.value}</p>
        <div className="mt-2">
          <Badge>{data.business_type}</Badge>
        </div>
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
