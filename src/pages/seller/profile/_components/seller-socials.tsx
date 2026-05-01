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
import { Instagram, Pencil, Send, Share2, Voicemail } from "lucide-react";
import { useState } from "react";

interface SocialItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  brand: string;
}

function SocialItem({ icon, label, href, brand }: SocialItemProps) {
  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-muted-foreground">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{brand}</p>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary hover:bg-accent"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-foreground transition-colors group-hover:bg-card">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{brand}</p>
        <p className="text-xs text-muted-foreground truncate">{href}</p>
      </div>
    </a>
  );
}

export default function SellerSocials() {
  const { seller, setSeller } = useSellerStore();
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        setIsDialogOpen(false);
      } catch {
        toast.error(t("pages.seller_socials.error_message"));
      }
    },
    enableReinitialize: true,
  });

  const noneSet = !seller?.instagram && !seller?.telegram && !seller?.whatsapp;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground">
            <Share2 className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">
              {t("pages.seller_socials.social_media")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                "pages.seller_profile.social_description",
                "How buyers can reach you",
              )}
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="size-3.5" />
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
              <div className="space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  placeholder="https://instagram.com/..."
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  placeholder="https://t.me/..."
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="+60..."
                  value={formik.values.whatsapp}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">
                  {t("pages.seller_socials.save_button")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SocialItem
          icon={<Instagram className="size-5" />}
          brand="Instagram"
          label={t("pages.seller_profile.not_set", "Not set")}
          href={seller?.instagram}
        />
        <SocialItem
          icon={<Send className="size-5" />}
          brand="Telegram"
          label={t("pages.seller_profile.not_set", "Not set")}
          href={seller?.telegram}
        />
        <SocialItem
          icon={<Voicemail className="size-5" />}
          brand="WhatsApp"
          label={t("pages.seller_profile.not_set", "Not set")}
          href={seller?.whatsapp}
        />
      </div>

      {noneSet && (
        <p className="mt-4 text-xs text-muted-foreground">
          {t(
            "pages.seller_profile.add_social_hint",
            "Add at least one social channel so buyers can contact you faster.",
          )}
        </p>
      )}
    </section>
  );
}
