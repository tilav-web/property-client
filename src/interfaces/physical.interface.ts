import type { IFile } from "./file.interface";

export interface IPhysical {
  _id: string;
  seller: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  birth_date: string;
  jshshir: string;
  createdAt: string;
  updatedAt: string;
  passport_file?: IFile;
}