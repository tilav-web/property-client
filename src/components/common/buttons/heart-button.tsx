import type { IProperty } from "@/interfaces/property.interface";
import { useLikeStore } from "@/stores/like.store";
import { Heart } from "lucide-react";

export default function HeartButton({ property }: { property: IProperty }) {
  const { toggleLikeProperty } = useLikeStore();

  return (
    <button
      className={
        "bg-white flex items-center gap-2 p-2 rounded border border-black"
      }
      onClick={() => toggleLikeProperty(property?._id)}
    >
      <Heart
        className={`w-4 h-4 ${
          property?.liked ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </button>
  );
}
