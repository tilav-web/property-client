import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import SubLayout from "./layouts/sub-layout";
import Main from "./pages/main/main";
import RoleChecked from "./pages/auth/role-checked";
import Register from "./pages/auth/register";
import OtpConfirmation from "./pages/auth/otp-confirmation";
import Profile from "./pages/profile/profile";
import Property from "./pages/property/property";
import Favorites from "./pages/favorites/favorites";
import RentApartments from "./pages/rent-apartments/rent-apartments";
import Login from "./pages/auth/login";
import Map from "./pages/map/map";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <SubLayout>
            <Main />
          </SubLayout>
        ),
      },
      {
        path: "/property/:id",
        element: (
          <SubLayout>
            <Property />
          </SubLayout>
        ),
      },
      {
        path: "/rent-apartments",
        element: (
          <SubLayout>
            <RentApartments />
          </SubLayout>
        ),
      },
      {
        path: "/favorites",
        element: (
          <SubLayout>
            <Favorites />
          </SubLayout>
        ),
      },
      {
        path: "/auth",
        element: <RoleChecked />,
      },
      {
        path: "/map",
        element: <Map />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/otp",
        element: <OtpConfirmation />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: (
          <SubLayout>
            <Profile />
          </SubLayout>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
