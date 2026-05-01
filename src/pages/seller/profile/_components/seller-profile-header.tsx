import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle2,
  Eye,
  Heart,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/stores/user.store";
import { useSellerStore } from "@/stores/seller.store";
import { defaultImageAvatar } from "@/utils/shared";

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex size-10 items-center justify-center rounded-full bg-accent text-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface Props {
  stats?: {
    properties?: number;
    views?: number;
    saved?: number;
    rating?: number;
  };
}

export default function SellerProfileHeader({ stats }: Props) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { seller } = useSellerStore();

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ") || t("common.seller_header.seller", "Seller");

  const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
    approved: "success",
    in_progress: "warning",
    completed: "success",
    rejected: "destructive",
  };

  const statusKey = seller?.status ?? "in_progress";
  const variant = statusVariant[statusKey] ?? "warning";

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-6 text-background sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-2 border-primary/40 shadow-lg">
              <AvatarImage
                src={user?.avatar || defaultImageAvatar}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user?.first_name?.[0] ?? ""}
                {user?.last_name?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl text-background sm:text-3xl">
                  {fullName}
                </h1>
                <Badge
                  variant={variant}
                  className="capitalize"
                >
                  {variant === "success" && (
                    <CheckCircle2 size={11} className="mr-1" />
                  )}
                  {t(`seller_data_page.status_${statusKey}`, statusKey.replace("_", " "))}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-background/70 capitalize">
                {seller?.business_type
                  ? t(
                      `seller_data_page.business_type_${seller.business_type}`,
                      seller.business_type.replace("_", " "),
                    )
                  : t("common.seller_header.seller", "Seller")}
              </p>
              {user?.email?.value && (
                <p className="mt-0.5 text-xs text-background/60">
                  {user.email.value}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Building2 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Building2 size={18} />}
          label={t("pages.seller_profile.stats.properties", "Properties")}
          value={stats?.properties ?? 0}
        />
        <StatCard
          icon={<Eye size={18} />}
          label={t("pages.seller_profile.stats.views", "Views")}
          value={stats?.views ?? 0}
        />
        <StatCard
          icon={<Heart size={18} />}
          label={t("pages.seller_profile.stats.saved", "Saved")}
          value={stats?.saved ?? 0}
        />
        <StatCard
          icon={<Star size={18} className="fill-primary text-primary" />}
          label={t("pages.seller_profile.stats.rating", "Rating")}
          value={stats?.rating ? stats.rating.toFixed(1) : "—"}
        />
      </div>
    </div>
  );
}
