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
import Login from "./pages/auth/login";
import Map from "./pages/map/map";
import SellerLayout from "./layouts/seller-layout";
import Unauthorized from "./pages/unauthorized/unauthorized";
import SellerProfile from "./pages/seller/profile/seller-profile";
import Inquiries from "./pages/seller/inquiries/inquiries";
import Feedback from "./pages/seller/feedback/feedback";
import SellerProperties from "./pages/seller/properties/seller-properties";
import { lazy, Suspense } from "react";
import FilterNav from "./pages/property/filter-nav";
import AiAgent from "./pages/ai-agent/ai-agent";
import SellerDashboard from "./pages/seller/dashboard/seller-dashboard";
import SellerAdvertise from "./pages/seller/advertise/seller-advertise";
import SellerCreateAdvertise from "./pages/seller/advertise/seller-create-advertise";
import Category from "./pages/property/category";
const CreateProperty = lazy(
  () => import("./pages/seller/properties/create-property")
);

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
        path: "/filter-nav",
        element: (
          <SubLayout>
            <FilterNav />
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
        path: "/ai-agent",
        element: <AiAgent />,
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
      {
        path: "/category",
        element: (
          <SubLayout>
            <Category />
          </SubLayout>
        ),
      },
      {
        path: "/seller",
        element: (
          <SellerLayout>
            <SellerDashboard />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/profile",
        element: (
          <SellerLayout>
            <SellerProfile />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/advertise",
        element: (
          <SellerLayout>
            <SellerAdvertise />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/advertise/create",
        element: (
          <SellerLayout>
            <SellerCreateAdvertise />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/inquiries",
        element: (
          <SellerLayout>
            <Inquiries />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/feedback",
        element: (
          <SellerLayout>
            <Feedback />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/properties",
        element: (
          <SellerLayout>
            <SellerProperties />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/properties/create",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <SellerLayout>
              <CreateProperty />
            </SellerLayout>
          </Suspense>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
