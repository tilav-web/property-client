// enums ga mos string literal turlari
export type AuthProvider = "local" | "google" | "facebook" | "github";
// (EnumAuthProvider ichidagi qiymatlarga moslab kengaytirasan)

export type UserRole = "physical" | "legal";
export type UserLan = "uz" | "en" | "ru" | "ms";

export interface IIdentifier {
  value: string | null;
  isVerified: boolean;
}

export interface ISocialAccount {
  provider: AuthProvider;
  providerId: string;
  isVerified: boolean;
}

export interface IUser {
  _id: string;

  first_name: string | null;
  last_name: string | null;

  email: IIdentifier;
  phone: IIdentifier;

  provider: AuthProvider;
  socialAccounts: ISocialAccount[];

  avatar: string | null;

  role: UserRole;
  lan: UserLan;

  isAI?: boolean;

  password?: string; // select:false

  premiumUntil?: string | null;

  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}
