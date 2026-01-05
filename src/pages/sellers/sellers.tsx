import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import Loading from "@/components/common/loadings/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultImageAvatar } from "@/utils/shared";
import { Badge } from "@/components/ui/badge";
import LoadMoreButton from "@/components/common/buttons/load-more.button";
import { Link } from "react-router-dom";
import type { ISeller } from "@/interfaces/users/seller.interface";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

const SellerCard = ({ seller }: { seller: ISeller }) => (
  <Link to={`/sellers/${seller._id}`}>
    <Card className="overflow-hidden h-full flex flex-col justify-between items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={seller.user.avatar ?? defaultImageAvatar} />
        <AvatarFallback>
          {seller.user.first_name?.[0]}
          {seller.user.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-xl font-bold">
          {seller.user.first_name} {seller.user.last_name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {seller.user.email.value}
        </CardDescription>
        <div className="mt-2">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {seller.business_type}
          </Badge>
        </div>
      </div>
      <CardContent className="mt-4 w-full">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-bold text-lg">{seller.totalProperties}</p>
            <p className="text-xs text-muted-foreground">Properties</p>
          </div>
          <div>
            <p className="font-bold text-lg">
              {Math.round(seller.avgLikes || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Likes</p>
          </div>
          <div>
            <p className="font-bold text-lg">
              {Math.round(seller.avgSaves || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Saves</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function SellersPage() {
  const limit = 10;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: topSellers, isLoading: topLoading } = useQuery({
    queryKey: ["top-sellers"],
    queryFn: sellerService.findTop,
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["sellers", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      sellerService.findAll({ page: pageParam, limit, search: debouncedSearch }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading sellers.</div>;
  }

  const allSellers = data?.pages.flatMap((page) => page.sellers) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sellers</h1>
      {topLoading ? <Loading /> :
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSellers?.map((seller: ISeller) => (
              <SellerCard key={seller._id} seller={seller} />
            ))}
          </div>
        </div>
      }
      <div className="mb-8">
        <Input
          placeholder="Search sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSellers.map((seller) => (
          <SellerCard key={seller._id} seller={seller} />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <LoadMoreButton
            loading={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </div>
  );
}
