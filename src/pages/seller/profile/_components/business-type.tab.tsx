import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BusinessTypeTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Biznes turini tanlang
      </h3>
      <p className="text-sm text-gray-600">Quyidagilardan birini tanlang</p>

      <RadioGroup defaultValue="ytt" className="flex flex-col gap-4">
        <div className="flex items-center h-12 px-2 gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <RadioGroupItem
            value="ytt"
            id="ytt"
            className="text-blue-600 border-blue-600"
          />
          <Label
            htmlFor="ytt"
            className="text-base cursor-pointer flex-1 h-full"
          >
            Yakka tartibdagi tadbirkor
          </Label>
        </div>

        <div className="flex items-center h-12 px-2 gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <RadioGroupItem
            value="mchj"
            id="mchj"
            className="text-blue-600 border-blue-600"
          />
          <Label
            htmlFor="mchj"
            className="text-base cursor-pointer flex-1 h-full"
          >
            MCHJ yoki boshqa yuridik shaxs
          </Label>
        </div>

        <div className="flex items-center h-12 px-2 gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <RadioGroupItem
            value="self_employed"
            id="self_employed"
            className="text-blue-600 border-blue-600"
          />
          <Label
            htmlFor="self_employed"
            className="text-base cursor-pointer flex-1 h-full"
          >
            O'zini o'zi band qiluvchi shaxs
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
