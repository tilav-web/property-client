import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  FileText,
  Bell,
  BriefcaseBusiness,
  Tags,
  Building2,
  Sparkles,
  Inbox,
  Coins,
  Wallet,
  Trees,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminPaymentService } from "../../_services/admin-payment.service";
import { adminNotificationService } from "../../_services/admin-notification.service";
import { useAdminNotificationSocket } from "@/hooks/use-admin-notification-socket";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { adminService } from "../../_services/admin.service";
import { toast } from "sonner";
import { useAdminStore } from "@/stores/admin.store";
import { PasswordChangeDialog } from "../dialogs/password-change-dialog";

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminLogout = useAdminStore((state) => state.logout);

  // Real-time admin notifications (Socket.IO)
  useAdminNotificationSocket({
    onNew: (payload) => {
      toast.info(payload.title, { description: payload.body });
    },
  });

  // Sidebar badge'lari uchun real-time count'lar
  const { data: pendingPayments } = useQuery({
    queryKey: ["admin-payments-awaiting-count"],
    queryFn: () => adminPaymentService.listAwaiting({ page: 1, limit: 1 }),
    refetchInterval: 60_000,
  });

  const { data: unreadNotifications } = useQuery({
    queryKey: ["admin-notifications-unread-count"],
    queryFn: () => adminNotificationService.unreadCount(),
    refetchInterval: 60_000,
  });

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null,
      path: "/admin",
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      badge: null,
      path: "/admin/users",
    },
    {
      id: "properties",
      label: "Properties",
      icon: <Package className="h-5 w-5" />,
      badge: null,
      path: "/admin/properties",
    },
    {
      id: "sellers",
      label: "Sellers",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      badge: null,
      path: "/admin/sellers",
    },
    {
      id: "tags",
      label: "Tags",
      icon: <Tags className="h-5 w-5" />,
      badge: null,
      path: "/admin/tags",
    },
    {
      id: "ads",
      label: "Ads",
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null,
      path: "/admin/ads",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <Wallet className="h-5 w-5" />,
      badge:
        pendingPayments?.total && pendingPayments.total > 0
          ? String(pendingPayments.total)
          : null,
      path: "/admin/payments",
    },
    {
      id: "developers",
      label: "Developers",
      icon: <Building2 className="h-5 w-5" />,
      badge: null,
      path: "/admin/developers",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <Sparkles className="h-5 w-5" />,
      badge: null,
      path: "/admin/projects",
    },
    {
      id: "project-inquiries",
      label: "Project inquiries",
      icon: <Inbox className="h-5 w-5" />,
      badge: null,
      path: "/admin/project-inquiries",
    },
    {
      id: "admins",
      label: "Admins",
      icon: <FileText className="h-5 w-5" />,
      badge: null,
      path: "/admin/admins",
    },
    {
      id: "exchange-rates",
      label: "Exchange rates",
      icon: <Coins className="h-5 w-5" />,
      badge: null,
      path: "/admin/exchange-rates",
    },
    {
      id: "site-settings",
      label: "Site settings",
      icon: <Settings className="h-5 w-5" />,
      badge: null,
      path: "/admin/site-settings",
    },
    {
      id: "communities",
      label: "Communities",
      icon: <Trees className="h-5 w-5" />,
      badge: null,
      path: "/admin/communities",
    },
  ];

    const bottomItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      badge:
        unreadNotifications?.count && unreadNotifications.count > 0
          ? String(unreadNotifications.count)
          : null,
      path: "/admin/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      badge: null,
      path: "/admin/settings",
    },
    {
      id: "change-password",
      label: "Parolni o'zgartirish",
      icon: <HelpCircle className="h-5 w-5" />,
      badge: null,
    },
  ];

  const [activeItem, setActiveItem] = useState("dashboard");
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const allItems = [...menuItems, ...bottomItems];
    const active = allItems.find(
      (item) => item.path && item.path === currentPath,
    );
    if (active) {
      setActiveItem(active.id);
    }
  }, [location.pathname]);

  const handleItemClick = (id: string, path?: string) => {
    if (id === "change-password") {
      setIsPasswordChangeOpen(true);
    } else if (path) {
      navigate(path);
    }
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
      adminLogout(); // Clear Zustand store and localStorage
      toast.success("Logout successful!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div
      className="hidden md:flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 w-64"
    >
      <div className="flex items-center p-4 border-b border-sidebar-border gap-3">
        <Avatar className="h-10 w-10 border border-sidebar-border">
          <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
            AD
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="font-medium truncate text-sm">Admin User</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">
            admin@example.com
          </p>
        </div>
      </div>
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                activeItem === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
              onClick={() => handleItemClick(item.id, item.path)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge !== null && (
                <Badge variant="default" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Bottom Navigation */}
      <div className="p-2 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
            onClick={() => handleItemClick(item.id, item.path)}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge !== null && (
              <Badge variant="default" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Logout */}
      <div className="p-3">
        <button
          type="button"
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-3"
                  onClick={() => handleItemClick(item.id, item.path)}
                >
                  <div className="flex items-center w-full">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                    {item.badge !== null && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Bottom Navigation */}
          <div className="p-2 space-y-1">
            {bottomItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start px-3"
                onClick={() => handleItemClick(item.id, item.path)}
              >
                <div className="flex items-center w-full">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.badge !== null && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start px-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
      <PasswordChangeDialog
        isOpen={isPasswordChangeOpen}
        onClose={() => setIsPasswordChangeOpen(false)}
      />
    </>
  );
}
