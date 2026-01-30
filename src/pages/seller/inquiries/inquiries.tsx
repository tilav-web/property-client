import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inquiryService } from "@/services/inquiry.service";
import {
  inquiryResponseService,
  type CreateInquiryResponseDto,
} from "@/services/inquiry-response.service";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  MessageSquare,
  Building,
  User,
  Calendar,
  Check,
  X,
  Clock,
  Send,
} from "lucide-react";
import type { IInquiry } from "@/interfaces/inquiry/inquiry.interface";
import { serverUrl } from "@/utils/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function InquiriesPage() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedInquiry, setSelectedInquiry] = useState<IInquiry | null>(null);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: inquiries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => inquiryService.findSellerInquiries(),
  });

  const { mutate: createInquiryResponse, isPending } = useMutation({
    mutationFn: (dto: CreateInquiryResponseDto) =>
      inquiryResponseService.createInquiryResponse(dto),
    onSuccess: () => {
      toast.success("So'rovga javob yuborildi!");
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      setShowDialog(false);
      setDescription("");
      setSelectedInquiry(null);
    },
    onError: (err: AxiosError) => {
      console.log(err);
      toast.error(
        (err.response?.data as { message: string })?.message ||
          "Xatolik yuz berdi!"
      );
    },
  });

  const getInitials = (
    firstName: string = "",
    lastName: string = ""
  ): string => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
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

  const handleOpenDialog = (type: "approve" | "reject", inquiry: IInquiry) => {
    setDialogType(type);
    setSelectedInquiry(inquiry);
    setShowDialog(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedInquiry || !dialogType) return;

    const status = dialogType === "approve" ? "approved" : "rejected";

    const dto: CreateInquiryResponseDto = {
      status,
      description,
      user: selectedInquiry.user._id!,
      inquiry: selectedInquiry._id,
      property: selectedInquiry.property._id!,
    };

    createInquiryResponse(dto);
  };

  const filteredInquiries = inquiries?.filter((inquiry: IInquiry) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return inquiry.status === "pending";
    if (activeTab === "responded") return inquiry.status === "responded";
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-lg">
            So'rovlar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Xatolik yuz berdi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">So'rovlar</h1>
        <p className="text-muted-foreground mt-2">
          Mijozlardan kelgan mulk so'rovlari
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Barchasi
            <Badge variant="secondary" className="ml-2">
              {inquiries?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Kutilmoqda
            <Badge variant="secondary" className="ml-2">
              {inquiries?.filter((i: IInquiry) => i.status === "pending")?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Javob berilgan
            <Badge variant="secondary" className="ml-2">
              {inquiries?.filter((i: IInquiry) => i.status === "responded")?.length || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredInquiries?.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === "pending" 
                    ? "Kutilayotgan so'rovlar yo'q" 
                    : activeTab === "responded" 
                    ? "Javob berilgan so'rovlar yo'q"
                    : "So'rovlar topilmadi"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {activeTab === "pending" 
                    ? "Barcha so'rovlarga javob berilgan" 
                    : activeTab === "responded" 
                    ? "Hozircha javob berilgan so'rovlar mavjud emas"
                    : "Hozircha yangi so'rovlar mavjud emas."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInquiries?.map((inquiry: IInquiry) => (
                <Card 
                  key={inquiry._id} 
                  className={`overflow-hidden transition-all hover:shadow-md ${
                    inquiry.status === "pending" 
                      ? "border-l-4 border-l-primary" 
                      : "border-l-4 border-l-muted"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                            <AvatarImage
                              src={`${serverUrl}/uploads${inquiry.user.avatar ?? ""}`}
                              alt={inquiry.user.first_name ??""}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                              {getInitials(
                                inquiry.user.first_name ?? "",
                                inquiry.user.last_name ?? ""
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <CardTitle className="text-lg truncate">
                                {inquiry.user.first_name ?? ""}{" "}
                                {inquiry.user.last_name ?? ""}
                              </CardTitle>
                              <Badge
                                variant={
                                  inquiry.status === "pending"
                                    ? "default"
                                    : inquiry.status === "responded"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="whitespace-nowrap"
                              >
                                {inquiry.status === "pending" 
                                  ? "Kutilmoqda" 
                                  : "Javob berilgan"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {inquiry?.user?.email?.value}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(inquiry.createdAt)}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {inquiry?.property?.title || "Mulk nomi mavjud emas"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons - only show for pending inquiries */}
                        {inquiry.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 px-4 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleOpenDialog("reject", inquiry)}
                            >
                              <X className="h-4 w-4" />
                              Rad etish
                            </Button>
                            <Button
                              size="sm"
                              className="h-9 px-4 gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleOpenDialog("approve", inquiry)}
                            >
                              <Check className="h-4 w-4" />
                              Qabul qilish
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              So'rov turi
                            </span>
                            <span className="text-sm font-semibold flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              {inquiry.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Taklif qilingan narx
                            </span>
                            <span className="text-lg font-bold text-primary flex items-center gap-2">
                              {selectedInquiry && selectedInquiry.property && selectedInquiry.offered_price !== undefined ? (
                                selectedInquiry.property.currency === 'rm'
                                  ? `RM ${selectedInquiry.offered_price.toLocaleString()}`
                                  : `${selectedInquiry.offered_price.toLocaleString()} so'm`
                              ) : "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Mulk nomi
                            </span>
                            <span className="text-sm font-semibold truncate max-w-[150px]">
                              {inquiry?.property?.title || "N/A"}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Status
                            </span>
                            <Badge
                              variant={
                                inquiry.status === "pending"
                                  ? "default"
                                  : inquiry.status === "responded"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {inquiry.status === "pending" 
                                ? "Javob kutilmoqda" 
                                : "Javob berilgan"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Comment Section */}
                      {inquiry.comment && (
                        <div className="bg-muted/20 rounded-xl p-4 mb-4 border">
                          <p className="text-sm font-medium mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Mijoz izohi:
                          </p>
                          <p className="text-sm text-foreground pl-6">
                            "{inquiry.comment}"
                          </p>
                        </div>
                      )}

                      {/* Response Section - Only show if inquiry has response AND status is responded */}
                      {inquiry.status === "responded" && inquiry.response && (
                        <div className={`rounded-xl p-4 border ${
                          inquiry.response.status === "approved" 
                            ? "bg-green-50 border-green-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Send className="h-4 w-4" />
                              Sizning javobingiz:
                            </p>
                            <Badge
                              variant={
                                inquiry.response.status === "approved"
                                  ? "default"
                                  : "destructive"
                              }
                              className="font-medium"
                            >
                              {inquiry.response.status === "approved" 
                                ? "Qabul qilindi" 
                                : "Rad etildi"}
                            </Badge>
                          </div>
                          <p className={`text-sm pl-6 ${
                            inquiry.response.status === "approved" 
                              ? "text-green-700" 
                              : "text-red-700"
                          }`}>
                            "{inquiry.response.description}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 pl-6">
                            Javob berilgan vaqt: {formatDate(inquiry.response.createdAt)}
                          </p>
                        </div>
                      )}

                      {/* Eski versiya uchun - agar response mavjud bo'lsa, lekin status responded bo'lmasa */}
                      {inquiry.status !== "pending" && inquiry.response && (
                        <div className={`rounded-xl p-4 border ${
                          inquiry.response.status === "approved" 
                            ? "bg-green-50 border-green-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Send className="h-4 w-4" />
                              Javobingiz:
                            </p>
                            <Badge
                              variant={
                                inquiry.response.status === "approved"
                                  ? "default"
                                  : "destructive"
                              }
                              className="font-medium"
                            >
                              {inquiry.response.status === "approved" 
                                ? "Qabul qilindi" 
                                : "Rad etildi"}
                            </Badge>
                          </div>
                          <p className={`text-sm pl-6 ${
                            inquiry.response.status === "approved" 
                              ? "text-green-700" 
                              : "text-red-700"
                          }`}>
                            "{inquiry.response.description}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 pl-6">
                            Javob berilgan vaqt: {formatDate(inquiry.response.createdAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className={`p-3 rounded-lg mb-4 ${
              dialogType === "approve" 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              <DialogTitle className="flex items-center gap-2">
                {dialogType === "approve" 
                  ? <Check className="h-5 w-5" /> 
                  : <X className="h-5 w-5" />}
                So'rovni {dialogType === "approve" ? "tasdiqlash" : "rad etish"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {dialogType === "approve"
                ? "Mijozning so'rovini tasdiqlash uchun quyida izoh qoldiring."
                : "So'rovni rad etish sababini quyida yozing."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium mb-1">
                {selectedInquiry.user.first_name} {selectedInquiry.user.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Taklif:{" "}
                {selectedInquiry.property.currency === 'rm'
                  ? `RM ${selectedInquiry.offered_price?.toLocaleString()}`
                  : `${selectedInquiry.offered_price?.toLocaleString()} so'm`}
              </p>
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {dialogType === "approve" ? "Tasdiqlash izohi" : "Rad etish sababi"}
              </Label>
              <Textarea
                placeholder={
                  dialogType === "approve" 
                    ? "Tasdiqlash haqida izoh..." 
                    : "Rad etish sababini yozing..."
                }
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                {dialogType === "approve" 
                  ? "Bu izoh mijozga ko'rsatiladi" 
                  : "Bu sabab mijozga yetkaziladi"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isPending}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitResponse}
              disabled={isPending || !description.trim()}
              className={
                dialogType === "approve" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isPending
                ? "Yuborilmoqda..."
                : dialogType === "approve"
                ? "Tasdiqlash"
                : "Rad etish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}