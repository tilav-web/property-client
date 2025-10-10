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

// Validation schema
const validationSchema = Yup.object({
  contract_number: Yup.string()
    .min(1, "Shartnoma raqami majburiy")
    .required("Shartnoma raqami majburiy"),
  contract_start_date: Yup.string().required(
    "Shartnoma boshlanish sanasi majburiy"
  ),
  contract_end_date: Yup.string()
    .required("Shartnoma tugash sanasi majburiy")
    .test(
      "is-future",
      "Shartnoma muddati kelajakda bo'lishi kerak",
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
    validationSchema: validationSchema,
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
        console.error("Komissioner ma'lumotlarini saqlashda xatolik:", error);
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
          description: "Faqat PDF  formatidagi fayl qabul qilinadi",
        });
        return;
      }

      // Fayl hajmini tekshirish (masalan, 10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast("Error", {
          description: "Fayl hajmi 10MB dan oshmasligi kerak",
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
    return file.contract_file ? file.contract_file.name : "Fayl tanlanmagan";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Komissioner</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium mb-2">
          Amaar Market komissioner ma'lumotlarini kiriting
        </p>
      </div>

      {/* Ko'rsatmalar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Ko'rsatmalar:</h4>
        <p className="text-gray-700 mb-4">
          Amaar Marketni elektron soliq xizmatlari veb-saytidagi komissionerlar
          ro'yxatiga qo'shing
        </p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
          <li>
            <a
              href="https://my3.soliq.uz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              Elektron soliq xizmatlari veb-saytiga o'ting
              <ExternalLink size={14} />
            </a>
          </li>
          <li>Tizimga kirish uchun raqamli imzo kalitingizdan foydalaning</li>
          <li>
            Soliq hisobi bo'limida qidiruvdan foydalaning va "Jismoniy shaxslar
            uchun komissionerlar ro'yxatini shakllantirish" xizmatini tanlang
          </li>
          <li>
            Komissioner yaratish ekranida Qo'shish tugmasini bosing va quyidagi
            ma'lumotlarni kiriting:
          </li>
        </ol>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          {/* STIR yoki JShShIR */}
          <div className="space-y-2">
            <Label htmlFor="inn_or_jshshir">STIR yoki JShShIR *</Label>
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
            <Label htmlFor="company">Firma nomi *</Label>
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
              <Label htmlFor="mfo">Komissioner bankining MFO si *</Label>
              <Input
                id="mfo"
                name="mfo"
                className="bg-gray-50"
                value={predefinedValues.mfo}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Hisob raqami *</Label>
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
            <Label htmlFor="contract_number">Shartnoma raqami *</Label>
            <Input
              id="contract_number"
              name="contract_number"
              className={`bg-gray-50 ${
                formik.touched.contract_number && formik.errors.contract_number
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Shartnoma raqamini kiriting"
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
                Shartnoma boshlanish sanasi *
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
                Shartnoma tugash sanasi *
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
            <Label htmlFor="contract_file">Shartnoma fayli *</Label>
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
                Yuklash
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
              PDF formatida yuklang
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
