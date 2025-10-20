import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export default function EllipsisVerticalButton({
  property,
}: {
  property: IProperty;
}) {
  const { user } = useUserStore();
  const { toggleSaveProperty } = useSaveStore();
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
    if (property?._id) {
      toggleSaveProperty(property._id);
    }
  };

  const handleComment = () => {
    console.log("Komment yozish");
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
          {/* Ulashish tugmasi */}
          <button
            onClick={handleShare}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Ulashish</span>
          </button>

          {/* Saqlash tugmasi */}
          <button
            onClick={handleSave}
            disabled={!user}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
              !user && "line-through"
            }`}
            title={
              user
                ? property?.saved
                  ? "Saqlanganlardan o'chirish"
                  : "Saqlab qo'yish"
                : "Saqlash uchun tizimga kiring!"
            }
          >
            <Bookmark
              className={`w-4 h-4 ${
                property?.saved ? "fill-current text-yellow-500" : ""
              }`}
            />
            <span>{property?.saved ? "Saqlangan" : "Saqlash"}</span>
          </button>

          <button
            disabled={!user}
            onClick={handleComment}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
              !user && "line-through"
            }`}
            title={
              user
                ? "Komment qoldiring"
                : "Komment qoldirish uchun tizimga kiring!"
            }
          >
            <MessageCircle className="w-4 h-4" />
            <span>Komment yozish</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
