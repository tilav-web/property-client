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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { messageService } from "@/services/message.service";
import { toast } from "sonner";

export default function EllipsisVerticalButton({
  property,
}: {
  property: IProperty;
}) {
  const { user } = useUserStore();
  const { toggleSaveProperty, savedProperties } = useSaveStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

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

  const handleSubmitMessage = async () => {
    console.log({
      rating,
      comment: comment.trim(),
      property: property._id,
    });
    try {
      await messageService.create({
        rating,
        comment,
        property: property._id,
      });
      toast.success("Success", {
        description: "Message yuborildi",
      });
    } catch (error) {
      console.error(error);
    }
    setRating(0);
    setComment("");
    setHoverRating(0);
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
              className={`w-4 h-4 ${
                isSaved ? "fill-current text-yellow-500" : ""
              }`}
            />
            <span>{isSaved ? "Saqlangan" : "Saqlash"}</span>
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button
                disabled={!user}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                  !user && "line-through"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Komment yozish</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl bg-white shadow-2xl p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-800">
                  Mahsulotni baholang
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-1">
                  Mahsulot haqida fikringizni bildiring va 5 yulduzli tizimda
                  baholang.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-6">
                {/* Yulduzlar reytingi */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="md:text-8xl text-6xl focus:outline-none transition-transform transform hover:scale-135 active:scale-95"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {star <= (hoverRating || rating) ? (
                          <span className="text-yellow-400 drop-shadow-md">
                            ★
                          </span>
                        ) : (
                          <span className="text-gray-200 drop-shadow-sm">
                            ★
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {rating > 0 ? `${rating} yulduz` : "Baholashni tanlang"}
                  </div>
                </div>

                {/* Komment maydoni */}
                <div className="space-y-3">
                  <label
                    htmlFor="comment"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Sizning fikringiz
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Mahsulot haqida fikringizni yozing..."
                    className="w-full h-36 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200 resize-none bg-gray-50"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-400 text-right">
                    {comment.length}/500
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRating(0);
                    setComment("");
                    setHoverRating(0);
                  }}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleSubmitMessage}
                  disabled={!rating || !comment.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Yuborish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
