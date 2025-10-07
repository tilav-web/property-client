import { useState } from "react";

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: {
    value: string;
    isVerified: boolean;
  };
  phone: {
    value: string;
    isVerified: boolean;
  };
  avatar: string;
  role: UserRole;
  lan: "uz" | "en" | "ru";
  likes: string[];
}

export type UserRole = "physical" | "seller" | "legal";

interface SellerBusinessInfo {
  passportSerial: string;
  commissionerPhoto: File | null;
  businessForm: string;
  companyName: string;
  stir: string;
  jshshir: string;
  registrationNumber: string;
  businessLocation: string;
  certificateFile: File | null;
  passportFile: File | null;
  vatFile: File | null;
}

interface BankInfo {
  accountNumber: string;
  bankName: string;
  mfo: string;
  accountHolder: string;
  bankCode: string;
}

export default function SellerProfile() {
  const [user, setUser] = useState<IUser>({
    _id: "1",
    first_name: "John",
    last_name: "Doe",
    email: {
      value: "john@example.com",
      isVerified: true,
    },
    phone: {
      value: "+998901234567",
      isVerified: true,
    },
    avatar: "",
    role: "seller",
    lan: "uz",
    likes: [],
  });

  const [businessInfo, setBusinessInfo] = useState<SellerBusinessInfo>({
    passportSerial: "AD 6666666",
    commissionerPhoto: null,
    businessForm: "YTT",
    companyName: "qwerty",
    stir: "987654321",
    jshshir: "32562459656555",
    registrationNumber: "123",
    businessLocation: "qwerty",
    certificateFile: null,
    passportFile: null,
    vatFile: null,
  });

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountNumber: "12345689789563256326",
    bankName: "2qwedrfg",
    mfo: "25695",
    accountHolder: "werfgb",
    bankCode: "SCDDSVDDDDD",
  });

  const handleUserUpdate = (field: keyof IUser, value: any) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessInfoUpdate = (
    field: keyof SellerBusinessInfo,
    value: any
  ) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankInfoUpdate = (field: keyof BankInfo, value: any) => {
    setBankInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof SellerBusinessInfo, file: File) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: file }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <span className="text-2xl font-semibold text-blue-600">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">{user.email.value}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.email.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Email{" "}
                  {user.email.isVerified ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.phone.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Telefon{" "}
                  {user.phone.isVerified ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shaxsiy ma'lumotlar formasi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Shaxsiy ma'lumotlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ism
              </label>
              <input
                type="text"
                value={user.first_name}
                onChange={(e) => handleUserUpdate("first_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Familiya
              </label>
              <input
                type="text"
                value={user.last_name}
                onChange={(e) => handleUserUpdate("last_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={user.email.value}
                  onChange={(e) =>
                    handleUserUpdate("email", {
                      ...user.email,
                      value: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {user.email.isVerified ? "Tasdiqlangan" : "Tasdiqlash"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  value={user.phone.value}
                  onChange={(e) =>
                    handleUserUpdate("phone", {
                      ...user.phone,
                      value: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {user.phone.isVerified ? "Tasdiqlangan" : "Tasdiqlash"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Biznes ma'lumotlari formasi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Biznes ma'lumotlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pasport seriyasi raqami
              </label>
              <input
                type="text"
                value={businessInfo.passportSerial}
                onChange={(e) =>
                  handleBusinessInfoUpdate("passportSerial", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AD 6666666"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komissioner rasmi
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("commissionerPhoto", e.target.files[0])
                  }
                  className="hidden"
                  id="commissionerPhoto"
                />
                <label htmlFor="commissionerPhoto" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Hujjatni ko'rish file
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biznes shakli
              </label>
              <select
                value={businessInfo.businessForm}
                onChange={(e) =>
                  handleBusinessInfoUpdate("businessForm", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="YTT">YTT</option>
                <option value="YaTT">YaTT</option>
                <option value="MCHJ">MCHJ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kompaniya nomi
              </label>
              <input
                type="text"
                value={businessInfo.companyName}
                onChange={(e) =>
                  handleBusinessInfoUpdate("companyName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="qwerty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                STIR
              </label>
              <input
                type="text"
                value={businessInfo.stir}
                onChange={(e) =>
                  handleBusinessInfoUpdate("stir", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="987654321"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JShShIR
              </label>
              <input
                type="text"
                value={businessInfo.jshshir}
                onChange={(e) =>
                  handleBusinessInfoUpdate("jshshir", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="32562459656555"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ro'yxatdan o'tish raqami
              </label>
              <input
                type="text"
                value={businessInfo.registrationNumber}
                onChange={(e) =>
                  handleBusinessInfoUpdate("registrationNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biznes joyi
              </label>
              <input
                type="text"
                value={businessInfo.businessLocation}
                onChange={(e) =>
                  handleBusinessInfoUpdate("businessLocation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="qwerty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guvohnoma fayli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("certificateFile", e.target.files[0])
                  }
                  className="hidden"
                  id="certificateFile"
                />
                <label htmlFor="certificateFile" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Hujjatni ko'rish (certificate_file)
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pasport fayli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("passportFile", e.target.files[0])
                  }
                  className="hidden"
                  id="passportFile"
                />
                <label htmlFor="passportFile" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Hujjatni ko'rish (passport_file)
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QQS fayli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("vatFile", e.target.files[0])
                  }
                  className="hidden"
                  id="vatFile"
                />
                <label htmlFor="vatFile" className="cursor-pointer">
                  <span className="text-gray-500">Ma'lumot yo'q</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bank ma'lumotlari formasi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bank ma'lumotlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hisob raqami
              </label>
              <input
                type="text"
                value={bankInfo.accountNumber}
                onChange={(e) =>
                  handleBankInfoUpdate("accountNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345689789563256326"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank nomi
              </label>
              <input
                type="text"
                value={bankInfo.bankName}
                onChange={(e) =>
                  handleBankInfoUpdate("bankName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2qwedrfg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MFO
              </label>
              <input
                type="text"
                value={bankInfo.mfo}
                onChange={(e) => handleBankInfoUpdate("mfo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25695"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hisob egasining to'liq ismi
              </label>
              <input
                type="text"
                value={bankInfo.accountHolder}
                onChange={(e) =>
                  handleBankInfoUpdate("accountHolder", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="werfgb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank kodi
              </label>
              <input
                type="text"
                value={bankInfo.bankCode}
                onChange={(e) =>
                  handleBankInfoUpdate("bankCode", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SCDDSVDDDDD"
              />
            </div>
          </div>
        </div>

        {/* Saqlash tugmasi */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Ma'lumotlarni saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
