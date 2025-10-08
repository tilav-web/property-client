import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user.store";
import NextButton from "@/components/common/buttons/next-button";
import { Check, X } from "lucide-react";
import BackTabsButton from "../buttons/back-tabs-button";

export default function UserDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { user } = useUserStore();

  const handleSelectUserDetails = () => {
    handleSelectTab("busisess_details");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Shaxsiy ma'lumotlar
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Ism</Label>
          <Input
            id="first_name"
            defaultValue={user?.first_name || ""}
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Familiya</Label>
          <Input
            id="last_name"
            defaultValue={user?.last_name || ""}
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex items-center gap-2 relative">
          <Input
            id="email"
            type="email"
            defaultValue={user?.email?.value || ""}
            className="bg-gray-50 flex-1 pr-6"
          />
          {user?.email?.isVerified ? (
            <button
              className="absolute right-2 top-0 bottom-0 my-auto text-green-500"
              title="Tasdiqlangan"
            >
              <Check />
            </button>
          ) : (
            <button
              className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
              title="Tasdiqlanmagan"
            >
              <X />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="phone">Telefon</Label>
          <div className="flex items-center gap-2 relative">
            <Input
              id="phone"
              type="tel"
              defaultValue={user?.phone?.value || ""}
              className="bg-gray-50 flex-1 pr-6"
            />
            {user?.phone?.isVerified ? (
              <button
                className="absolute right-2 top-0 bottom-0 my-auto text-green-500"
                title="Tasdiqlangan"
              >
                <Check />
              </button>
            ) : (
              <button
                className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
                title="Tasdiqlanmagan"
              >
                <X />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-2 flex-1">
          <Label htmlFor="pasport">Pasport</Label>
          <Input
            placeholder="AA xxxxxxx"
            id="pasport"
            className="bg-gray-50 flex-1 pr-6"
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Label htmlFor="language">Til</Label>
          <Select defaultValue={user?.lan || "uz"}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uz">O'zbekcha</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <BackTabsButton onClick={() => handleSelectTab("business_type")} />
          <NextButton loading={false} onClick={handleSelectUserDetails} />
        </div>
      </div>
    </div>
  );
}
