import type { IFile } from "./file.interface";

export type AdvertiseType = "banner" | "aside" | "image";

export interface IAdvertise {
  _id: string;
  target: string;
  type: AdvertiseType;
  image: IFile;
}
