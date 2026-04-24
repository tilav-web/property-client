import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bookmark,
  EllipsisVertical,
  MessageCircle,
  Share2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import type { IProperty } from "@/interfaces/property/property.interface";
import { useSaveStore } from "@/stores/save.store";
import { useUserStore } from "@/stores/user.store";
import { useUiStore } from "@/stores/ui.store";
import { messageService } from "@/services/message.service";
import { serverUrl } from "@/utils/shared";
import { cn } from "@/lib/utils";

export default function EllipsisVerticalButton({
  property,
}: {
  property: IProperty;
}) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openLoginDialog } = useUiStore();
  const { toggleSaveProperty, savedProperties } = useSaveStore();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSaved = savedProperties.some(
    (item) => item?.property?._id === property?._id,
  );

  const handleShare = async () => {
    const url = `${serverUrl}/properties/share/${property?._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // fallthrough
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        t("common.buttons.property_actions.link_copied", {
          defaultValue: "Link copied",
        }),
      );
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    if (!user?._id) {
      openLoginDialog();
      toast.message(
        t("common.buttons.property_actions.save_login_required", {
          defaultValue: "Log in to save",
        }),
      );
      return;
    }
    if (property?._id) toggleSaveProperty(property._id);
  };

  const resetState = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  const handleSubmitMessage = async () => {
    if (!rating || !comment.trim()) return;
    setSubmitting(true);
    try {
      await messageService.create({
        rating,
        comment: comment.trim(),
        property: property?._id,
      });
      toast.success(
        t("common.buttons.property_actions.rate_dialog.success_title", {
          defaultValue: "Thank you",
        }),
        {
          description: t(
            "common.buttons.property_actions.rate_dialog.success_description",
            { defaultValue: "Your review has been submitted." },
          ),
        },
      );
      resetState();
    } catch (err) {
      console.error("comment submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isOwner = user?._id === property?.author?._id;

  const starsLabel =
    rating === 1
      ? t("common.buttons.property_actions.rate_dialog.star_single", {
          count: rating,
          defaultValue: "{{count}} star",
        })
      : t("common.buttons.property_actions.rate_dialog.star_multiple", {
          count: rating,
          defaultValue: "{{count}} stars",
        });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-[#FAD397] flex items-center gap-2 p-2 rounded border border-black hover:bg-[#F8C97D] transition-colors">
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-52 p-2" align="end">
        <div className="space-y-1">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {t("common.buttons.property_actions.share", {
                defaultValue: "Share",
              })}
            </span>
          </button>

          {!isOwner && (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              title={
                isSaved
                  ? t("common.buttons.property_actions.unsave_hint", {
                      defaultValue: "Remove from saved",
                    })
                  : t("common.buttons.property_actions.save_hint", {
                      defaultValue: "Save",
                    })
              }
            >
              <Bookmark
                className={cn(
                  "w-4 h-4",
                  isSaved && "fill-yellow-500 text-yellow-500",
                )}
              />
              <span>
                {isSaved
                  ? t("common.buttons.property_actions.saved", {
                      defaultValue: "Saved",
                    })
                  : t("common.buttons.property_actions.save", {
                      defaultValue: "Save",
                    })}
              </span>
            </button>
          )}

          {!isOwner && (
            <Dialog
              onOpenChange={(next) => {
                if (!next) resetState();
                if (next && !user?._id) {
                  openLoginDialog();
                  toast.message(
                    t("common.buttons.property_actions.comment_login_required", {
                      defaultValue: "Log in to write a review",
                    }),
                  );
                }
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {t("common.buttons.property_actions.comment", {
                      defaultValue: "Review",
                    })}
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>
                    {t("common.buttons.property_actions.rate_dialog.title", {
                      defaultValue: "Rate this property",
                    })}
                  </DialogTitle>
                  <DialogDescription>
                    {t(
                      "common.buttons.property_actions.rate_dialog.description",
                      {
                        defaultValue:
                          "Share your opinion and rate on a 5-star scale.",
                      },
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-5">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={40}
                            className={cn(
                              "transition-colors",
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {rating > 0
                        ? starsLabel
                        : t(
                            "common.buttons.property_actions.rate_dialog.select_rating",
                            { defaultValue: "Select a rating" },
                          )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="ev-property-comment"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t(
                        "common.buttons.property_actions.rate_dialog.your_opinion",
                        { defaultValue: "Your opinion" },
                      )}
                    </label>
                    <textarea
                      id="ev-property-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        t(
                          "common.buttons.property_actions.rate_dialog.placeholder",
                          { defaultValue: "Write your feedback..." },
                        ) as string
                      }
                      className="w-full min-h-28 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-gray-50"
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-400 text-right">
                      {comment.length}/500
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={resetState}
                    disabled={submitting}
                  >
                    {t(
                      "common.buttons.property_actions.rate_dialog.cancel",
                      { defaultValue: "Cancel" },
                    )}
                  </Button>
                  <Button
                    onClick={handleSubmitMessage}
                    disabled={submitting || !rating || !comment.trim()}
                  >
                    {t(
                      "common.buttons.property_actions.rate_dialog.submit",
                      { defaultValue: "Submit" },
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
