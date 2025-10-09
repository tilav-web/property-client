import { useFormik } from "formik";
import * as Yup from "yup";
import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";
import { useSellerStore } from "@/stores/seller.store";
import { toast } from "sonner";
import { sellerService } from "@/services/seller.service";
import { useUserStore } from "@/stores/user.store";

// Validation schema
const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Ism kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(50, "Ism 50 ta belgidan oshmasligi kerak")
    .required("Ism toʻldirilishi shart"),
  last_name: Yup.string()
    .min(2, "Familiya kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(50, "Familiya 50 ta belgidan oshmasligi kerak")
    .required("Familiya toʻldirilishi shart"),
  middle_name: Yup.string()
    .min(2, "Otasining ismi kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(50, "Otasining ismi 50 ta belgidan oshmasligi kerak")
    .required("Otasining ismi toʻldirilishi shart"),
  birth_date: Yup.string().required("Tug'ilgan sana toʻldirilishi shart"),
  jshshir: Yup.string()
    .matches(/^\d{14}$/, "JShShIR 14 ta raqamdan iborat boʻlishi kerak")
    .required("JShShIR toʻldirilishi shart"),
  registration_number: Yup.string()
    .min(1, "Roʻyxatdan oʻtish raqami toʻldirilishi shart")
    .required("Roʻyxatdan oʻtish raqami toʻldirilishi shart"),
  registration_address: Yup.string()
    .min(10, "Manzil kamida 10 ta belgidan iborat boʻlishi kerak")
    .required("Roʻyxatdan oʻtgan manzil toʻldirilishi shart"),
  is_vat_payer: Yup.boolean().required(),
});

interface FileState {
  passport_file: File | null;
  self_employment_certificate: File | null;
  vat_file: File | null;
}

interface FormValues {
  first_name: string;
  last_name: string;
  middle_name: string;
  birth_date: string;
  jshshir: string;
  registration_number: string;
  registration_address: string;
  is_vat_payer: boolean;
  seller: string | undefined;
}

export default function SelfEmployedSection({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const [files, setFiles] = useState<FileState>({
    passport_file: null,
    self_employment_certificate: null,
    vat_file: null,
  });
  const { seller, setSeller } = useSellerStore();
  const { user } = useUserStore();

  const formik = useFormik<FormValues>({
    initialValues: {
      first_name: seller?.self_employed?.first_name
        ? seller?.self_employed?.first_name
        : user?.first_name ?? "",
      last_name: seller?.self_employed?.last_name
        ? seller?.self_employed?.last_name
        : user?.last_name ?? "",
      middle_name: seller?.self_employed?.middle_name ?? "",
      birth_date: seller?.self_employed?.birth_date ?? "",
      jshshir: seller?.self_employed?.jshshir ?? "",
      registration_number: seller?.self_employed?.registration_number ?? "",
      registration_address: seller?.self_employed?.registration_address ?? "",
      is_vat_payer: false,
      seller: seller?._id,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // FormData yaratish
        const formData = new FormData();

        // DTO ni FormData ga qo'shish - type safe usul
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Fayllarni qo'shish
        if (files.passport_file) {
          formData.append("passport_file", files.passport_file);
        }
        if (files.self_employment_certificate) {
          formData.append(
            "self_employment_certificate",
            files.self_employment_certificate
          );
        }
        if (files.vat_file) {
          formData.append("vat_file", files.vat_file);
        }

        const data = await sellerService.createSelfEmployedSeller(formData);
        setSeller(data);
        handleSelectTab("bank_account_number");
      } catch (error) {
        console.error("Formani yuborishda xatolik:", error);
      }
    },
  });

  const handleFileUpload = (
    fieldName: keyof FileState,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Fayl turini tekshirish
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Faqat PDF, JPG, PNG fayllar qabul qilinadi");
        return;
      }

      // Fayl hajmini tekshirish (masalan, 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi 5MB dan oshmasligi kerak");
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleRemoveFile = (fieldName: keyof FileState) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleSelectBusisessDetails = () => {
    // Majburiy fayllarni tekshirish
    if (!files.passport_file) {
      toast.error("Error", {
        description: "Pasport faylini yuklashingiz shart",
      });
      return;
    }

    if (!files.self_employment_certificate) {
      toast.error("Error", {
        description: "O'zini o'zi bandlik sertifikatini yuklashingiz shart",
      });
      return;
    }

    if (formik.values.is_vat_payer && !files.vat_file) {
      toast.error("Error", {
        description: "QQS guvohnomasini yuklashingiz shart",
      });
      return;
    }

    // Formani validatsiyadan o'tkazib, keyin submit qilamiz
    formik.handleSubmit();
  };

  const getFileName = (file: File | null) => {
    return file ? file.name : "Fayl tanlanmagan";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Yakka Tartibdagi Tadbirkor Ma'lumotlari
      </h3>

      <form className="space-y-4">
        {/* Shaxs ma'lumotlari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ism */}
          <div className="space-y-2">
            <Label htmlFor="first_name">Ism *</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Ismingizni kiriting"
              className={`bg-gray-50 ${
                formik.touched.first_name && formik.errors.first_name
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.first_name}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.first_name}
              </div>
            )}
          </div>

          {/* Familiya */}
          <div className="space-y-2">
            <Label htmlFor="last_name">Familiya *</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Familiyangizni kiriting"
              className={`bg-gray-50 ${
                formik.touched.last_name && formik.errors.last_name
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.last_name}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.last_name}
              </div>
            )}
          </div>

          {/* Otasining ismi */}
          <div className="space-y-2">
            <Label htmlFor="middle_name">Otasining ismi *</Label>
            <Input
              id="middle_name"
              name="middle_name"
              placeholder="Otasining ismini kiriting"
              className={`bg-gray-50 ${
                formik.touched.middle_name && formik.errors.middle_name
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.middle_name}
            />
            {formik.touched.middle_name && formik.errors.middle_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.middle_name}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tug'ilgan sana */}
          <div className="space-y-2">
            <Label htmlFor="birth_date">Tug'ilgan sana *</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              className={`bg-gray-50 ${
                formik.touched.birth_date && formik.errors.birth_date
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.birth_date}
            />
            {formik.touched.birth_date && formik.errors.birth_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.birth_date}
              </div>
            )}
          </div>

          {/* JShShIR */}
          <div className="space-y-2">
            <Label htmlFor="jshshir">JShShIR *</Label>
            <Input
              id="jshshir"
              name="jshshir"
              placeholder="00000000000000"
              className={`bg-gray-50 ${
                formik.touched.jshshir && formik.errors.jshshir
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jshshir}
            />
            {formik.touched.jshshir && formik.errors.jshshir && (
              <div className="text-red-500 text-sm">
                {formik.errors.jshshir}
              </div>
            )}
          </div>
        </div>

        {/* Ro'yxatdan o'tish raqami */}
        <div className="space-y-2">
          <Label htmlFor="registration_number">
            Ro'yxatdan o'tish raqami *
          </Label>
          <Input
            id="registration_number"
            name="registration_number"
            placeholder="Ro'yxatdan o'tish raqamini kiriting"
            className={`bg-gray-50 ${
              formik.touched.registration_number &&
              formik.errors.registration_number
                ? "border-red-500"
                : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.registration_number}
          />
          {formik.touched.registration_number &&
            formik.errors.registration_number && (
              <div className="text-red-500 text-sm">
                {formik.errors.registration_number}
              </div>
            )}
        </div>

        {/* Ro'yxatdan o'tgan manzil */}
        <div className="space-y-2">
          <Label htmlFor="registration_address">
            Ro'yxatdan o'tgan manzil *
          </Label>
          <Textarea
            id="registration_address"
            name="registration_address"
            placeholder="To'liq manzilni kiriting"
            className={`bg-gray-50 min-h-[80px] ${
              formik.touched.registration_address &&
              formik.errors.registration_address
                ? "border-red-500"
                : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.registration_address}
          />
          {formik.touched.registration_address &&
            formik.errors.registration_address && (
              <div className="text-red-500 text-sm">
                {formik.errors.registration_address}
              </div>
            )}
        </div>

        {/* Fayl yuklash qismlari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pasport fayli */}
          <div className="space-y-2">
            <Label htmlFor="passport_file">Pasport nusxasi *</Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.passport_file)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="passport_file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload("passport_file", e)}
                className="hidden"
              />
              <label
                htmlFor="passport_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                Yuklash
              </label>
              {files.passport_file && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile("passport_file")}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FileText size={14} />
              PDF formati qabul qilinadi
            </p>
          </div>

          {/* O'zini o'zi bandlik sertifikati */}
          <div className="space-y-2">
            <Label htmlFor="self_employment_certificate">
              O'zini o'zi bandlik sertifikati *
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.self_employment_certificate)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="self_employment_certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileUpload("self_employment_certificate", e)
                }
                className="hidden"
              />
              <label
                htmlFor="self_employment_certificate"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                Yuklash
              </label>
              {files.self_employment_certificate && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFile("self_employment_certificate")
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FileText size={14} />
              PDF formati qabul qilinadi
            </p>
          </div>
        </div>

        {/* QQS mavjudmi */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_vat_payer"
            checked={formik.values.is_vat_payer}
            onCheckedChange={(checked) =>
              formik.setFieldValue("is_vat_payer", checked)
            }
          />
          <Label htmlFor="is_vat_payer" className="text-sm font-medium">
            QQS to'lovchisiman
          </Label>
        </div>

        {/* QQS fayli (shart emas) */}
        {formik.values.is_vat_payer && (
          <div className="space-y-2">
            <Label htmlFor="vat_file">QQS guvohnomasi *</Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.vat_file)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="vat_file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload("vat_file", e)}
                className="hidden"
              />
              <label
                htmlFor="vat_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                Yuklash
              </label>
              {files.vat_file && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile("vat_file")}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Agar siz QQS to'lovchisi bo'lsangiz, guvohnomani yuklashingiz
              mumkin
            </p>
          </div>
        )}

        {/* Navigatsiya tugmalari */}
        <div className="flex items-center justify-between pt-4">
          <BackTabsButton onClick={() => handleSelectTab("user_details")} />
          <NextButton loading={false} onClick={handleSelectBusisessDetails} />
        </div>
      </form>
    </div>
  );
}
