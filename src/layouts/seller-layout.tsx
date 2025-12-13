import SellerHeader from "@/components/common/header/seller-header";
import Loading from "@/components/common/loadings/loading";
import Sidebar from "@/components/common/sidebars/seller-sidebar";
import RoleGuard from "@/guards/role-guard";
import useSystem from "@/hooks/use-system";
import type { IMessageStatus } from "@/interfaces/message/message-status.interface";
import { sellerService } from "@/services/seller.service";
import { useSellerStore } from "@/stores/seller.store";
import { useUserStore } from "@/stores/user.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUserStore();
  useSystem();
  const navigate = useNavigate();

  const { seller, setSeller, logout, loading, handleLoading } =
    useSellerStore();
  const queryClient = useQueryClient();
  const messagesStatusUnread = queryClient.getQueryData([
    "messages/status",
    "unread",
  ]) as IMessageStatus[];

  useEffect(() => {
    (async () => {
      try {
        if (seller) {
          if (seller.status !== "approved") {
            navigate("/seller/profile");
          }
          return;
        }
        handleLoading(true);
        const data = await sellerService.findSeller();
        setSeller(data);
        if (data.status !== "approved") {
          navigate("/seller/profile");
        }
      } catch (error) {
        console.error(error);
        logout();
      } finally {
        handleLoading(false);
      }
    })();
  }, [setSeller, logout]);

  if (user === undefined && loading) return <Loading />;

  return (
    <RoleGuard roles={["legal", "physical"]}>
      <div className="flex h-screen overflow-y-auto bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <SellerHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            notificationCount={messagesStatusUnread?.length}
          />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
