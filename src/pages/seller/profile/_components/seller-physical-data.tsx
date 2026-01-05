import { useSellerStore } from "@/stores/seller.store";
import { File } from "lucide-react";
import SellerSocials from "./seller-socials";

export default function SellerProfile() {
  const { seller } = useSellerStore();

  if (!seller) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No seller data available</p>
      </div>
    );
  }

  const { self_employed, physical, status, business_type, passport } = seller;

  // business_type ga qarab ma'lumotlarni tanlash
  const sellerData =
    business_type === "physical"
      ? physical
      : business_type === "self_employed"
      ? self_employed
      : null;

  if (!sellerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          No seller data available for {business_type} type
        </p>
      </div>
    );
  }

  const {
    first_name,
    last_name,
    middle_name,
    birth_date,
    jshshir,
    passport_file,
  } = sellerData;
  const self_employment_certificate =
    "self_employment_certificate" in sellerData
      ? sellerData.self_employment_certificate
      : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <SellerSocials />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {first_name} {last_name}
              </h1>
              <p className="text-gray-600">{middle_name}</p>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "approved"
                    ? "bg-green-100 text-green-800"
                    : status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {business_type?.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                First Name
              </label>
              <p className="mt-1 text-gray-900">{first_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Last Name
              </label>
              <p className="mt-1 text-gray-900">{last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Middle Name
              </label>
              <p className="mt-1 text-gray-900">{middle_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Birth Date
              </label>
              <p className="mt-1 text-gray-900">
                {birth_date ? new Date(birth_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Passport
              </label>
              <p className="mt-1 text-gray-900">{passport}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                JSHShIR
              </label>
              <p className="mt-1 text-gray-900">{jshshir}</p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Documents
          </h2>
          <div
            className={`grid gap-4 ${
              passport_file && self_employment_certificate
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {passport_file && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Passport File
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    File <File />
                  </p>
                  <a
                    href={passport_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    View
                  </a>
                </div>
              </div>
            )}

            {business_type === "self_employed" &&
              self_employment_certificate && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Self-Employment Certificate
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      File <File />
                    </p>

                    <a
                      href={self_employment_certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}