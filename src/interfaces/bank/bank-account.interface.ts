export interface IBankAccount {
  _id: string;
  seller: string;
  account_number: string;
  bank_name: string;
  mfo: string;
  owner_full_name: string;
  swift_code: string;
  createdAt?: Date;
  updatedAt?: Date;
}
