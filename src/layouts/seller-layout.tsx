import SellerHeader from "@/components/common/header/seller-header";
import Loading from "@/components/common/loadings/loading";
import PhoneVerifyModal from "@/components/common/phone-verify-modal";
import Sidebar from "@/components/common/sidebars/seller-sidebar";
import RoleGuard from "@/guards/role-guard";
import useSystem from "@/hooks/use-system";
import { useUserStore } from "@/stores/user.store";
import { useState, type ReactNode } from "react";

export default function SellerLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUserStore();
  useSystem();

  const needsPhoneVerification =
    user !== undefined && user !== null && !user.phone?.isVerified;

  if (user === undefined) return <Loading />;

  return (
    <RoleGuard roles={["legal", "physical"]}>
      <PhoneVerifyModal
        open={!!needsPhoneVerification}
        onSuccess={() => {}}
      />
      <div className="flex h-screen overflow-y-auto bg-gray-50">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
        </div>

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
          />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
