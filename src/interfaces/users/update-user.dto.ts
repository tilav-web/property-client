import { UserRole } from "./user.interface";

export interface UpdateIdentifierDto {
  value?: string;
  isVerified?: boolean;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone?: UpdateIdentifierDto;
  email?: UpdateIdentifierDto;
  avatar?: string | null; // Allow setting avatar to null to remove it
  role?: UserRole;
  lan?: string; // Assuming EnumLanguage is a string
}
