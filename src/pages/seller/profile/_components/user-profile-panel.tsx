import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useUserStore } from "@/stores/user.store";
import { userService } from "@/services/user.service";
import {
  CheckCircle2,
  Instagram,
  Pencil,
  Phone,
  Send,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { defaultImageAvatar } from "@/utils/shared";

function SocialItem({
  icon,
  brand,
  value,
}: {
  icon: React.ReactNode;
  brand: string;
  value?: string | null;
}) {
  if (!value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{brand}</p>
          <p className="text-xs text-muted-foreground">Not set</p>
        </div>
      </div>
    );
  }
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 hover:border-primary hover:bg-accent transition-all"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{brand}</p>
        <p className="text-xs text-muted-foreground truncate">{value}</p>
      </div>
    </a>
  );
}

export default function UserProfilePanel() {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [editOpen, setEditOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  const profileFormik = useFormik({
    initialValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
    onSubmit: async (values) => {
      const fd = new FormData();
      if (values.first_name) fd.append("first_name", values.first_name);
      if (values.last_name) fd.append("last_name", values.last_name);
      try {
        const updated = await userService.update(fd);
        setUser(updated);
        toast.success(t("pages.user_profile.updated", "Profile updated"));
        setEditOpen(false);
      } catch {
        toast.error(t("common.error", "Something went wrong"));
      }
    },
    enableReinitialize: true,
  });

  const socialFormik = useFormik({
    initialValues: {
      instagram: user?.instagram ?? "",
      telegram: user?.telegram ?? "",
      whatsapp: user?.whatsapp ?? "",
    },
    onSubmit: async (values) => {
      const fd = new FormData();
      fd.append("instagram", values.instagram);
      fd.append("telegram", values.telegram);
      fd.append("whatsapp", values.whatsapp);
      try {
        const updated = await userService.update(fd);
        setUser(updated);
        toast.success(t("pages.seller_socials.success_message", "Saved"));
        setSocialOpen(false);
      } catch {
        toast.error(t("pages.seller_socials.error_message", "Error saving"));
      }
    },
    enableReinitialize: true,
  });

  if (!user) return null;

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    t("common.seller_header.seller", "Seller");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-6 text-background sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-2 border-primary/40 shadow-lg">
              <AvatarImage
                src={user.avatar || defaultImageAvatar}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user.first_name?.[0] ?? "U"}
                {user.last_name?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="font-display text-2xl text-background sm:text-3xl">
                {fullName}
              </h1>
              {user.phone?.isVerified && user.phone.value && (
                <Badge variant="success" className="mt-1">
                  <CheckCircle2 size={11} className="mr-1" />
                  {user.phone.value}
                </Badge>
              )}
              {user.email?.value && (
                <p className="mt-0.5 text-xs text-background/60">
                  {user.email.value}
                </p>
              )}
            </div>
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-background/10 border-background/20 text-background hover:bg-background/20"
              >
                <Pencil size={14} className="mr-1" />
                {t("common.edit", "Edit")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("pages.user_profile.edit_profile", "Edit profile")}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={profileFormik.handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">
                    {t("pages.user_profile.first_name", "First name")}
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profileFormik.values.first_name}
                    onChange={profileFormik.handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">
                    {t("pages.user_profile.last_name", "Last name")}
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profileFormik.values.last_name}
                    onChange={profileFormik.handleChange}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit">
                    {t("pages.seller_socials.save_button", "Save")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Social links */}
      <section className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground">
              <Share2 className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">
                {t("pages.seller_socials.social_media", "Social media")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "pages.seller_profile.social_description",
                  "How buyers can reach you",
                )}
              </p>
            </div>
          </div>
          <Dialog open={socialOpen} onOpenChange={setSocialOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil size={14} className="mr-1" />
                {t("pages.seller_socials.edit_button", "Edit")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t(
                    "pages.seller_socials.edit_social_media",
                    "Edit social media",
                  )}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={socialFormik.handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    placeholder="https://instagram.com/..."
                    value={socialFormik.values.instagram}
                    onChange={socialFormik.handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    placeholder="https://t.me/..."
                    value={socialFormik.values.telegram}
                    onChange={socialFormik.handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="+60..."
                    value={socialFormik.values.whatsapp}
                    onChange={socialFormik.handleChange}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit">
                    {t("pages.seller_socials.save_button", "Save")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SocialItem
            icon={<Instagram size={20} />}
            brand="Instagram"
            value={user.instagram}
          />
          <SocialItem
            icon={<Send size={20} />}
            brand="Telegram"
            value={user.telegram}
          />
          <SocialItem
            icon={<Phone size={20} />}
            brand="WhatsApp"
            value={user.whatsapp}
          />
        </div>
      </section>
    </div>
  );
}
