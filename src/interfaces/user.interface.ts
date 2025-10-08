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
  lan: UserLan;
  likes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = "physical" | "seller" | "legal";
export type UserLan = "uz" | "en" | "ru";
