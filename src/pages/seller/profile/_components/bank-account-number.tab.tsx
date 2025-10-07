import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user.store";

export default function BankAccountNumberTab() {
  const { user } = useUserStore();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Bank hisob raqami</h3>

      <div className="space-y-4">
        {/* Bank nomi */}
        <div className="space-y-2">
          <Label htmlFor="bank_name">Bank nomi</Label>
          <Input
            id="bank_name"
            name="bank_name"
            className="bg-gray-50"
            placeholder="Bank nomini kiriting"
            required
          />
        </div>

        {/* Hisob raqami */}
        <div className="space-y-2">
          <Label htmlFor="account_number">Hisob raqami</Label>
          <Input
            id="account_number"
            name="account_number"
            className="bg-gray-50"
            placeholder="0000 0000 0000 0000 0000"
            maxLength={20}
            pattern="\d{20}"
            title="Hisob raqami 20 ta raqamdan iborat bo‘lishi kerak"
            required
          />
        </div>

        {/* MFO va SWIFT kodi */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mfo">MFO</Label>
            <Input
              id="mfo"
              name="mfo"
              className="bg-gray-50"
              placeholder="MFO raqami"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="swift_code">SWIFT kodi</Label>
            <Input
              id="swift_code"
              name="swift_code"
              className="bg-gray-50 uppercase"
              placeholder="SWIFT kodi (masalan: ASKBUS22)"
              pattern="[A-Za-z0-9]{8,11}"
              title="SWIFT kodi 8 yoki 11 ta harf/raqamdan iborat bo‘lishi kerak"
              required
            />
          </div>
        </div>

        {/* Hisob egasining to‘liq ismi */}
        <div className="space-y-2">
          <Label htmlFor="owner_full_name">Hisob egasining to‘liq ismi</Label>
          <Input
            id="owner_full_name"
            name="owner_full_name"
            defaultValue={`${user?.first_name || ""} ${user?.last_name || ""}`}
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
