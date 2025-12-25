import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/message.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  MessageSquare,
  Building,
  Star,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { IMessageStatus } from "@/interfaces/message/message-status.interface";
import { useState } from "react";
import { defaultImageAvatar } from "@/utils/shared";

type DeleteDialogState = {
  isOpen: boolean;
  messageId: string | null;
  userName: string;
  type: "single" | "all";
};

export default function Feedback() {
  const queryClient = useQueryClient();

  // Xabarlarni olish uchun React Query
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages/status"],
    queryFn: () => messageService.findMessageStatus(),
  });

  // O'qilgan deb belgilash mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) =>
      messageService.readMessageStatus(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages/status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages/status", "unread"],
      });
    },
  });

  // Barchasini o'qilgan deb belgilash mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => messageService.readMessageStatusAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages/status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages/status", "unread"],
      });
    },
  });

  // Bitta xabarni o'chirish mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) =>
      messageService.deleteStatusMessageById(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages/status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages/status", "unread"],
      });
    },
  });

  // Barcha xabarlarni o'chirish mutation
  const deleteAllMessagesMutation = useMutation({
    mutationFn: () => messageService.deleteStatusMessageAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages/status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages/status", "unread"],
      });
    },
  });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    messageId: null,
    userName: "",
    type: "single",
  });

  const handleMarkAsRead = async (messageId: string): Promise<void> => {
    markAsReadMutation.mutate(messageId);
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    deleteMessageMutation.mutate(messageId, {
      onSuccess: () => {
        setDeleteDialog({
          isOpen: false,
          messageId: null,
          userName: "",
          type: "single",
        });
      },
    });
  };

  const handleDeleteAllMessages = async (): Promise<void> => {
    deleteAllMessagesMutation.mutate(undefined, {
      onSuccess: () => {
        setDeleteDialog({
          isOpen: false,
          messageId: null,
          userName: "",
          type: "single",
        });
      },
    });
  };

  const openDeleteDialog = (
    messageId: string | null,
    userName: string,
    type: "single" | "all" = "single"
  ): void => {
    setDeleteDialog({
      isOpen: true,
      messageId,
      userName,
      type,
    });
  };

  const closeDeleteDialog = (): void => {
    setDeleteDialog({
      isOpen: false,
      messageId: null,
      userName: "",
      type: "single",
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const unreadCount: number = messages
    ? messages?.filter((msg: IMessageStatus) => !msg.is_read).length
    : 0;

  // Loading holati
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Xabarlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Error holati
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              Xabarlarni yuklashda xatolik yuz berdi
            </div>
            <Button
              onClick={() =>
                queryClient.refetchQueries({ queryKey: ["messages"] })
              }
            >
              Qayta urinish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Fikr-mulohazalar</h1>
          <p className="text-muted-foreground mt-2">
            {messages && messages?.length > 0
              ? `${messages?.length} ta xabar, shundan ${unreadCount} tasi o'qilmagan`
              : "Xabarlar topilmadi"}
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="gap-2"
              variant="outline"
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Barchasini o'qilgan deb belgilash
            </Button>
          )}

          {messages && messages?.length > 0 && (
            <Button
              onClick={() => openDeleteDialog(null, "", "all")}
              className="gap-2 text-white"
              variant="destructive"
              disabled={deleteAllMessagesMutation.isPending}
            >
              {deleteAllMessagesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Barchasini o'chirish
            </Button>
          )}
        </div>
      </div>

      {messages?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Xabarlar topilmadi</h3>
            <p className="text-muted-foreground">
              Hozircha yangi xabarlar mavjud emas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages?.map((message: IMessageStatus) => (
            <Card
              key={message._id}
              className={`transition-all duration-200 hover:shadow-md ${
                !message.is_read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={message.message.user.avatar ?? defaultImageAvatar}
                        alt={`${message.message.user.first_name ?? ''} ${message.message.user.last_name ?? ''}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          message.message.user.first_name ?? '',
                          message.message.user.last_name ?? ''
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {message.message.user.first_name}{" "}
                        {message.message.user.last_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {message.message.user.email.value}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!message.is_read && (
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground hover:text-black cursor-pointer"
                      >
                        Yangi
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {message.message.rating}{" "}
                      <Star className="h-3 w-3 ml-1 fill-current" />
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4 mr-1" />
                    <span className="font-medium">Uy haqida:</span>
                    <span className="ml-2">
                      {message.message.property.title}
                    </span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mt-2">
                    <p className="text-sm">{message.message.comment}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(message.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    {!message.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(message._id)}
                        className="gap-1"
                        disabled={markAsReadMutation.isPending}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        O'qildi
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        openDeleteDialog(
                          message._id,
                          `${message.message.user.first_name} ${message.message.user.last_name}`
                        )
                      }
                      className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={deleteMessageMutation.isPending}
                    >
                      {deleteMessageMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      O'chirish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteDialog.type === "all"
                ? "Barcha xabarlarni o'chirish"
                : "Xabarni o'chirish"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === "all"
                ? `Haqiqatan ham barcha ${messages?.length} ta xabarni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`
                : `Haqiqatan ham ${deleteDialog.userName} ning xabarini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deleteMessageMutation.isPending ||
                deleteAllMessagesMutation.isPending
              }
            >
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.type === "all"
                  ? handleDeleteAllMessages()
                  : deleteDialog.messageId &&
                    handleDeleteMessage(deleteDialog.messageId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
              disabled={
                deleteMessageMutation.isPending ||
                deleteAllMessagesMutation.isPending
              }
            >
              {deleteMessageMutation.isPending ||
              deleteAllMessagesMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  O'chirilmoqda...
                </>
              ) : (
                "O'chirish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
