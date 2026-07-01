import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import {
  ArrowLeftToLine,
  Building2,
  Home,
  Settings,
  Share2,
  Stars,
  User,
  Wallet,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const registerMenuItems = {
    physical: [
      {
        to: "/seller/profile",
        icon: <User className="h-5 w-5" />,
        text: t("common.seller_sidebar.personal_info"),
      },
    ],
    legal: [
      {
        to: "/seller/profile",
        icon: <User className="h-5 w-5" />,
        text: t("common.seller_sidebar.personal_info"),
      },
    ],
  };

  const menuItems = {
    physical: [
      {
        to: "/seller",
        icon: <Home className="h-5 w-5" />,
        text: t("common.seller_sidebar.dashboard"),
      },
{
        to: "/seller/feedback",
        icon: <Stars className="h-5 w-5" />,
        text: t("common.seller_sidebar.feedback"),
      },
      {
        to: "/seller/properties",
        icon: <Building2 className="h-5 w-5" />,
        text: t("common.seller_sidebar.properties"),
      },
      {
        to: "/seller/profile",
        icon: <User className="h-5 w-5" />,
        text: t("common.seller_sidebar.personal_info"),
      },
      {
        to: "/seller/advertise",
        icon: <Share2 className="h-5 w-5" />,
        text: t("common.seller_sidebar.advertise"),
      },
      {
        to: "/seller/transactions",
        icon: <Wallet className="h-5 w-5" />,
        text: t("common.seller_sidebar.transactions", "Mening to'lovlarim"),
      },
    ],
    legal: [
      {
        to: "/seller",
        icon: <Home className="h-5 w-5" />,
        text: t("common.seller_sidebar.dashboard"),
      },
{
        to: "/seller/feedback",
        icon: <Stars className="h-5 w-5" />,
        text: t("common.seller_sidebar.feedback"),
      },
      {
        to: "/seller/properties",
        icon: <Building2 className="h-5 w-5" />,
        text: t("common.seller_sidebar.properties"),
      },
      {
        to: "/seller/profile",
        icon: <User className="h-5 w-5" />,
        text: t("common.seller_sidebar.personal_info"),
      },
      {
        to: "/seller/advertise",
        icon: <Share2 className="h-5 w-5" />,
        text: t("common.seller_sidebar.advertise"),
      },
      {
        to: "/seller/transactions",
        icon: <Wallet className="h-5 w-5" />,
        text: t("common.seller_sidebar.transactions", "Mening to'lovlarim"),
      },
    ],
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen overflow-y-auto bg-sidebar text-sidebar-foreground",
        "transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "z-50"
      )}
    >
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="font-display text-2xl text-sidebar-foreground">
          {t("common.seller_sidebar.title")}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {user?.role && user?.phone?.isVerified
          ? menuItems[user?.role]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/seller"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent",
                    isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  )
                }
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))
          : user?.role &&
            registerMenuItems[user?.role]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/seller"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent",
                    isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  )
                }
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent"
        >
          <Settings className="h-5 w-5" />
          <span>{t("common.seller_sidebar.settings")}</span>
        </NavLink>
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all bg-destructive/15 text-destructive hover:bg-destructive/25"
        >
          <ArrowLeftToLine className="h-5 w-5" />
          <span>{t("common.back")}</span>
        </Link>
      </div>
    </aside>
  );
}
