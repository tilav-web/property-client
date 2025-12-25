import type { IProperty } from "@/interfaces/property/property.interface";
import type { ILanguage } from "@/interfaces/common/language/language.interface";

export interface IAdminProperty extends Omit<IProperty, 'title' | 'description' | 'address'> {
  title: ILanguage;
  description: ILanguage;
  address: ILanguage;
}
