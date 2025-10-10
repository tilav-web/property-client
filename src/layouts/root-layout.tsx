import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const { setUser, user, logout } = useUserStore();

  useEffect(() => {
    (async () => {
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
