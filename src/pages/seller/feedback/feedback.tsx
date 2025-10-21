import { useState, useEffect } from "react";
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

// Types
interface Phone {
  value: string;
  isVerified: boolean;
}

interface Email {
  value: string;
  isVerified: boolean;
}

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  phone: Phone;
  avatar?: string;
  role: string;
  lan: string;
  email: Email;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Title {
  uz: string;
  ru: string;
  en: string;
}

interface Description {
  uz: string;
  ru: string;
  en: string;
}

interface Location {
  type: string;
  coordinates: number[];
}

interface Address {
  uz: string;
  ru: string;
  en: string;
}

interface Property {
  _id: string;
  author: string;
  title: Title;
  description: Description;
  category: string;
  location: Location;
  address: Address;
  price: number;
  purpose: string;
  currency: string;
  price_type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor_level: number;
  amenities: string[];
  construction_status: string;
  parking_spaces: number;
  is_premium: boolean;
  is_verified: boolean;
  rating: number;
  logo: string | null;
  payment_plans: number;
  region: string;
  district: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  like: number;
  save: number;
  liked: number;
  saved: number;
}

interface Message {
  _id: string;
  user: User;
  property: Property;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Notification {
  _id: string;
  message: Message;
  seller: User;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type DeleteDialogState = {
  isOpen: boolean;
  messageId: string | null;
  userName: string;
  type: "single" | "all";
};

export default function Feedback() {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    messageId: null,
    userName: "",
    type: "single",
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data: Notification[] = await messageService.findMessageStatus(
        false
      );
      setMessages(data);
    } catch (err) {
      setError("Xabarlarni yuklashda xatolik yuz berdi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string): Promise<void> => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, is_read: true } : msg
        )
      );

      console.log(`is_read: true for message ${messageId}`);
    } catch (err) {
      console.error("Xabarni o'qilgan deb belgilashda xatolik:", err);
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    try {
      setMessages((prev) => prev.map((msg) => ({ ...msg, is_read: true })));

      console.log("Barcha xabarlar o'qilgan deb belgilandi");
    } catch (err) {
      console.error("Barcha xabarlarni belgilashda xatolik:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    try {
      setDeletingId(messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      console.log(`Message ${messageId} deleted`);
    } catch (err) {
      console.error("Xabarni o'chirishda xatolik:", err);
      setError("Xabarni o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
      setDeleteDialog({
        isOpen: false,
        messageId: null,
        userName: "",
        type: "single",
      });
    }
  };

  const handleDeleteAllMessages = async (): Promise<void> => {
    try {
      setDeletingId("all");
      setMessages([]);
      console.log("Barcha xabarlar o'chirildi");
    } catch (err) {
      console.error("Barcha xabarlarni o'chirishda xatolik:", err);
      setError("Barcha xabarlarni o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
      setDeleteDialog({
        isOpen: false,
        messageId: null,
        userName: "",
        type: "single",
      });
    }
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

  const getPropertyTitle = (property: Property): string => {
    return (
      property.title.uz || property.title.en || property.title.ru || "Noma'lum"
    );
  };

  const unreadCount: number = messages.filter((msg) => !msg.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Xabarlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">{error}</div>
            <Button onClick={loadMessages}>Qayta urinish</Button>
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
            {messages.length > 0
              ? `${messages.length} ta xabar, shundan ${unreadCount} tasi o'qilmagan`
              : "Xabarlar topilmadi"}
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="gap-2"
              variant="outline"
            >
              <CheckCircle className="h-4 w-4" />
              Barchasini o'qilgan deb belgilash
            </Button>
          )}

          {messages.length > 0 && (
            <Button
              onClick={() => openDeleteDialog(null, "", "all")}
              className="gap-2"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Barchasini o'chirish
            </Button>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
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
          {messages.map((message) => (
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
                        src={message.message.user.avatar}
                        alt={`${message.message.user.first_name} ${message.message.user.last_name}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          message.message.user.first_name,
                          message.message.user.last_name
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
                        className="bg-primary text-primary-foreground"
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
                      {getPropertyTitle(message.message.property)}
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
                      >
                        <CheckCircle className="h-3 w-3" />
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
                      disabled={deletingId === message._id}
                    >
                      {deletingId === message._id ? (
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
                ? `Haqiqatan ham barcha ${messages.length} ta xabarni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`
                : `Haqiqatan ham ${deleteDialog.userName} ning xabarini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.type === "all"
                  ? handleDeleteAllMessages()
                  : deleteDialog.messageId &&
                    handleDeleteMessage(deleteDialog.messageId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
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
