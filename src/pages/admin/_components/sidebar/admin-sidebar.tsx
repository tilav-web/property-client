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
  CreditCard,
  BriefcaseBusiness,
  Tags,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
      id: "content",
      label: "Content",
      icon: <FileText className="h-5 w-5" />,
      badge: null,
      path: "/admin/content",
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="h-5 w-5" />,
      badge: null,
      path: "/admin/billing",
    },
  ];

    const bottomItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: null,
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
      className={`hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300 w-64`}
    >
      <div className={`flex items-center p-4 border-b gap-3`}>
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
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start px-3`}
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
            className={`w-full justify-start px-3`}
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
          className={`w-full justify-start px-3`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </Button>
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
