import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+998 90 123 45 67",
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setProfile({ ...tempProfile });
      setIsEditing(false);
      setIsLoading(false);
      // Bu yerda haqiqiy API so'rov bo'lishi kerak
      console.log("Profile updated:", tempProfile);
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setTempProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="my-4 max-w-4xl px-4">
      <div className="space-y-6 mb-6">
        {/* Ism va Familiya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">Ism</Label>
            <Input
              id="first_name"
              value={isEditing ? tempProfile.first_name : profile.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Familiya</Label>
            <Input
              id="last_name"
              value={isEditing ? tempProfile.last_name : profile.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email manzil</Label>
          <Input
            id="email"
            type="email"
            value={isEditing ? tempProfile.email : profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>

        {/* Telefon raqami */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon raqami</Label>
          <Input
            id="phone"
            type="tel"
            value={isEditing ? tempProfile.phone : profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-50" : ""}
            placeholder="+998 90 123 45 67"
          />
        </div>
      </div>
      <div className="text-2xl flex items-center justify-between">
        <span></span>
        {!isEditing ? (
          <Button
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
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
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
    </div>
  );
}
