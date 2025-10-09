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
import { sellerService } from "@/services/seller.service";

// Validation schema
const validationSchema = Yup.object({
  company_name: Yup.string()
    .min(2, "Kompaniya nomi kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(100, "Kompaniya nomi 100 ta belgidan oshmasligi kerak")
    .required("Kompaniya nomi toʻldirilishi shart"),
  stir: Yup.string()
    .matches(/^\d{9}$/, "STIR 9 ta raqamdan iborat boʻlishi kerak")
    .required("STIR toʻldirilishi shart"),
  oked: Yup.string()
    .min(1, "OKED kodi toʻldirilishi shart")
    .required("OKED kodi toʻldirilishi shart"),
  registration_address: Yup.string()
    .min(10, "Manzil kamida 10 ta belgidan iborat boʻlishi kerak")
    .required("Roʻyxatdan oʻtgan manzil toʻldirilishi shart"),
  is_vat_payer: Yup.boolean().required(),
});

interface FileState {
  ustav_file: File | null;
  mchj_license: File | null;
  director_appointment_file: File | null;
  director_passport_file: File | null;
  legal_address_file: File | null;
  kadastr_file: File | null;
  vat_file: File | null;
}

interface FormValues {
  company_name: string;
  stir: string;
  oked: string;
  registration_address: string;
  is_vat_payer: boolean;
  seller: string | undefined;
}

export default function MchjSection({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const [files, setFiles] = useState<FileState>({
    ustav_file: null,
    mchj_license: null,
    director_appointment_file: null,
    director_passport_file: null,
    legal_address_file: null,
    kadastr_file: null,
    vat_file: null,
  });
  const { seller, setSeller } = useSellerStore();

  const formik = useFormik<FormValues>({
    initialValues: {
      company_name: seller?.mchj?.company_name ?? "",
      stir: seller?.mchj?.stir ?? "",
      oked: seller?.mchj?.oked ?? "",
      registration_address: seller?.mchj?.registration_address ?? "",
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
        if (files.ustav_file) {
          formData.append("ustav_file", files.ustav_file);
        }
        if (files.mchj_license) {
          formData.append("mchj_license", files.mchj_license);
        }
        if (files.director_appointment_file) {
          formData.append(
            "director_appointment_file",
            files.director_appointment_file
          );
        }
        if (files.director_passport_file) {
          formData.append(
            "director_passport_file",
            files.director_passport_file
          );
        }
        if (files.legal_address_file) {
          formData.append("legal_address_file", files.legal_address_file);
        }
        if (files.kadastr_file) {
          formData.append("kadastr_file", files.kadastr_file);
        }
        if (files.vat_file) {
          formData.append("vat_file", files.vat_file);
        }

        const data = await sellerService.createMchjSeller(formData);
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
    const requiredFiles: (keyof FileState)[] = [
      "ustav_file",
      "mchj_license",
      "director_appointment_file",
      "director_passport_file",
      "legal_address_file",
      "kadastr_file",
    ];

    const missingFiles = requiredFiles.filter((fieldName) => !files[fieldName]);

    if (missingFiles.length > 0) {
      alert(
        `Quyidagi majburiy fayllarni yuklashingiz shart: ${missingFiles.join(
          ", "
        )}`
      );
      return;
    }

    if (formik.values.is_vat_payer && !files.vat_file) {
      alert("QQS guvohnomasini yuklashingiz shart");
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
      <h3 className="text-lg font-semibold text-gray-900">MCHJ Ma'lumotlari</h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Kompaniya nomi */}
        <div className="space-y-2">
          <Label htmlFor="company_name">Kompaniya nomi *</Label>
          <Input
            id="company_name"
            name="company_name"
            placeholder="Kompaniya nomini kiriting"
            className={`bg-gray-50 ${
              formik.touched.company_name && formik.errors.company_name
                ? "border-red-500"
                : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.company_name}
          />
          {formik.touched.company_name && formik.errors.company_name && (
            <div className="text-red-500 text-sm">
              {formik.errors.company_name}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STIR */}
          <div className="space-y-2">
            <Label htmlFor="stir">STIR *</Label>
            <Input
              id="stir"
              name="stir"
              placeholder="000000000"
              className={`bg-gray-50 ${
                formik.touched.stir && formik.errors.stir
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stir}
            />
            {formik.touched.stir && formik.errors.stir && (
              <div className="text-red-500 text-sm">{formik.errors.stir}</div>
            )}
          </div>

          {/* OKED */}
          <div className="space-y-2">
            <Label htmlFor="oked">OKED *</Label>
            <Input
              id="oked"
              name="oked"
              placeholder="OKED kodini kiriting"
              className={`bg-gray-50 ${
                formik.touched.oked && formik.errors.oked
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.oked}
            />
            {formik.touched.oked && formik.errors.oked && (
              <div className="text-red-500 text-sm">{formik.errors.oked}</div>
            )}
          </div>
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

        {/* Majburiy hujjatlar */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Majburiy hujjatlar *</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MCHJ guvohnomasi */}
            <div className="space-y-2">
              <Label htmlFor="mchj_license">MCHJ guvohnomasi *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.mchj_license)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="mchj_license"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("mchj_license", e)}
                  className="hidden"
                />
                <label
                  htmlFor="mchj_license"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.mchj_license && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("mchj_license")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Ustav fayli */}
            <div className="space-y-2">
              <Label htmlFor="ustav_file">Ustav fayli *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.ustav_file)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="ustav_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("ustav_file", e)}
                  className="hidden"
                />
                <label
                  htmlFor="ustav_file"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.ustav_file && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("ustav_file")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Direktor tayinlash hujjati */}
            <div className="space-y-2">
              <Label htmlFor="director_appointment_file">
                Direktor tayinlash hujjati *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.director_appointment_file)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="director_appointment_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileUpload("director_appointment_file", e)
                  }
                  className="hidden"
                />
                <label
                  htmlFor="director_appointment_file"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.director_appointment_file && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile("director_appointment_file")
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Direktor pasport nusxasi */}
            <div className="space-y-2">
              <Label htmlFor="director_passport_file">
                Direktor pasport nusxasi *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.director_passport_file)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="director_passport_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileUpload("director_passport_file", e)
                  }
                  className="hidden"
                />
                <label
                  htmlFor="director_passport_file"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.director_passport_file && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("director_passport_file")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Yuridik manzil hujjati */}
            <div className="space-y-2">
              <Label htmlFor="legal_address_file">
                Yuridik manzil hujjati *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.legal_address_file)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="legal_address_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("legal_address_file", e)}
                  className="hidden"
                />
                <label
                  htmlFor="legal_address_file"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.legal_address_file && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("legal_address_file")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Kadastr fayli */}
            <div className="space-y-2">
              <Label htmlFor="kadastr_file">Kadastr fayli *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getFileName(files.kadastr_file)}
                  className="bg-gray-50"
                  readOnly
                />
                <input
                  type="file"
                  id="kadastr_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload("kadastr_file", e)}
                  className="hidden"
                />
                <label
                  htmlFor="kadastr_file"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Yuklash
                </label>
                {files.kadastr_file && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("kadastr_file")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
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
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FileText size={14} />
              PDF formati qabul qilinadi
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
