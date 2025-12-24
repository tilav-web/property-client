import { useAdminStore } from "@/stores/admin.store";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const { adminAccessToken, admin } = useAdminStore();

  return (
    <div>
      <Outlet />
    </div>
  );
}
