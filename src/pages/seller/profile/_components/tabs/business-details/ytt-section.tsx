import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText } from "lucide-react";

export default function YttSection({
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
        YTT Sotuvchi ma'lumotlari
      </h3>

      {/* Korxona nomi */}
      <div className="space-y-2">
        <Label htmlFor="company_name">Korxona nomi *</Label>
        <Input
          id="company_name"
          placeholder="Korxona nomini kiriting"
          className="bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STIR (INN) */}
        <div className="space-y-2">
          <Label htmlFor="inn">STIR (INN) *</Label>
          <Input
            id="inn"
            placeholder="000000000"
            className="bg-gray-50"
          />
        </div>

        {/* JShShIR (PINFL) */}
        <div className="space-y-2">
          <Label htmlFor="pinfl">JShShIR (PINFL) *</Label>
          <Input
            id="pinfl"
            placeholder="00000000000000"
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Ro'yxatdan o'tish raqami */}
      <div className="space-y-2">
        <Label htmlFor="business_reg_number">Ro'yxatdan o'tish raqami *</Label>
        <Input
          id="business_reg_number"
          placeholder="Ro'yxatdan o'tish raqamini kiriting"
          className="bg-gray-50"
        />
      </div>

      {/* Ro'yxatdan o'tgan manzil */}
      <div className="space-y-2">
        <Label htmlFor="business_reg_address">Ro'yxatdan o'tgan manzil *</Label>
        <Textarea
          id="business_reg_address"
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

        {/* YTT guvohnomasi */}
        <div className="space-y-2">
          <Label htmlFor="ytt_certificate_file">YTT guvohnomasi *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="ytt_certificate_file"
              placeholder="Fayl tanlanmagan"
              className="bg-gray-50"
              readOnly
            />
            <button
              type="button"
              onClick={() => handleFileUpload("ytt_certificate_file")}
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
        <Checkbox id="is_vat_payer" />
        <Label htmlFor="is_vat_payer" className="text-sm font-medium">
          QQS to'lovchisiman
        </Label>
      </div>

      {/* QQS fayli (shart emas) */}
      <div className="space-y-2">
        <Label htmlFor="vat_file">QQS guvohnomasi (agar mavjud bo'lsa)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="vat_file"
            placeholder="Fayl tanlanmagan"
            className="bg-gray-50"
            readOnly
          />
          <button
            type="button"
            onClick={() => handleFileUpload("vat_file")}
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