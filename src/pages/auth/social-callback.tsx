import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleStorage } from "@/utils/handle-storage";
import { useUserStore } from "@/stores/user.store";
import { userService } from "@/services/user.service";

export default function SocialCallback() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    userService
      .refreshToken()
      .then((accessToken) => {
        handleStorage({ key: "access_token", value: accessToken });
        return userService.findMe();
      })
      .then((data) => {
        setUser(data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error fetching user data after social login:", error);
        navigate("/auth/login");
      });
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Loading...</p>
    </div>
  );
}
