import { useState, useRef } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user.store";
import { profileSchema } from "@/schemas/profile.schema";
import { defaultImageAvatar, serverUrl } from "@/utils/shared";
import { userService } from "@/services/user.service";
import { useTranslation } from "react-i18next";
import { Camera, Edit2, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading, handleLoading, setUser } = useUserStore();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email.value || "",
      phone: user?.phone.value || "+998 ",
      avatar: null as File | null,
      password: "",
    },
    validationSchema: profileSchema(t),
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleLoading(true);
      try {
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("last_name", values.last_name);
        formData.append("phone", values.phone);
        if (values.password) formData.append("password", values.password);
        if (values.avatar) formData.append("avatar", values.avatar);

        const data = await userService.update(formData);
        setUser(data);
        setIsEditing(false);
        setPreviewAvatar(null);
        toast.success(t("common.success"), {
          description: t("common.profile_updated"),
        });
      } catch (error) {
        console.error("Profile update failed:", error);
        toast.error(t("common.error"));
      } finally {
        handleLoading(false);
      }
    },
  });

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    formik.resetForm();
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("avatar", file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="w-full">
      {/* Avatar Section */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-2xl border-2 border-gray-300 overflow-hidden shadow-md">
              <img
                src={
                  previewAvatar ||
                  (user?.avatar
                    ? `${serverUrl}/uploads/${user.avatar}`
                    : defaultImageAvatar)
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {formik.values.first_name} {formik.values.last_name}
            </h2>
            <p className="text-gray-600 mt-1">{formik.values.email}</p>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-3">
                {t("pages.account_details_page.change_avatar_instruction")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6 mb-8">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="first_name"
                className="text-sm font-semibold text-gray-700"
              >
                {t("pages.account_details_page.first_name")}
              </Label>
              <div className="relative">
                <Input
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`transition-all ${
                    !isEditing
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                      : "border-blue-300 focus:border-blue-500"
                  } h-11`}
                />
              </div>
              {formik.touched.first_name && formik.errors.first_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  {formik.errors.first_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="last_name"
                className="text-sm font-semibold text-gray-700"
              >
                {t("pages.account_details_page.last_name")}
              </Label>
              <div className="relative">
                <Input
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`transition-all ${
                    !isEditing
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                      : "border-blue-300 focus:border-blue-500"
                  } h-11`}
                />
              </div>
              {formik.touched.last_name && formik.errors.last_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  {formik.errors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              {t("pages.account_details_page.email_address")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              disabled
              className="bg-gray-100 border-gray-200 cursor-not-allowed h-11"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700"
            >
              {t("pages.account_details_page.phone_number")}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditing}
              className={`transition-all h-11 ${
                !isEditing
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-blue-300 focus:border-blue-500"
              }`}
              placeholder="+998 90 123 45 67"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          {isEditing && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                {t("pages.account_details_page.new_password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t(
                  "pages.account_details_page.new_password_placeholder"
                )}
                className="border-blue-300 focus:border-blue-500 h-11"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  {formik.errors.password}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                {t(
                  "pages.account_details_page.new_password_placeholder"
                )}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          {!isEditing ? (
            <Button
              type="button"
              onClick={handleEdit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-11 gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {t("pages.account_details_page.edit")}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
                className="h-11 border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                {t("pages.account_details_page.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading || !formik.isValid}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold h-11 gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("pages.account_details_page.saving")}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {t("pages.account_details_page.save")}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
