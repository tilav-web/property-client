import type { IProperty } from "@/interfaces/property.interface";
import { useSaveStore } from "@/stores/save.store";
import { useUserStore } from "@/stores/user.store";
import { serverUrl } from "@/utils/shared";
import {
  EllipsisVertical,
  Share2,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EllipsisVerticalButton({ property }: { property: IProperty }) {
  const { user } = useUserStore();
  const { toggleSaveProperty, savedProperties } = useSaveStore();

  const isSaved = savedProperties.some(
    (item) => item?.property?._id === property?._id
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title[user?.lan ?? "uz"],
        text: property?.description[user?.lan ?? "uz"],
        url: `${serverUrl}/properties/share/${property?._id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link nusxalandi!");
    }
  };

  const handleSave = () => {
    if (property?._id) toggleSaveProperty(property._id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-[#FAD397] flex items-center gap-2 p-2 rounded border border-black hover:bg-[#F8C97D] transition-colors">
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <button
            onClick={handleShare}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Ulashish</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!user}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
              !user && "line-through"
            }`}
            title={
              user
                ? isSaved
                  ? "Saqlanganlardan o‘chirish"
                  : "Saqlab qo‘yish"
                : "Saqlash uchun tizimga kiring!"
            }
          >
            <Bookmark
              className={`w-4 h-4 ${isSaved ? "fill-current text-yellow-500" : ""}`}
            />
            <span>{isSaved ? "Saqlangan" : "Saqlash"}</span>
          </button>

          <button
            disabled={!user}
            onClick={() => console.log("Komment yozish")}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
              !user && "line-through"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Komment yozish</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
