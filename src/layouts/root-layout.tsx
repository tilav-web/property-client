import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const { setUser, user, logout } = useUserStore();
  const { i18n } = useTranslation();
  useEffect(() => {
    (async () => {
      i18n.changeLanguage(
        user?.lan ? user?.lan : handleStorage({ key: "lan" }) ?? "uz"
      );
      try {
        if (user || user === null) return;
        const data = await userService.findMe();
        setUser(data);
      } catch (error) {
        console.error(error);
        logout();
      }
    })();
  }, [setUser, logout]);

  return <Outlet />;
}
