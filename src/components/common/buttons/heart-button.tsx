import type { IProperty } from "@/interfaces/property.interface";
import { likeService } from "@/services/like.service";
import { useLikeStore } from "@/stores/like.store";
import { useUserStore } from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";

export default function HeartButton({ id }: { id: string }) {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { toggleLikeProperty } = useLikeStore();

  const { data: likedProperties } = useQuery({
    queryKey: ["liked-properties", user?._id],
    queryFn: () => likeService.findMyLikes(),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => toggleLikeProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["liked-properties", user?._id],
      });
    },
  });

  const handleLike = () => {
    mutation.mutate(id);
  };

  const isLiked = likedProperties?.some((p: IProperty) => p._id === id);

  return (
    <button
      className={
        "bg-white flex items-center gap-2 p-2 rounded border border-black"
      }
      onClick={handleLike}
    >
      <Heart
        className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
    </button>
  );
}
