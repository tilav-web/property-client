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
import SellerLayout from "./layouts/seller-layout";
import Unauthorized from "./pages/unauthorized/unauthorized";
import SellerProfile from "./pages/seller/profile/seller-profile";
import Inquiries from "./pages/seller/inquiries/inquiries";
import Feedback from "./pages/seller/feedback/feedback";
import SellerProperties from "./pages/seller/properties/seller-properties";
import { lazy, Suspense, useEffect } from "react";
import SocialCallback from "./pages/auth/social-callback";
import FilterNav from "./pages/property/filter-nav";
import AiAgent from "./pages/ai-agent/ai-agent";
import SellerDashboard from "./pages/seller/dashboard/seller-dashboard";
import SellerAdvertise from "./pages/seller/advertise/seller-advertise";
import SellerCreateAdvertise from "./pages/seller/advertise/seller-create-advertise";
import Category from "./pages/property/category";
import YandexMap from "./pages/map/yandex-map";
import { yandexMapKey } from "./utils/shared";
import Search from "./pages/property/search";
import AdminLayout from "./layouts/admin-layout";
import AdminDashboard from "./pages/admin/_pages/dashboard/admin-dashboard";
import AdminLogin from "./pages/admin/_pages/auth/admin-login";
import AdminUsers from "./pages/admin/_pages/users/admin-users";
import AdminProperties from "./pages/admin/_pages/properties/admin-properties";
import AdminSellers from "./pages/admin/_pages/sellers/admin-sellers";
import AdminAdvertises from "./pages/admin/_pages/advertises/admin-advertises";
import MainLayout from "./layouts/main-layout";
import SellerDetailsPage from "./pages/admin/_pages/sellers/seller-details-page";
import PropertyDetailsPage from "./pages/admin/_pages/properties/property-details-page";
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
          <MainLayout>
            <Main />
          </MainLayout>
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
        path: "/search",
        element: (
          <SubLayout>
            <Search />
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
        element: <YandexMap />,
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
        path: "/auth/social", // New route for social login callback
        element: <SocialCallback />,
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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true, // index route: /admin
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "properties",
        element: <AdminProperties />,
      },
      {
        path: "properties/:propertyId",
        element: <PropertyDetailsPage />,
      },
      {
        path: "sellers",
        element: <AdminSellers />,
      },
      {
        path: "sellers/:sellerId",
        element: <SellerDetailsPage />,
      },
      {
        path: "ads",
        element: <AdminAdvertises />,
      },
    ],
  },
  {
    path: "/admin/login", // /admin/login
    element: <AdminLogin />,
  },
]);

export default function App() {
  useEffect(() => {
    if (!document.getElementById("yandex-maps-script")) {
      const script = document.createElement("script");
      script.id = "yandex-maps-script";
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexMapKey}&lang=en_RU`;
      document.body.appendChild(script);
    }
  }, []);

  return <RouterProvider router={router} />;
}
