import { Heart } from "lucide-react";

export default function HeartButton() {
  return (
    <button className="bg-white flex items-center gap-2 p-2 rounded border border-black">
      <Heart className="w-4 h-4" />
    </button>
  );
}
