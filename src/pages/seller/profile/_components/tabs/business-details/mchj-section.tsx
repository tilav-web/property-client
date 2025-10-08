import NextButton from "@/components/common/buttons/next-button";
import BackTabsButton from "../../buttons/back-tabs-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText } from "lucide-react";

export default function MchjSection({
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
        MCHJ Ma'lumotlari
      </h3>

      {/* Kompaniya nomi */}
      <div className="space-y-2">
        <Label htmlFor="company_name">Kompaniya nomi *</Label>
        <Input
          id="company_name"
          placeholder="Kompaniya nomini kiriting"
          className="bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STIR */}
        <div className="space-y-2">
          <Label htmlFor="stir">STIR *</Label>
          <Input
            id="stir"
            placeholder="000000000"
            className="bg-gray-50"
          />
        </div>

        {/* OKED */}
        <div className="space-y-2">
          <Label htmlFor="oked">OKED *</Label>
          <Input
            id="oked"
            placeholder="OKED kodini kiriting"
            className="bg-gray-50"
          />
        </div>
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

      {/* Majburiy hujjatlar */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Majburiy hujjatlar *</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MCHJ guvohnomasi */}
          <div className="space-y-2">
            <Label htmlFor="mchj_license">MCHJ guvohnomasi</Label>
            <div className="flex items-center gap-2">
              <Input
                id="mchj_license"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("mchj_license")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>

          {/* Ustav fayli */}
          <div className="space-y-2">
            <Label htmlFor="ustav_file">Ustav fayli</Label>
            <div className="flex items-center gap-2">
              <Input
                id="ustav_file"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("ustav_file")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>

          {/* Direktor tayinlash hujjati */}
          <div className="space-y-2">
            <Label htmlFor="director_appointment_file">Direktor tayinlash hujjati</Label>
            <div className="flex items-center gap-2">
              <Input
                id="director_appointment_file"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("director_appointment_file")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>

          {/* Direktor pasport nusxasi */}
          <div className="space-y-2">
            <Label htmlFor="director_passport_file">Direktor pasport nusxasi</Label>
            <div className="flex items-center gap-2">
              <Input
                id="director_passport_file"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("director_passport_file")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>

          {/* Yuridik manzil hujjati */}
          <div className="space-y-2">
            <Label htmlFor="legal_address_file">Yuridik manzil hujjati</Label>
            <div className="flex items-center gap-2">
              <Input
                id="legal_address_file"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("legal_address_file")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>

          {/* Kadastr fayli */}
          <div className="space-y-2">
            <Label htmlFor="kadastr_file">Kadastr fayli</Label>
            <div className="flex items-center gap-2">
              <Input
                id="kadastr_file"
                placeholder="Fayl tanlanmagan"
                className="bg-gray-50"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleFileUpload("kadastr_file")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} />
                Yuklash
              </button>
            </div>
          </div>
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
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FileText size={14} />
          PDF, JPG, PNG formatlari qabul qilinadi
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