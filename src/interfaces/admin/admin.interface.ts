export interface IAdmin {
  _id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
}
