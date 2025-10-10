import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSellerStore } from "@/stores/seller.store";
import { useUserStore } from "@/stores/user.store";
import {
  ArrowLeftToLine,
  Building2,
  Home,
  Pointer,
  Settings,
  Stars,
  User,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const registerMenuItems = {
  seller: [
    {
      to: "/seller/profile",
      icon: <User className="h-5 w-5" />,
      text: "Shaxsiy malumotlar",
    },
  ],
  physical: [],
  legal: [],
};

const menuItems = {
  seller: [
    { to: "/seller", icon: <Home className="h-5 w-5" />, text: "Bosh sahifa" },
    {
      to: "/seller/inquiries",
      icon: <Pointer className="h-5 w-5" />,
      text: "Faoliyatlar",
    },
    {
      to: "/seller/feedback",
      icon: <Stars className="h-5 w-5" />,
      text: "Fikrlar",
    },
    {
      to: "/seller/properties",
      icon: <Building2 className="h-5 w-5" />,
      text: "Mulklar",
    },
    {
      to: "/seller/profile",
      icon: <User className="h-5 w-5" />,
      text: "Shaxsiy malumotlar",
    },
  ],
  physical: [],
  legal: [],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUserStore();
  const { seller } = useSellerStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen overflow-y-auto bg-primary text-primary-foreground shadow-lg",
        "transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full", // Mobile toggle
        "z-50"
      )}
    >
      <div className="p-6 border-b border-primary-foreground/20 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seller</h1>
        {/* Close button for mobile sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {user?.role && seller?.status === "approved"
          ? menuItems[user?.role]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose} // Close sidebar on navigation for mobile
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10",
                    isActive && "bg-primary-foreground/20"
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
                onClick={onClose} // Close sidebar on navigation for mobile
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10",
                    isActive && "bg-primary-foreground/20"
                  )
                }
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))}
      </nav>
      <div className="p-4 border-t border-primary-foreground/20 space-y-4">
        <NavLink
          to="/settings"
          onClick={onClose} // Close sidebar on navigation for mobile
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10"
        >
          <Settings className="h-5 w-5" />
          <span>Sozlamalar</span>
        </NavLink>
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all bg-red-300/30"
        >
          <ArrowLeftToLine className="h-5 w-5" />
          <span>Ortga</span>
        </Link>
      </div>
    </aside>
  );
}
