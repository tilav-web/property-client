import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IProperty } from "@/interfaces/property/property.interface";
import { useUserStore } from "@/stores/user.store";
import { useUiStore } from "@/stores/ui.store";
import { messageService } from "@/services/message.service";
import { cn } from "@/lib/utils";

interface Props {
  property: IProperty;
  compact?: boolean;
}

export default function CommentButton({ property, compact = false }: Props) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openLoginDialog } = useUiStore();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canOpen = Boolean(user?._id);

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!canOpen) {
      e.preventDefault();
      openLoginDialog();
      toast.message(
        t("common.buttons.property_actions.comment_login_required", {
          defaultValue: "Log in to write a review",
        }),
      );
    }
  };

  const resetState = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  const handleSubmit = async () => {
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
      setOpen(false);
      resetState();
    } catch (err) {
      console.error("comment submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!canOpen && next) return;
        setOpen(next);
        if (!next) resetState();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0 hover:bg-gray-50 transition-colors"
          title={t("common.buttons.property_actions.comment", {
            defaultValue: "Review",
          })}
        >
          <MessageCircle className="w-4 h-4" />
          {!compact && (
            <span className="hidden sm:inline">
              {t("common.buttons.property_actions.comment", {
                defaultValue: "Review",
              })}
            </span>
          )}
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
            {t("common.buttons.property_actions.rate_dialog.description", {
              defaultValue:
                "Share your opinion and rate on a 5-star scale.",
            })}
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
              htmlFor="property-comment"
              className="text-sm font-medium text-gray-700"
            >
              {t("common.buttons.property_actions.rate_dialog.your_opinion", {
                defaultValue: "Your opinion",
              })}
            </label>
            <textarea
              id="property-comment"
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
            onClick={() => {
              setOpen(false);
              resetState();
            }}
            disabled={submitting}
          >
            {t("common.buttons.property_actions.rate_dialog.cancel", {
              defaultValue: "Cancel",
            })}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !rating || !comment.trim()}
          >
            {t("common.buttons.property_actions.rate_dialog.submit", {
              defaultValue: "Submit",
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
