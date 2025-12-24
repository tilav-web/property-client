import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  FileText,
  Bell,
  CreditCard,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      badge: 24,
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="h-5 w-5" />,
      badge: 156,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      badge: 42,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null,
    },
    {
      id: "content",
      label: "Content",
      icon: <FileText className="h-5 w-5" />,
      badge: 12,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="h-5 w-5" />,
      badge: null,
    },
  ];

  const bottomItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: 3,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      badge: null,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      badge: null,
    },
  ];

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    setIsMobileOpen(false);
    // Mock navigation - haqiqiy loyihada router ishlatishingiz mumkin
    console.log(`Navigating to ${id}`);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Logout logikasi
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div
      className={`hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center p-4 border-b ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">
              admin@example.com
            </p>
          </div>
        )}
      </div>
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isCollapsed ? "px-2" : "px-3"
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">
                            {item.label}
                          </span>
                          {item.badge !== null && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge !== null && (
                        <Badge variant="secondary" className="h-5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-2 space-y-1">
        {bottomItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isCollapsed ? "px-2" : "px-3"
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex items-center w-full">
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">
                          {item.label}
                        </span>
                        {item.badge !== null && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <Badge variant="secondary" className="h-5">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isCollapsed ? "px-2" : "px-3"
                }`}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <span>Logout</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
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
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">AdminPanel</span>
            </div>
          </div>

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
                  onClick={() => handleItemClick(item.id)}
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
                onClick={() => handleItemClick(item.id)}
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
    </>
  );
}
