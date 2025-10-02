export type FileType = "User";

export interface IFile {
  _id: string;
  document_id: string;
  document_type: FileType | string;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  original_name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
