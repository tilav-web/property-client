import type { UserRole } from "@/interfaces/users/user.interface";
import { useUserStore } from "@/stores/user.store";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleGuard({
  children,
  roles,
}: {
  children: ReactNode;
  roles: UserRole[];
}) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user === null || (user && !roles.includes(user?.role))) {
    navigate("/unauthorized");
    return;
  }
  return children;
}
