import type { ReactNode } from "react";
import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import RootLayout from "./layouts/root-layout";
import Main from "./pages/main/main";

const AdminLayout = lazy(() => import("./layouts/admin-layout"));
const SellerLayout = lazy(() => import("./layouts/seller-layout"));
const SubLayout = lazy(() => import("./layouts/sub-layout"));

const AdminsPage = lazy(() => import("./pages/admin/admins"));
const AdminDashboard = lazy(
  () => import("./pages/admin/_pages/dashboard/admin-dashboard")
);
const AdminAdvertises = lazy(
  () => import("./pages/admin/_pages/advertises/admin-advertises")
);
const AdminLogin = lazy(() => import("./pages/admin/_pages/auth/admin-login"));
const AdminProperties = lazy(
  () => import("./pages/admin/_pages/properties/admin-properties")
);
const PropertyDetailsPage = lazy(
  () => import("./pages/admin/_pages/properties/property-details-page")
);
const AdminSellers = lazy(
  () => import("./pages/admin/_pages/sellers/admin-sellers")
);
const SellerDetailsPage = lazy(
  () => import("./pages/admin/_pages/sellers/seller-details-page")
);
const AdminTagsPage = lazy(() => import("./pages/admin/_pages/tags"));
const AdminUsers = lazy(() => import("./pages/admin/_pages/users/admin-users"));
const AiAgent = lazy(() => import("./pages/ai-agent/ai-agent"));
const Login = lazy(() => import("./pages/auth/login"));
const OtpConfirmation = lazy(() => import("./pages/auth/otp-confirmation"));
const Register = lazy(() => import("./pages/auth/register"));
const RoleChecked = lazy(() => import("./pages/auth/role-checked"));
const SocialCallback = lazy(() => import("./pages/auth/social-callback"));
const Favorites = lazy(() => import("./pages/favorites/favorites"));
const YandexMap = lazy(() => import("./pages/map/yandex-map"));
const Profile = lazy(() => import("./pages/profile/profile"));
const Category = lazy(() => import("./pages/property/category"));
const FilterNav = lazy(() => import("./pages/property/filter-nav"));
const Property = lazy(() => import("./pages/property/property"));
const Search = lazy(() => import("./pages/property/search"));
const Feedback = lazy(() => import("./pages/seller/feedback/feedback"));
const Inquiries = lazy(() => import("./pages/seller/inquiries/inquiries"));
const SellerCreateAdvertise = lazy(
  () => import("./pages/seller/advertise/seller-create-advertise")
);
const SellerEditAdvertise = lazy(
  () => import("./pages/seller/advertise/seller-edit-advertise")
);
const SellerAdvertise = lazy(
  () => import("./pages/seller/advertise/seller-advertise")
);
const SellerDashboard = lazy(
  () => import("./pages/seller/dashboard/seller-dashboard")
);
const SellerProfile = lazy(
  () => import("./pages/seller/profile/seller-profile")
);
const CreateProperty = lazy(
  () => import("./pages/seller/properties/create-property")
);
const SellerProperties = lazy(
  () => import("./pages/seller/properties/seller-properties")
);
const UpdateProperty = lazy(
  () => import("./pages/seller/properties/update-property")
);
const PublicSellerDetailsPage = lazy(
  () => import("./pages/sellers/seller-details-public")
);
const SellersPage = lazy(() => import("./pages/sellers/sellers"));
const Unauthorized = lazy(() => import("./pages/unauthorized/unauthorized"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">
      Loading...
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

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
        path: "/sellers",
        element: withSuspense(
          <SubLayout>
            <SellersPage />
          </SubLayout>
        ),
      },
      {
        path: "/sellers/:sellerId",
        element: withSuspense(
          <SubLayout>
            <PublicSellerDetailsPage />
          </SubLayout>
        ),
      },
      {
        path: "/property/:id",
        element: withSuspense(
          <SubLayout>
            <Property />
          </SubLayout>
        ),
      },
      {
        path: "/filter-nav",
        element: withSuspense(
          <SubLayout>
            <FilterNav />
          </SubLayout>
        ),
      },
      {
        path: "/search",
        element: withSuspense(
          <SubLayout>
            <Search />
          </SubLayout>
        ),
      },
      {
        path: "/favorites",
        element: withSuspense(
          <SubLayout>
            <Favorites />
          </SubLayout>
        ),
      },
      {
        path: "/auth",
        element: withSuspense(<RoleChecked />),
      },
      {
        path: "/ai-agent",
        element: withSuspense(<AiAgent />),
      },
      {
        path: "/map",
        element: withSuspense(<YandexMap />),
      },
      {
        path: "/auth/register",
        element: withSuspense(<Register />),
      },
      {
        path: "/auth/otp",
        element: withSuspense(<OtpConfirmation />),
      },
      {
        path: "/auth/login",
        element: withSuspense(<Login />),
      },
      {
        path: "/auth/social",
        element: withSuspense(<SocialCallback />),
      },
      {
        path: "/profile",
        element: withSuspense(
          <SubLayout>
            <Profile />
          </SubLayout>
        ),
      },
      {
        path: "/category",
        element: withSuspense(
          <SubLayout>
            <Category />
          </SubLayout>
        ),
      },
      {
        path: "/seller",
        element: withSuspense(
          <SellerLayout>
            <SellerDashboard />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/profile",
        element: withSuspense(
          <SellerLayout>
            <SellerProfile />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/advertise",
        element: withSuspense(
          <SellerLayout>
            <SellerAdvertise />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/advertise/create",
        element: withSuspense(
          <SellerLayout>
            <SellerCreateAdvertise />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/advertise/edit/:id",
        element: withSuspense(
          <SellerLayout>
            <SellerEditAdvertise />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/inquiries",
        element: withSuspense(
          <SellerLayout>
            <Inquiries />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/feedback",
        element: withSuspense(
          <SellerLayout>
            <Feedback />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/properties",
        element: withSuspense(
          <SellerLayout>
            <SellerProperties />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/properties/update/:id",
        element: withSuspense(
          <SellerLayout>
            <UpdateProperty />
          </SellerLayout>
        ),
      },
      {
        path: "/seller/properties/create",
        element: withSuspense(
          <SellerLayout>
            <CreateProperty />
          </SellerLayout>
        ),
      },
      {
        path: "/unauthorized",
        element: withSuspense(<Unauthorized />),
      },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(<AdminLayout />),
    children: [
      {
        index: true,
        element: withSuspense(<AdminDashboard />),
      },
      {
        path: "users",
        element: withSuspense(<AdminUsers />),
      },
      {
        path: "properties",
        element: withSuspense(<AdminProperties />),
      },
      {
        path: "properties/:propertyId",
        element: withSuspense(<PropertyDetailsPage />),
      },
      {
        path: "sellers",
        element: withSuspense(<AdminSellers />),
      },
      {
        path: "sellers/:sellerId",
        element: withSuspense(<SellerDetailsPage />),
      },
      {
        path: "tags",
        element: withSuspense(<AdminTagsPage />),
      },
      {
        path: "ads",
        element: withSuspense(<AdminAdvertises />),
      },
      {
        path: "admins",
        element: withSuspense(<AdminsPage />),
      },
    ],
  },
  {
    path: "/admin/login",
    element: withSuspense(<AdminLogin />),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
