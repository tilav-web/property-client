import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/buttons/back-button";
import { Button } from "@/components/ui/button";
import { roleImage1, roleImage3 } from "@/utils/shared";
import { ArrowRightToLine, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleChecked() {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>();
  const navigate = useNavigate();

  const roles = [
    {
      id: "physical",
      image: roleImage1,
      label: t("pages.role_page.roles.physical"),
    },
    { id: "legal", image: roleImage3, label: t("pages.role_page.roles.legal") },
  ];

  const handleContinue = () => {
    navigate(`/auth/register?role=${selectedRole}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-5 sm:py-8 select-none">
      <div className="w-full max-w-4xl">
        <BackButton />
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
          {t("pages.role_page.title")}
        </h1>
        <p className="mx-auto mb-5 max-w-md text-center text-sm text-gray-600 sm:mb-8 sm:text-base">
          {t("pages.role_page.subtitle")}
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-5 md:gap-6">
          {roles.map((role) => (
            <div key={role.id} className="flex min-w-0 flex-col items-center">
              <input
                type="radio"
                id={role.id}
                name="role"
                checked={selectedRole === role.id}
                onChange={() => setSelectedRole(role.id)}
                className="absolute opacity-0 w-0 h-0"
              />

              <label
                htmlFor={role.id}
                className={`
                  relative w-full cursor-pointer transition-all duration-300 
                  sm:transform sm:hover:scale-105
                  ${selectedRole === role.id ? "sm:scale-105" : ""}
                `}
              >
                <div
                  className={`
                  h-36 w-full overflow-hidden rounded-xl
                  border-2 bg-white shadow-md transition-all duration-300
                  sm:h-56 sm:rounded-2xl sm:border-4 sm:shadow-lg md:h-80
                  ${
                    selectedRole === role.id
                      ? "border-blue-500"
                      : "border-white hover:border-gray-200"
                  }
                `}
                >
                  <img
                    src={role.image}
                    alt={role.label}
                    className={`
                      w-full h-full object-cover transition-all duration-500
                      ${selectedRole === role.id ? "scale-110" : ""}
                    `}
                  />
                </div>
                <div
                  className={`
                  absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full
                  bg-white shadow-lg transition-all duration-300 transform
                  sm:right-4 sm:top-4 sm:h-8 sm:w-8
                  ${
                    selectedRole === role.id
                      ? "scale-100 bg-blue-500"
                      : "scale-90 bg-white/90"
                  }
                `}
                >
                  <Check
                    className={`
                      h-4 w-4 transition-all duration-300 sm:h-5 sm:w-5
                      ${
                        selectedRole === role.id
                          ? "scale-100 text-white"
                          : "scale-0 text-gray-400"
                      }
                    `}
                    strokeWidth={3}
                  />
                </div>
              </label>
              <span
                className={`
                mt-2 max-w-full text-center text-sm font-semibold leading-snug transition-colors duration-300 sm:mt-4 sm:text-lg
                ${selectedRole === role.id ? "text-blue-600" : "text-gray-700"}
              `}
              >
                {role.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-stretch sm:justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            variant={"outline"}
            className="w-full sm:w-auto"
          >
            {t("common.buttons.continue")}
            <ArrowRightToLine />
          </Button>
        </div>
      </div>
    </div>
  );
}
