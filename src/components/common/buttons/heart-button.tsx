import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { Heart } from "lucide-react";

export default function HeartButton({ id }: { id: string }) {
  const { user, setUser } = useUserStore();

  const handleLike = async () => {
    try {
      const data = await userService.handleLike(id);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className={
        "bg-white flex items-center gap-2 p-2 rounded border border-black"
      }
      onClick={handleLike}
    >
      <Heart
        className={`w-4 h-4 ${
          user?.likes?.includes(id) ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </button>
  );
}
