import AdminSidebar from "@/pages/admin/_components/sidebar/admin-sidebar";
import { adminService } from "@/pages/admin/_services/admin.service";
import { useAdminStore } from "@/stores/admin.store";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const { admin, adminAccessToken, setAdmin } = useAdminStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (admin) {
        setLoading(false);
        return;
      }
      if (adminAccessToken) {
        try {
          const profile = await adminService.getProfile();
          setAdmin(profile, adminAccessToken);
        } catch (error) {
          console.error(error);
          navigate("/admin/login");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/admin/login");
        setLoading(false);
      }
    };

    checkAdmin();
  }, [adminAccessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-stretch">
      <aside className="h-screen">
        <AdminSidebar />
      </aside>
      <main className="overflow-y-auto w-screen">
        <Outlet />
      </main>
    </div>
  );
}
