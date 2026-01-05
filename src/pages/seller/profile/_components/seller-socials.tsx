import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSellerStore } from "@/stores/seller.store";
import { useFormik } from "formik";
import { sellerService } from "@/services/seller.service";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Send, Voicemail } from "lucide-react";

export default function SellerSocials() {
  const { seller, setSeller } = useSellerStore();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      instagram: seller?.instagram || "",
      telegram: seller?.telegram || "",
      whatsapp: seller?.whatsapp || "",
    },
    onSubmit: async (values) => {
      try {
        const updatedSeller = await sellerService.update(seller!._id, values);
        setSeller(updatedSeller);
        toast.success(t("pages.seller_socials.success_message"));
      } catch {
        toast.error(t("pages.seller_socials.error_message"));
      }
    },
    enableReinitialize: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("pages.seller_socials.social_media")}</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t("pages.seller_socials.edit_button")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("pages.seller_socials.edit_social_media")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formik.values.whatsapp}
                  onChange={formik.handleChange}
                />
              </div>
              <Button type="submit">
                {t("pages.seller_socials.save_button")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {seller?.instagram && (
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5" />
            <a
              href={seller.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              {seller.instagram}
            </a>
          </div>
        )}
        {seller?.telegram && (
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <a
              href={`https://t.me/${seller.telegram}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              {seller.telegram}
            </a>
          </div>
        )}
        {seller?.whatsapp && (
          <div className="flex items-center gap-2">
            <Voicemail className="w-5 h-5" />
            <a
              href={`https://wa.me/${seller.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              {seller.whatsapp}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
