import type { IProperty } from "@/interfaces/property.interface";
import { useLikeStore } from "@/stores/like.store";
import { Heart } from "lucide-react";

export default function HeartButton({ property }: { property: IProperty }) {
  const { toggleLikeProperty, likedProperties } = useLikeStore();

  const handleLike = () => {
    toggleLikeProperty(property._id);
  };

  const isLiked = likedProperties.some(
    (item) => item?.property?._id === property?._id
  );

  return (
    <button
      onClick={handleLike}
      className="bg-white flex items-center gap-2 p-2 rounded border border-black"
    >
      <Heart
        className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
    </button>
  );
}
