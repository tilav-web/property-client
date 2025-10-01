import BackButton from "@/components/common/buttons/back-button";
import { Button } from "@/components/ui/button";
import { roleImage1, roleImage2, roleImage3 } from "@/utils/shared";
import { ArrowRightToLine } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleChecked() {
  const [selectedRole, setSelectedRole] = useState<string>();
  const navigate = useNavigate();

  const roles = [
    { id: "physical", image: roleImage1, label: "Физической" },
    { id: "seller", image: roleImage2, label: "Продать/здать" },
    { id: "legal", image: roleImage3, label: "Юридической" },
  ];

  const handleContinue = () => {
    navigate(`/auth/register?role=${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none">
      <div className="max-w-4xl w-full">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Select Your Role
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Choose one of the available roles below
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {roles.map((role) => (
            <div key={role.id} className="flex flex-col items-center">
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
                  relative cursor-pointer transition-all duration-300 
                  transform hover:scale-105 group
                  ${selectedRole === role.id ? "scale-105" : ""}
                `}
              >
                <div
                  className={`
                  w-full h-64 md:h-80 rounded-2xl overflow-hidden 
                  shadow-lg border-4 transition-all duration-300 bg-white
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
                      ${selectedRole === role.id ? "scale-115" : ""}
                    `}
                  />
                </div>
                <div
                  className={`
                  absolute top-4 right-4 w-8 h-8 rounded-full 
                  bg-white shadow-lg flex items-center justify-center
                  transition-all duration-300 transform
                  ${
                    selectedRole === role.id
                      ? "scale-100 bg-blue-500"
                      : "scale-90 bg-white/90"
                  }
                `}
                >
                  <svg
                    className={`
                      w-5 h-5 transition-all duration-300
                      ${
                        selectedRole === role.id
                          ? "scale-100 text-green-500"
                          : "scale-0 text-gray-400"
                      }
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              <span
                className={`
                mt-4 text-lg font-semibold transition-colors duration-300
                ${selectedRole === role.id ? "text-blue-600" : "text-gray-700"}
              `}
              >
                {role.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            variant={"outline"}
          >
            Davom etish
            <ArrowRightToLine />
          </Button>
        </div>
      </div>
    </div>
  );
}
