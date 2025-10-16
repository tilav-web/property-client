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
      } catch (error) {
        console.error("Profile update failed:", error);
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
    <div className="my-4 max-w-4xl px-4">
      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-gray-300">
            <img
              src={
                previewAvatar ||
                (user?.avatar
                  ? `${serverUrl}/uploads/${user.avatar}`
                  : defaultImageAvatar)
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {isEditing && (
            <Button
              type="button"
              onClick={triggerFileInput}
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-md w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {formik.values.first_name} {formik.values.last_name}
          </h2>
          <p className="text-gray-600">{formik.values.email}</p>
          {isEditing && (
            <p className="text-sm text-gray-500 mt-1">
              {t("pages.account_details_page.change_avatar_instruction")}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6 mb-6">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                {t("pages.account_details_page.first_name")}
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <p className="text-red-500 text-sm">
                  {formik.errors.first_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">
                {t("pages.account_details_page.last_name")}
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <p className="text-red-500 text-sm">
                  {formik.errors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("pages.account_details_page.email_address")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
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
              className={!isEditing ? "bg-gray-50" : ""}
              placeholder="+998 90 123 45 67"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}
          </div>

          {/* Password */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">
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
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button type="button" onClick={handleEdit} variant="outline">
              {t("pages.account_details_page.edit")}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
              >
                {t("pages.account_details_page.cancel")}
              </Button>
              <Button type="submit" disabled={loading || !formik.isValid}>
                {loading
                  ? t("pages.account_details_page.saving")
                  : t("pages.account_details_page.save")}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
