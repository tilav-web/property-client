export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: {
    value: string;
    isVerified: boolean;
  };
  phone: {
    value: string;
    isVerified: boolean;
  };
  avatar: string;
  role: UserRole;
  lan: "uz" | "en" | "ru";
  likes: string[];
}

export type UserRole = "physical" | "seller" | "legal";
