import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackTabsButton from "../buttons/back-tabs-button";
import NextButton from "@/components/common/buttons/next-button";
import { Upload, FileText, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useSellerStore } from "@/stores/seller.store";
import { toast } from "sonner";
import { commissionerService } from "@/services/commissioner.service";
import { useTranslation } from "react-i18next";

// Validation schema
const validationSchema = (t: any) => Yup.object({
  contract_number: Yup.string()
    .min(1, t("pages.commissioner_tab.contract_number_required"))
    .required(t("pages.commissioner_tab.contract_number_required")),
  contract_start_date: Yup.string().required(
    t("pages.commissioner_tab.contract_start_date_required")
  ),
  contract_end_date: Yup.string()
    .required(t("pages.commissioner_tab.contract_end_date_required"))
    .test(
      "is-future",
      t("pages.commissioner_tab.contract_end_date_must_be_future"),
      function (value) {
        const startDate = this.parent.contract_start_date;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
});

interface FormValues {
  contract_number: string;
  contract_start_date: string;
  contract_end_date: string;
}

interface FileState {
  contract_file: File | null;
}

// Predefined values for disabled fields
const predefinedValues = {
  inn_or_jshshir: "311439965",
  company: "AUTOMATIC TECHNOLOGY SOLUIONS MCHJ",
  mfo: "00401",
  account_number: "20208000707099742001",
};

export default function CommissionerTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const [file, setFile] = useState<FileState>({
    contract_file: null,
  });
  const { seller, setSeller } = useSellerStore();
  const { t } = useTranslation();

  // Default qiymatlarni o'rnatish
  const getDefaultStartDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getDefaultEndDate = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      contract_number: seller?.commissioner?.contract_number ?? "",
      contract_start_date: getDefaultStartDate(),
      contract_end_date: getDefaultEndDate(),
    },
    validationSchema: validationSchema(t),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        if (file.contract_file) {
          formData.append("contract_file", file.contract_file);
        }

        const data = await commissionerService.create(formData);
        setSeller(data);
        handleSelectTab("finish_tab");
      } catch (error) {
        console.error(t("pages.commissioner_tab.error_saving_commissioner_details"), error);
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      // Fayl turini tekshirish
      const allowedTypes = ["application/pdf"];

      if (!allowedTypes.includes(uploadedFile.type)) {
        toast("Error", {
          description: t("pages.commissioner_tab.only_pdf_allowed"),
        });
        return;
      }

      // Fayl hajmini tekshirish (masalan, 10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast("Error", {
          description: t("pages.commissioner_tab.file_size_max_10mb"),
        });
        return;
      }

      setFile({ contract_file: uploadedFile });
    }
  };

  const handleRemoveFile = () => {
    setFile({ contract_file: null });
  };

  const getFileName = () => {
    return file.contract_file ? file.contract_file.name : t("pages.commissioner_tab.file_not_selected");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{t("pages.commissioner_tab.commissioner")}</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium mb-2">
          {t("pages.commissioner_tab.enter_amaar_market_commissioner_details")}
        </p>
      </div>

      {/* Ko'rsatmalar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">{t("pages.commissioner_tab.instructions")}</h4>
        <p className="text-gray-700 mb-4">
          {t("pages.commissioner_tab.add_amaar_market_to_commissioner_list")}
        </p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
          <li>
            <a
              href="https://my3.soliq.uz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              {t("pages.commissioner_tab.go_to_e_tax_website")}
              <ExternalLink size={14} />
            </a>
          </li>
          <li>{t("pages.commissioner_tab.use_digital_signature_to_login")}</li>
          <li>
            {t("pages.commissioner_tab.find_and_select_service")}
          </li>
          <li>
            {t("pages.commissioner_tab.click_add_and_enter_details")}
          </li>
        </ol>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          {/* STIR yoki JShShIR */}
          <div className="space-y-2">
            <Label htmlFor="inn_or_jshshir">{t("pages.commissioner_tab.stir_or_jshshir")}</Label>
            <Input
              id="inn_or_jshshir"
              name="inn_or_jshshir"
              className="bg-gray-50"
              value={predefinedValues.inn_or_jshshir}
              disabled
            />
          </div>

          {/* Firma nomi */}
          <div className="space-y-2">
            <Label htmlFor="company">{t("pages.commissioner_tab.company_name")}</Label>
            <Input
              id="company"
              name="company"
              className="bg-gray-50"
              value={predefinedValues.company}
              disabled
            />
          </div>

          {/* MFO va Hisob raqami */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mfo">{t("pages.commissioner_tab.commissioner_bank_mfo")}</Label>
              <Input
                id="mfo"
                name="mfo"
                className="bg-gray-50"
                value={predefinedValues.mfo}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">{t("pages.commissioner_tab.account_number")}</Label>
              <Input
                id="account_number"
                name="account_number"
                className="bg-gray-50"
                value={predefinedValues.account_number}
                disabled
              />
            </div>
          </div>

          {/* Shartnoma raqami */}
          <div className="space-y-2">
            <Label htmlFor="contract_number">{t("pages.commissioner_tab.contract_number")}</Label>
            <Input
              id="contract_number"
              name="contract_number"
              className={`bg-gray-50 ${
                formik.touched.contract_number && formik.errors.contract_number
                  ? "border-red-500"
                  : ""
              }`}
              placeholder={t("pages.commissioner_tab.enter_contract_number")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contract_number}
            />
            {formik.touched.contract_number &&
              formik.errors.contract_number && (
                <div className="text-red-500 text-sm">
                  {formik.errors.contract_number}
                </div>
              )}
          </div>

          {/* Shartnoma sanalari */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_start_date">
                {t("pages.commissioner_tab.contract_start_date")}
              </Label>
              <Input
                id="contract_start_date"
                name="contract_start_date"
                type="date"
                className={`bg-gray-50 ${
                  formik.touched.contract_start_date &&
                  formik.errors.contract_start_date
                    ? "border-red-500"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.contract_start_date}
              />
              {formik.touched.contract_start_date &&
                formik.errors.contract_start_date && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.contract_start_date}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_end_date">
                {t("pages.commissioner_tab.contract_end_date")}
              </Label>
              <Input
                id="contract_end_date"
                name="contract_end_date"
                type="date"
                className={`bg-gray-50 ${
                  formik.touched.contract_end_date &&
                  formik.errors.contract_end_date
                    ? "border-red-500"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.contract_end_date}
              />
              {formik.touched.contract_end_date &&
                formik.errors.contract_end_date && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.contract_end_date}
                  </div>
                )}
            </div>
          </div>

          {/* Fayl yuklash */}
          <div className="space-y-2">
            <Label htmlFor="contract_file">{t("pages.commissioner_tab.contract_file")}</Label>
            <div className="flex items-center gap-2">
              <Input value={getFileName()} className="bg-gray-50" readOnly />
              <input
                type="file"
                id="contract_file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="contract_file"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                {t("pages.commissioner_tab.upload")}
              </label>
              {file.contract_file && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FileText size={14} />
              {t("pages.commissioner_tab.upload_in_pdf_format")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <BackTabsButton
            onClick={() => handleSelectTab("bank_account_number")}
          />
          <NextButton loading={false} onClick={formik.handleSubmit} />
        </div>
      </form>
    </div>
  );
}
