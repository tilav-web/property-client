"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { regionService } from "@/services/region.service";
import { districtService } from "@/services/district.service";
import type { IRegion } from "@/interfaces/region.interface";
import type { IDistrict } from "@/interfaces/district.interface";
import { useLoadScript } from "@react-google-maps/api";
import MediaTab from "./create-property-tabs/media-tab";
import InfoTab from "./create-property-tabs/info-tab";
import DetailsTab from "./create-property-tabs/details-tab";
import PriceTab from "./create-property-tabs/price-tab";
import LocationTab from "./create-property-tabs/location-tab";

type PropertyValueType =
  | string
  | number
  | string[]
  | number[]
  | { type: string; coordinates: number[] };

type SetFieldValueType = (field: string, value: PropertyValueType) => void;

const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface PropertyFormValues {
  title: string;
  description: string;
  category: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: string;
  price: number;
  price_type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor_level: number;
  amenities: string[];
  construction_status: string;
  year_built: number;
  parking_spaces: number;
  logo: string;
  delivery_date: string;
  sales_date: string;
  payment_plans: number;
  region: string;
  district: string;
}

const propertyValidationSchema = Yup.object({
  title: Yup.string()
    .min(10, "Sarlavha kamida 10 ta belgidan iborat boʻlishi kerak")
    .max(40, "Sarlavha 40 ta belgidan oshmasligi kerak")
    .required("Sarlavha majburiy"),
  description: Yup.string()
    .min(40, "Tavsif kamida 40 ta belgidan iborat boʻlishi kerak")
    .max(140, "Tavsif 140 ta belgidan oshmasligi kerak")
    .required("Tavsif majburiy"),
  category: Yup.string().required("Kategoriya tanlash majburiy"),
  price: Yup.number()
    .min(0, "Narx manfiy boʻlmasligi kerak")
    .required("Narx majburiy"),
  price_type: Yup.string().required("Narx turi majburiy"),
  area: Yup.number()
    .min(0, "Maydon manfiy boʻlmasligi kerak")
    .required("Maydon majburiy"),
  bedrooms: Yup.number().min(0, "Yotoq xonalar soni manfiy boʻlmasligi kerak"),
  bathrooms: Yup.number().min(0, "Hammomlar soni manfiy boʻlmasligi kerak"),
  floor_level: Yup.number().min(0, "Qavat manfiy boʻlmasligi kerak"),
  year_built: Yup.number().min(
    1900,
    "Qurilgan yil 1900 yildan katta boʻlishi kerak"
  ),
  parking_spaces: Yup.number().min(
    0,
    "Avtoturargohlar soni manfiy boʻlmasligi kerak"
  ),
  payment_plans: Yup.number().min(
    0,
    "Toʻlov rejalari soni manfiy boʻlmasligi kerak"
  ),
  region: Yup.string().required("Viloyat tanlash majburiy"),
  district: Yup.string().required("Tuman tanlash majburiy"),
  address: Yup.string()
    .min(20, "Manzil kamida 20 ta belgidan iborat boʻlishi kerak")
    .required("Manzil majburiy"),
  location: Yup.object({
    type: Yup.string().required("Joylashuv turi majburiy"),
    coordinates: Yup.array()
      .of(Yup.number())
      .length(2, "Koordinatalar ikkita son boʻlishi kerak")
      .required("Koordinatalar majburiy"),
  }),
});

const initialValues: PropertyFormValues = {
  title: "",
  description: "",
  category: "",
  location: {
    type: "Point",
    coordinates: [65.79, 38.86],
  },
  address: "",
  price: 0,
  price_type: "",
  area: 0,
  bedrooms: 0,
  bathrooms: 0,
  floor_level: 0,
  amenities: [],
  construction_status: "",
  year_built: new Date().getFullYear(),
  parking_spaces: 0,
  logo: "",
  delivery_date: "",
  sales_date: "",
  payment_plans: 0,
  region: "",
  district: "",
};

const LocationUpdater = ({
  markerPosition,
  regions,
  districts,
  setFieldValue,
  setSelectedRegion,
  findClosestRegion,
  findClosestDistrict,
  fetchAddress,
}: {
  markerPosition: { lat: number; lng: number };
  regions: IRegion[] | undefined;
  districts: IDistrict[] | undefined;
  setFieldValue: SetFieldValueType;
  setSelectedRegion: (id: string | null) => void;
  findClosestRegion: (
    lat: number,
    lng: number,
    regions: IRegion[]
  ) => IRegion | null;
  findClosestDistrict: (
    lat: number,
    lng: number,
    districts: IDistrict[]
  ) => IDistrict | null;
  fetchAddress: (
    lat: number,
    lng: number,
    setFieldValue: SetFieldValueType
  ) => void;
}) => {
  useEffect(() => {
    if (!markerPosition) return;

    const { lat, lng } = markerPosition;
    setFieldValue("location.coordinates", [lng, lat]);
    fetchAddress(lat, lng, setFieldValue);

    if (regions) {
      const closestRegion = findClosestRegion(lat, lng, regions);
      if (closestRegion) {
        setFieldValue("region", closestRegion._id);
        setSelectedRegion(closestRegion._id);
      } else {
        setFieldValue("region", "");
        setSelectedRegion(null);
      }
    }

    if (districts) {
      const closestDistrict = findClosestDistrict(lat, lng, districts);
      if (closestDistrict) {
        setFieldValue("district", closestDistrict._id);
      } else {
        setFieldValue("district", "");
      }
    }
  }, [
    markerPosition,
    regions,
    districts,
    setFieldValue,
    setSelectedRegion,
    findClosestRegion,
    findClosestDistrict,
    fetchAddress,
  ]);

  return null;
};

export default function CreateProperty() {
  const navigate = useNavigate();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 38.86, lng: 65.79 });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: () => regionService.findAll(),
  });

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { data: districts, isLoading: districtsLoading } = useQuery({
    queryKey: ["districts", selectedRegion],
    queryFn: () =>
      selectedRegion
        ? districtService.findAllByRegionId(selectedRegion)
        : Promise.resolve([]),
    enabled: !!selectedRegion,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation xatoligi:", error);
        }
      );
    }
  }, []);

  const findClosestRegion = (
    lat: number,
    lng: number,
    regions: IRegion[]
  ): IRegion | null => {
    if (!regions || regions.length === 0) return null;
    return regions.reduce((closest, region) => {
      const [regionLng, regionLat] = region.location.coordinates;
      const distance = getDistance(lat, lng, regionLat, regionLng);
      if (closest === null || distance < closest.distance!) {
        return { ...region, distance };
      }
      return closest;
    }, null as (IRegion & { distance?: number }) | null);
  };

  const findClosestDistrict = (
    lat: number,
    lng: number,
    districts: IDistrict[]
  ): IDistrict | null => {
    if (!districts || districts.length === 0) return null;
    return districts.reduce((closest, district) => {
      const [districtLng, districtLat] = district.location.coordinates;
      const distance = getDistance(lat, lng, districtLat, districtLng);
      if (closest === null || distance < closest.distance!) {
        return { ...district, distance };
      }
      return closest;
    }, null as (IDistrict & { distance?: number }) | null);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
    }
  };

  const fetchAddress = async (
    lat: number,
    lng: number,
    setFieldValue: SetFieldValueType
  ) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS
        }`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setFieldValue("address", address);
      } else {
        setFieldValue("address", "");
      }
    } catch (error) {
      console.error("Geocoding xatosi:", error);
      setFieldValue("address", "");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMapUnmount = () => {
    mapRef.current = null;
  };

  const handleSubmit = async (
    values: PropertyFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof PropertyFormValues;
        if (key === "location" || key === "amenities") {
          formData.append(key, JSON.stringify(values[typedKey]));
        } else {
          formData.append(key, String(values[typedKey]));
        }
      });

      if (bannerFile) formData.append("banner", bannerFile);
      if (videoFile) formData.append("videos", videoFile);
      photoFiles.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await fetch("/api/properties", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/properties");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError)
    return <div>Xarita yuklanishida xato: {loadError.message}</div>;
  if (!isLoaded) return <div>Xarita yuklanmoqda...</div>;

  console.log(1);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Yangi Mulk Qoʻshish
        </h1>
        <p className="text-gray-600 mt-2">
          Mulk haqida barcha kerakli maʼlumotlarni toʻldiring
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={propertyValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-8">
            <LocationUpdater
              markerPosition={markerPosition}
              regions={regions}
              districts={districts}
              setFieldValue={setFieldValue}
              setSelectedRegion={setSelectedRegion}
              findClosestRegion={findClosestRegion}
              findClosestDistrict={findClosestDistrict}
              fetchAddress={fetchAddress}
            />

            <Tabs defaultValue="media" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="info">Maʼlumot</TabsTrigger>
                <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
                <TabsTrigger value="price">Narx</TabsTrigger>
                <TabsTrigger value="location">Joylashuv</TabsTrigger>
              </TabsList>

              <TabsContent value="media" className="mt-6">
                <MediaTab
                  bannerFile={bannerFile}
                  setBannerFile={setBannerFile}
                  photoFiles={photoFiles}
                  setPhotoFiles={setPhotoFiles}
                  videoFile={videoFile}
                  setVideoFile={setVideoFile}
                />
              </TabsContent>

              <TabsContent value="info" className="mt-6">
                <InfoTab values={values} />
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <DetailsTab />
              </TabsContent>

              <TabsContent value="price" className="mt-6">
                <PriceTab />
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <LocationTab
                  markerPosition={markerPosition}
                  setMarkerPosition={setMarkerPosition}
                  handleMapClick={handleMapClick}
                  handleMapLoad={handleMapLoad}
                  handleMapUnmount={handleMapUnmount}
                  regions={regions}
                  districts={districts}
                  regionsLoading={regionsLoading}
                  districtsLoading={districtsLoading}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  setFieldValue={setFieldValue}
                  isGeocoding={isGeocoding}
                />
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || isGeocoding}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Yuklanmoqda..." : "Mulkni Yaratish"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
