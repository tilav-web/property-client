import { useFormik } from "formik";
import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";
import { useSellerStore } from "@/stores/seller.store";
import { yttBusinessDetailsSchema } from "@/schemas/ytt-business-details-schema";
import { sellerService } from "@/services/seller.service";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface FileState {
  passport_file: File | null;
  ytt_certificate_file: File | null;
  vat_file: File | null;
}

export default function YttSection({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const [files, setFiles] = useState<FileState>({
    passport_file: null,
    ytt_certificate_file: null,
    vat_file: null,
  });
  const { seller, setSeller } = useSellerStore();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      company_name: seller?.ytt?.company_name ?? "",
      inn: seller?.ytt?.inn ?? "",
      pinfl: seller?.ytt?.pinfl ?? "",
      business_reg_number: seller?.ytt?.business_reg_number ?? "",
      business_reg_address: seller?.ytt?.business_reg_address ?? "",
      is_vat_payer: false,
      seller: seller?._id,
    },
    validationSchema: yttBusinessDetailsSchema(t),
    onSubmit: async (values) => {
      try {
        // FormData yaratish
        const formData = new FormData();

        // DTO ni FormData ga qo'shish
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        
        // Fayllarni qo'shish
        if (files.passport_file) {
          formData.append("passport_file", files.passport_file);
        }
        if (files.ytt_certificate_file) {
          formData.append("ytt_certificate_file", files.ytt_certificate_file);
        }
        if (files.vat_file) {
          formData.append("vat_file", files.vat_file);
        }

        const data = await sellerService.createYttSeller(formData);
        setSeller(data);
        handleSelectTab("bank_account_number");
      } catch (error) {
        console.error(t("pages.ytt_section.error_submitting_form"), error);
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
      if (file.type !== "application/pdf") {
        alert(t("pages.ytt_section.only_pdf_allowed"));
        return;
      }

      // Fayl hajmini tekshirish (masalan, 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("pages.ytt_section.file_size_max_5mb"));
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
        description: t("pages.ytt_section.must_upload_passport_file"),
      });
      return;
    }

    if (!files.ytt_certificate_file) {
      toast.error("Error", {
        description: t("pages.ytt_section.must_upload_ytt_certificate"),
      });
      return;
    }

    if (formik.values.is_vat_payer && !files.vat_file) {
      toast.error("Error", {
        description: t("pages.ytt_section.must_upload_vat_certificate"),
      });
      return;
    }

    // Formani validatsiyadan o'tkazib, keyin submit qilamiz
    formik.handleSubmit();
  };

  const getFileName = (file: File | null) => {
    return file ? file.name : t("pages.ytt_section.file_not_selected");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("pages.ytt_section.ytt_seller_details")}
      </h3>

      <form className="space-y-4">
        {/* Korxona nomi */}
        <div className="space-y-2">
          <Label htmlFor="company_name">{t("pages.ytt_section.company_name")}</Label>
          <Input
            id="company_name"
            name="company_name"
            placeholder={t("pages.ytt_section.enter_company_name")}
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
          {/* STIR (INN) */}
          <div className="space-y-2">
            <Label htmlFor="inn">{t("pages.ytt_section.stir_inn")}</Label>
            <Input
              id="inn"
              name="inn"
              placeholder={t("pages.ytt_section.stir_placeholder")}
              className={`bg-gray-50 ${
                formik.touched.inn && formik.errors.inn ? "border-red-500" : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.inn}
            />
            {formik.touched.inn && formik.errors.inn && (
              <div className="text-red-500 text-sm">{formik.errors.inn}</div>
            )}
          </div>

          {/* JShShIR (PINFL) */}
          <div className="space-y-2">
            <Label htmlFor="pinfl">{t("pages.ytt_section.jshshir_pinfl")}</Label>
            <Input
              id="pinfl"
              name="pinfl"
              placeholder={t("pages.ytt_section.jshshir_placeholder")}
              className={`bg-gray-50 ${
                formik.touched.pinfl && formik.errors.pinfl
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pinfl}
            />
            {formik.touched.pinfl && formik.errors.pinfl && (
              <div className="text-red-500 text-sm">{formik.errors.pinfl}</div>
            )}
          </div>
        </div>

        {/* Ro'yxatdan o'tish raqami */}
        <div className="space-y-2">
          <Label htmlFor="business_reg_number">
            {t("pages.ytt_section.registration_number")}
          </Label>
          <Input
            id="business_reg_number"
            name="business_reg_number"
            placeholder={t("pages.ytt_section.enter_registration_number")}
            className={`bg-gray-50 ${
              formik.touched.business_reg_number &&
              formik.errors.business_reg_number
                ? "border-red-500"
                : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.business_reg_number}
          />
          {formik.touched.business_reg_number &&
            formik.errors.business_reg_number && (
              <div className="text-red-500 text-sm">
                {formik.errors.business_reg_number}
              </div>
            )}
        </div>

        {/* Ro'yxatdan o'tgan manzil */}
        <div className="space-y-2">
          <Label htmlFor="business_reg_address">
            {t("pages.ytt_section.registration_address")}
          </Label>
          <Textarea
            id="business_reg_address"
            name="business_reg_address"
            placeholder={t("pages.ytt_section.enter_full_address")}
            className={`bg-gray-50 min-h-[80px] ${
              formik.touched.business_reg_address &&
              formik.errors.business_reg_address
                ? "border-red-500"
                : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.business_reg_address}
          />
          {formik.touched.business_reg_address &&
            formik.errors.business_reg_address && (
              <div className="text-red-500 text-sm">
                {formik.errors.business_reg_address}
              </div>
            )}
        </div>

        {/* Fayl yuklash qismlari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pasport fayli */}
          <div className="space-y-2">
            <Label htmlFor="passport_file">{t("pages.ytt_section.passport_copy")}</Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.passport_file)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="passport_file"
                accept=".pdf"
                onChange={(e) => handleFileUpload("passport_file", e)}
                className="hidden"
              />
              <label
                htmlFor="passport_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                {t("pages.ytt_section.upload")}
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
              {t("pages.ytt_section.pdf_format_accepted")}
            </p>
          </div>

          {/* YTT guvohnomasi */}
          <div className="space-y-2">
            <Label htmlFor="ytt_certificate_file">{t("pages.ytt_section.ytt_certificate")}</Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.ytt_certificate_file)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="ytt_certificate_file"
                accept=".pdf"
                onChange={(e) => handleFileUpload("ytt_certificate_file", e)}
                className="hidden"
              />
              <label
                htmlFor="ytt_certificate_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                {t("pages.ytt_section.upload")}
              </label>
              {files.ytt_certificate_file && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile("ytt_certificate_file")}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FileText size={14} />
              {t("pages.ytt_section.pdf_format_accepted")}
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
            {t("pages.ytt_section.i_am_vat_payer")}
          </Label>
        </div>

        {/* QQS fayli (shart emas) */}
        {formik.values.is_vat_payer && (
          <div className="space-y-2">
            <Label htmlFor="vat_file">{t("pages.ytt_section.vat_certificate")}</Label>
            <div className="flex items-center gap-2">
              <Input
                value={getFileName(files.vat_file)}
                className="bg-gray-50"
                readOnly
              />
              <input
                type="file"
                id="vat_file"
                accept=".pdf"
                onChange={(e) => handleFileUpload("vat_file", e)}
                className="hidden"
              />
              <label
                htmlFor="vat_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                {t("pages.ytt_section.upload")}
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
              {t("pages.ytt_section.pdf_format_accepted")}
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
