import { useState, useRef } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user.store";
import { profileSchema } from "@/schemas/profile.schema";
import { defaultImageAvatar, serverUrl } from "@/utils/shared";
import { userService } from "@/services/user.service";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); // For image preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading, handleLoading, setUser } = useUserStore();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email.value || "",
      phone: user?.phone.value || "+998 ",
      avatar: null as File | null, // Store File object instead of Base64
      password: "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      handleLoading(true);
      try {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("last_name", values.last_name);
        formData.append("phone", values.phone);
        if (values.password) formData.append("password", values.password);
        if (values.avatar) formData.append("avatar", values.avatar); // Append file

        const data = await userService.update(formData); // Update service to handle FormData
        setUser(data);
        setIsEditing(false);
        setPreviewAvatar(null); // Reset preview after successful submission
      } catch (error) {
        console.error("Profile update failed:", error);
      } finally {
        handleLoading(false);
      }
    },
    enableReinitialize: true,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setPreviewAvatar(null); // Reset preview on cancel
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file in Formik state
      formik.setFieldValue("avatar", file);
      // Generate preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="my-4 max-w-4xl px-4">
      {/* Profil rasmi qismi */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-gray-300">
            {previewAvatar || user?.avatar ? (
              <img
                src={previewAvatar || `${serverUrl}/uploads/${user?.avatar}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src={defaultImageAvatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {isEditing && (
            <Button
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
              Rasmni o'zgartirish uchun kamera tugmasini bosing
            </p>
          )}
        </div>
      </div>

      {/* Ma'lumotlar formasi */}
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6 mb-6">
          {/* Ism va Familiya */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">Ism</Label>
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
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.first_name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Familiya</Label>
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
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.last_name}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email manzil</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              disabled
              className={!isEditing ? "bg-gray-50" : ""}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Telefon raqami */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqami</Label>
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
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
          </div>

          {/* Parol */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Yangi parol (ixtiyoriy)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder="Yangi parolni kiriting"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tahrirlash tugmalari */}
        <div className="text-2xl flex items-center justify-between">
          <span></span>
          {!isEditing ? (
            <Button
              type="button"
              onClick={handleEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Tahrirlash
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={loading || !formik.isValid}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Saqlash
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
