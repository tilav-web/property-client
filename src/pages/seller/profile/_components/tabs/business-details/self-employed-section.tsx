import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText } from "lucide-react";

export default function SelfEmployedSection({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const handleSelectBusisessDetails = () => {
    handleSelectTab("bank_account_number");
  };

  const handleFileUpload = (fieldName: string) => {
    console.log(`Uploading file for: ${fieldName}`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Yakka Tartibdagi Tadbirkor Ma'lumotlari
      </h3>

      {/* Shaxs ma'lumotlari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ism */}
        <div className="space-y-2">
          <Label htmlFor="first_name">Ism *</Label>
          <Input
            id="first_name"
            placeholder="Ismingizni kiriting"
            className="bg-gray-50"
          />
        </div>

        {/* Familiya */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Familiya *</Label>
          <Input
            id="last_name"
            placeholder="Familiyangizni kiriting"
            className="bg-gray-50"
          />
        </div>

        {/* Otasining ismi */}
        <div className="space-y-2">
          <Label htmlFor="middle_name">Otasining ismi *</Label>
          <Input
            id="middle_name"
            placeholder="Otasining ismini kiriting"
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tug'ilgan sana */}
        <div className="space-y-2">
          <Label htmlFor="birth_date">Tug'ilgan sana *</Label>
          <Input id="birth_date" type="date" className="bg-gray-50" />
        </div>

        {/* JShShIR */}
        <div className="space-y-2">
          <Label htmlFor="jshshir">JShShIR *</Label>
          <Input
            id="jshshir"
            placeholder="00000000000000"
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Ro'yxatdan o'tish raqami */}
      <div className="space-y-2">
        <Label htmlFor="registration_number">Ro'yxatdan o'tish raqami *</Label>
        <Input
          id="registration_number"
          placeholder="Ro'yxatdan o'tish raqamini kiriting"
          className="bg-gray-50"
        />
      </div>

      {/* Ro'yxatdan o'tgan manzil */}
      <div className="space-y-2">
        <Label htmlFor="registration_address">Ro'yxatdan o'tgan manzil *</Label>
        <Textarea
          id="registration_address"
          placeholder="To'liq manzilni kiriting"
          className="bg-gray-50 min-h-[80px]"
        />
      </div>

      {/* Fayl yuklash qismlari */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pasport fayli */}
        <div className="space-y-2">
          <Label htmlFor="passport_file">Pasport nusxasi *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="passport_file"
              placeholder="Fayl tanlanmagan"
              className="bg-gray-50"
              readOnly
            />
            <button
              type="button"
              onClick={() => handleFileUpload("passport_file")}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Upload size={16} />
              Yuklash
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FileText size={14} />
            PDF, JPG, PNG formatlari qabul qilinadi
          </p>
        </div>

        {/* O'zini o'zi bandlik sertifikati */}
        <div className="space-y-2">
          <Label htmlFor="self_employment_certificate">
            O'zini o'zi bandlik sertifikati *
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="self_employment_certificate"
              placeholder="Fayl tanlanmagan"
              className="bg-gray-50"
              readOnly
            />
            <button
              type="button"
              onClick={() => handleFileUpload("self_employment_certificate")}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Upload size={16} />
              Yuklash
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FileText size={14} />
            PDF, JPG, PNG formatlari qabul qilinadi
          </p>
        </div>
      </div>

      {/* QQS mavjudmi */}
      <div className="flex items-center space-x-2">
        <Checkbox id="has_qqs" />
        <Label htmlFor="has_qqs" className="text-sm font-medium">
          QQS to'lovchisiman
        </Label>
      </div>

      {/* QQS fayli (shart emas) */}
      <div className="space-y-2">
        <Label htmlFor="qqs_file">QQS guvohnomasi (agar mavjud bo'lsa)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="qqs_file"
            placeholder="Fayl tanlanmagan"
            className="bg-gray-50"
            readOnly
          />
          <button
            type="button"
            onClick={() => handleFileUpload("qqs_file")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <Upload size={16} />
            Yuklash
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Agar siz QQS to'lovchisi bo'lsangiz, guvohnomani yuklashingiz mumkin
        </p>
      </div>

      {/* Navigatsiya tugmalari */}
      <div className="flex items-center justify-between pt-4">
        <BackTabsButton onClick={() => handleSelectTab("user_details")} />
        <NextButton loading={false} onClick={handleSelectBusisessDetails} />
      </div>
    </div>
  );
}
