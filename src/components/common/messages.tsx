import { messageService } from "@/services/message.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useCallback, useMemo } from "react";

interface Message {
  _id: string;
  user: {
    avatar?: string;
    first_name: string;
    last_name: string;
  };
  rating: number;
  createdAt: string;
  comment: string;
}

interface PageResponse {
  data: Message[];
  total: number;
  page: number;
  limit: number;
}

interface MessagesProps {
  propertyId?: string;
}

export default function Messages({ propertyId }: MessagesProps) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<PageResponse, Error>({
    queryKey: ["messages", propertyId],
    queryFn: ({ pageParam }) =>
      messageService.findMessageByProperty(propertyId!, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 1.0,
    });

    const current = observerTarget.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleIntersection]);

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalReviews = data?.pages[0]?.total ?? 0;

  if (status === "pending") {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        <div className="text-center py-10 border rounded-lg bg-red-50">
          <p className="text-red-600">
            Could not load reviews: {error?.message ?? "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
      <h2 className="text-2xl font-semibold mb-6">Reviews ({totalReviews})</h2>

      {messages.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-gray-600">No reviews yet for this property.</p>
          <p className="text-sm text-gray-500 mt-1">
            Be the first to leave a review!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <ReviewCard key={message._id} message={message} />
          ))}

          <div ref={observerTarget} className="h-4" />

          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {!hasNextPage && (
            <p className="text-center text-gray-500">
              No more reviews to load.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ message }: { message: Message }) {
  const formattedDate = useMemo(
    () =>
      new Date(message.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [message.createdAt]
  );

  const userInitials = useMemo(
    () =>
      `${message.user?.first_name?.[0] || ""}${
        message.user?.last_name?.[0] || ""
      }`,
    [message.user?.first_name, message.user?.last_name]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow-sm bg-white">
      <Avatar className="w-12 h-12 shrink-0">
        <AvatarImage
          src={message.user?.avatar}
          alt={`${message.user?.first_name} ${message.user?.last_name}`}
        />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>

      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
          <h3 className="font-semibold text-gray-800">
            {message.user?.first_name} {message.user?.last_name}
          </h3>
          <StarRating rating={message.rating} />
        </div>

        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="text-gray-700 leading-relaxed">{message.comment}</p>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
