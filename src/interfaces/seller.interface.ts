export interface ISeller {
  _id: string;
  passport: string;
  business_type: "ytt" | "mchj" | "self_employed";
}
