import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminSellerService } from "../../_services/admin-seller.service";
import Loading from "@/components/common/loadings/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverUrl } from "@/utils/shared";
import { Badge } from "@/components/ui/badge";
import SellerProperties from "./components/SellerProperties";

export default function SellerDetailsPage() {
  const { sellerId } = useParams<{ sellerId: string }>();

  const {
    data: seller,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-seller", sellerId],
    queryFn: () => adminSellerService.findOne(sellerId!),
    enabled: !!sellerId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !seller) {
    return <div>Error loading seller details.</div>;
  }

  return (
    <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`${serverUrl}/${seller.user.avatar}`} />
              <AvatarFallback>
                {seller.user.first_name?.[0]}
                {seller.user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {seller.user.first_name} {seller.user.last_name}
              </h2>
              <p className="text-muted-foreground">{seller.user.email.value}</p>
              <p className="text-muted-foreground">{seller.user.phone.value}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Business Type</p>
              <p>{seller.business_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{seller.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Passport</p>
              <p>{seller.passport}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {seller.ytt && (
        <Card>
          <CardHeader>
            <CardTitle>YTT Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display YTT details here */}
            <pre>{JSON.stringify(seller.ytt, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {seller.mchj && (
        <Card>
          <CardHeader>
            <CardTitle>MCHJ Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display MCHJ details here */}
            <pre>{JSON.stringify(seller.mchj, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {seller.self_employed && (
        <Card>
          <CardHeader>
            <CardTitle>Self-Employed Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display Self-Employed details here */}
            <pre>{JSON.stringify(seller.self_employed, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {seller.physical && (
        <Card>
          <CardHeader>
            <CardTitle>Physical Person Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display Physical Person details here */}
            <pre>{JSON.stringify(seller.physical, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {seller.bank_account && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display Bank Account details here */}
            <pre>{JSON.stringify(seller.bank_account, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {seller.commissioner && (
        <Card>
          <CardHeader>
            <CardTitle>Commissioner</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display Commissioner details here */}
            <pre>{JSON.stringify(seller.commissioner, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Seller Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <SellerProperties sellerId={seller._id} />
        </CardContent>
      </Card>
    </div>
  );
}
