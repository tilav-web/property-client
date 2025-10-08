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
import { useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import { sellerService } from "@/services/seller.service";
import type { SellerBusinessType } from "@/interfaces/seller.interface";
import { useSellerStore } from "@/stores/seller.store";

export default function UserDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { user, setUser } = useUserStore();
  const { setSeller, seller } = useSellerStore();
  const [params] = useSearchParams();
  const business_type = params.get("business_type") as SellerBusinessType;

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone.value || "+998 ",
      passport: seller?.passport || "",
      lan: user?.lan || "en",
      business_type,
    },
    onSubmit: async (values) => {
      const data = await sellerService.createSeller(values);
      setUser(data.user);
      setSeller(data.seller);
      handleSelectTab("busisess_details");
    },
    enableReinitialize: true,
  });

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
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            defaultValue={user?.first_name || ""}
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Familiya</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            disabled
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
              name="phone"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          <Label htmlFor="passport">Passport</Label>
          <Input
            id="passport"
            name="passport"
            value={formik.values.passport}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="AA xxxxxxx"
            className="bg-gray-50 flex-1 pr-6"
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Label htmlFor="language">Til</Label>
          <Select
            name="lan"
            value={formik.values.lan}
            onValueChange={(value) => formik.setFieldValue("lan", value)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Tilni tanlang" />
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
          <NextButton loading={false} onClick={formik.handleSubmit} />
        </div>
      </div>
    </div>
  );
}
