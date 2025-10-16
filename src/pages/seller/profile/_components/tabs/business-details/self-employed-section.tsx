import { useFormik } from "formik";
import * as Yup from "yup";
import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";
import { useSellerStore } from "@/stores/seller.store";
import { toast } from "sonner";
import { sellerService } from "@/services/seller.service";
import { useUserStore } from "@/stores/user.store";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

// Validation schema
const validationSchema = (t: TFunction) =>
  Yup.object({
    first_name: Yup.string()
      .min(2, t("pages.self_employed_section.first_name_min_2"))
      .max(50, t("pages.self_employed_section.first_name_max_50"))
      .required(t("pages.self_employed_section.first_name_required")),
    last_name: Yup.string()
      .min(2, t("pages.self_employed_section.last_name_min_2"))
      .max(50, t("pages.self_employed_section.last_name_max_50"))
      .required(t("pages.self_employed_section.last_name_required")),
    middle_name: Yup.string()
      .min(2, t("pages.self_employed_section.middle_name_min_2"))
      .max(50, t("pages.self_employed_section.middle_name_max_50"))
      .required(t("pages.self_employed_section.middle_name_required")),
    birth_date: Yup.string().required(
      t("pages.self_employed_section.birth_date_required")
    ),
    jshshir: Yup.string()
      .matches(/^\d{14}$/, t("pages.self_employed_section.jshshir_14_digits"))
      .required(t("pages.self_employed_section.jshshir_required")),
  });

interface FileState {
  passport_file: File | null;
  self_employment_certificate: File | null;
}

interface FormValues {
  first_name: string;
  last_name: string;
  middle_name: string;
  birth_date: string;
  jshshir: string;
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
  });
  const { seller, setSeller } = useSellerStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

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
      seller: seller?._id,
    },
    validationSchema: validationSchema(t),
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

        const data = await sellerService.createSelfEmployedSeller(formData);
        setSeller(data);
        handleSelectTab("bank_account_number");
      } catch (error) {
        console.error(
          t("pages.self_employed_section.error_submitting_form"),
          error
        );
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
        alert(t("pages.self_employed_section.only_pdf_jpg_png_allowed"));
        return;
      }

      // Fayl hajmini tekshirish (masalan, 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("pages.self_employed_section.file_size_max_5mb"));
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
        description: t("pages.self_employed_section.must_upload_passport_file"),
      });
      return;
    }

    if (!files.self_employment_certificate) {
      toast.error("Error", {
        description: t(
          "pages.self_employed_section.must_upload_self_employment_certificate"
        ),
      });
      return;
    }

    // Formani validatsiyadan o'tkazib, keyin submit qilamiz
    formik.handleSubmit();
  };

  const getFileName = (file: File | null) => {
    return file
      ? file.name
      : t("pages.self_employed_section.file_not_selected");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("pages.self_employed_section.self_employed_entrepreneur_details")}
      </h3>

      <form className="space-y-4">
        {/* Shaxs ma'lumotlari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ism */}
          <div className="space-y-2">
            <Label htmlFor="first_name">
              {t("pages.self_employed_section.first_name")}
            </Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder={t("pages.self_employed_section.enter_first_name")}
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
            <Label htmlFor="last_name">
              {t("pages.self_employed_section.last_name")}
            </Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder={t("pages.self_employed_section.enter_last_name")}
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
            <Label htmlFor="middle_name">
              {t("pages.self_employed_section.middle_name")}
            </Label>
            <Input
              id="middle_name"
              name="middle_name"
              placeholder={t("pages.self_employed_section.enter_middle_name")}
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
            <Label htmlFor="birth_date">
              {t("pages.self_employed_section.birth_date")}
            </Label>
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
            <Label htmlFor="jshshir">
              {t("pages.self_employed_section.jshshir")}
            </Label>
            <Input
              id="jshshir"
              name="jshshir"
              placeholder={t("pages.self_employed_section.jshshir_placeholder")}
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
        {/* Fayl yuklash qismlari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pasport fayli */}
          <div className="space-y-2">
            <Label htmlFor="passport_file">
              {t("pages.self_employed_section.passport_copy")}
            </Label>
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
                {t("pages.self_employed_section.upload")}
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
              {t("pages.self_employed_section.pdf_format_accepted")}
            </p>
          </div>

          {/* O'zini o'zi bandlik sertifikati */}
          <div className="space-y-2">
            <Label htmlFor="self_employment_certificate">
              {t("pages.self_employed_section.self_employment_certificate")}
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
                {t("pages.self_employed_section.upload")}
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
              {t("pages.self_employed_section.pdf_format_accepted")}
            </p>
          </div>
        </div>
        {/* Navigatsiya tugmalari */}
        <div className="flex items-center justify-between pt-4">
          <BackTabsButton onClick={() => handleSelectTab("user_details")} />
          <NextButton loading={false} onClick={handleSelectBusisessDetails} />
        </div>
      </form>
    </div>
  );
}
