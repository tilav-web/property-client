export interface IDistrict {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  code: string;
  region_code: string;
}
