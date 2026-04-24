import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Check, Home, Loader2, X } from "lucide-react";
import type { IChatMessage } from "@/interfaces/chat/chat-message.interface";
import { MessageType } from "@/interfaces/chat/message-type";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format-price";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type TResponseStatus = "approved" | "rejected";

interface Props {
  message: IChatMessage;
  isMine: boolean;
  respondedStatus?: TResponseStatus | null;
  canRespond?: boolean;
  onRespond?: (
    inquiryId: string,
    status: TResponseStatus,
    description: string,
  ) => Promise<void> | void;
}

function timeLabel(iso: string): string {
  try {
    return format(new Date(iso), "HH:mm");
  } catch {
    return "";
  }
}

export default function MessageBubble({
  message,
  isMine,
  respondedStatus,
  canRespond,
  onRespond,
}: Props) {
  const [dialogType, setDialogType] = useState<TResponseStatus | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const align = isMine ? "items-end" : "items-start";
  const bubbleBase =
    "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm break-words";
  const bubbleColor = isMine
    ? "bg-blue-500 text-white rounded-br-md"
    : "bg-white text-gray-900 rounded-bl-md border border-gray-200";

  if (message.type === MessageType.SYSTEM) {
    const meta = (message.metadata ?? {}) as Record<string, unknown>;
    const responseStatus = meta.responseStatus as TResponseStatus | undefined;
    if (responseStatus) {
      const approved = responseStatus === "approved";
      return (
        <div className="flex w-full justify-center py-2">
          <div
            className={cn(
              "max-w-[80%] rounded-xl border px-3 py-2 text-xs",
              approved
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800",
            )}
          >
            <div className="flex items-center gap-1 font-semibold">
              {approved ? <Check size={14} /> : <X size={14} />}
              {approved ? "Taklif qabul qilindi" : "Taklif rad etildi"}
            </div>
            {typeof meta.description === "string" && meta.description && (
              <div className="mt-1 opacity-90">{meta.description}</div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full justify-center py-2">
        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
          {message.body}
        </span>
      </div>
    );
  }

  if (message.type === MessageType.PRICE_OFFER) {
    const meta = (message.metadata ?? {}) as Record<string, unknown>;
    const inquiryId = (meta.inquiryId as string | undefined) ?? undefined;
    const price = (meta.offered_price as number | undefined) ?? null;
    const currency = (meta.currency as string | undefined) ?? undefined;
    const propertyId =
      ((meta.property as { _id?: string } | undefined)?._id as
        | string
        | undefined) ?? undefined;
    const comment = (meta.comment as string | undefined) ?? "";

    const showActions =
      Boolean(canRespond) &&
      Boolean(inquiryId) &&
      !respondedStatus &&
      Boolean(onRespond);

    const handleSubmit = async () => {
      if (!dialogType || !inquiryId || !onRespond) return;
      setSubmitting(true);
      try {
        await onRespond(inquiryId, dialogType, description);
        setDialogType(null);
        setDescription("");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className={cn("flex w-full flex-col gap-1", align)}>
        <div
          className={cn(
            bubbleBase,
            isMine
              ? "bg-amber-500 text-white rounded-br-md"
              : "bg-amber-50 text-amber-900 rounded-bl-md border border-amber-200",
          )}
        >
          <div className="mb-1 text-xs font-semibold opacity-80">
            💰 Price offer
          </div>
          {price !== null && (
            <div className="text-lg font-bold">
              {formatPrice(price, currency)}
            </div>
          )}
          {comment && <div className="mt-1 text-sm">{comment}</div>}
          {propertyId && (
            <Link
              to={`/property/${propertyId}`}
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs underline",
                isMine ? "text-white/90" : "text-amber-800",
              )}
            >
              <Home size={12} /> E’lonni ochish
            </Link>
          )}

          {respondedStatus && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                respondedStatus === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800",
              )}
            >
              {respondedStatus === "approved" ? (
                <Check size={12} />
              ) : (
                <X size={12} />
              )}
              {respondedStatus === "approved"
                ? "Qabul qilindi"
                : "Rad etildi"}
            </div>
          )}

          {showActions && (
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={() => setDialogType("rejected")}
              >
                <X size={14} />
                <span className="ml-1">Rad etish</span>
              </Button>
              <Button
                size="sm"
                className="h-8 bg-green-600 hover:bg-green-700"
                onClick={() => setDialogType("approved")}
              >
                <Check size={14} />
                <span className="ml-1">Qabul qilish</span>
              </Button>
            </div>
          )}
        </div>
        <span className="px-1 text-[10px] text-gray-400">
          {timeLabel(message.createdAt)}
        </span>

        <Dialog
          open={dialogType !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDialogType(null);
              setDescription("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {dialogType === "approved" ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                {dialogType === "approved"
                  ? "Taklifni qabul qilish"
                  : "Taklifni rad etish"}
              </DialogTitle>
              <DialogDescription>
                {dialogType === "approved"
                  ? "Qabul qilish sababini (yoki tafsilotlarni) kiriting. Xaridor chatda ko'radi."
                  : "Rad etish sababini kiriting. Xaridor chatda ko'radi."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-2">
              <Label htmlFor="response-description" className="text-sm">
                Izoh
              </Label>
              <Textarea
                id="response-description"
                placeholder={
                  dialogType === "approved"
                    ? "Kelishamiz, bog'lanib qolamiz..."
                    : "Uzr, narx past..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[110px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogType(null);
                  setDescription("");
                }}
                disabled={submitting}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !description.trim()}
                className={
                  dialogType === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {dialogType === "approved" ? "Qabul qilish" : "Rad etish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (message.type === MessageType.PROPERTY_REFERENCE) {
    const meta = (message.metadata ?? {}) as Record<string, unknown>;
    const propertyId = (meta.propertyId as string | undefined) ?? undefined;
    return (
      <div className={cn("flex w-full flex-col gap-1", align)}>
        <div
          className={cn(
            bubbleBase,
            isMine
              ? "bg-blue-50 text-blue-900 border border-blue-200 rounded-br-md"
              : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md",
          )}
        >
          <div className="flex items-center gap-2 text-xs">
            <Home size={14} className="text-blue-500" />
            {message.body}
          </div>
          {propertyId && (
            <Link
              to={`/property/${propertyId}`}
              className="mt-1 inline-block text-xs text-blue-600 underline"
            >
              E’lonni ochish
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-1", align)}>
      <div className={cn(bubbleBase, bubbleColor)}>{message.body}</div>
      <span className="px-1 text-[10px] text-gray-400">
        {timeLabel(message.createdAt)}
      </span>
    </div>
  );
}
