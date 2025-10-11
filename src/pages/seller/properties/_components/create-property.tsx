"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { regionService } from "@/services/region.service";
import { districtService } from "@/services/district.service";
import { useLoadScript } from "@react-google-maps/api";
import { useDebounce } from "use-debounce";
import type { IRegion } from "@/interfaces/region.interface";
import type { IDistrict } from "@/interfaces/district.interface";
import MediaTab from "./create-property-tabs/media-tab";
import InfoTab from "./create-property-tabs/info-tab";
import DetailsTab from "./create-property-tabs/details-tab";
import PriceTab from "./create-property-tabs/price-tab";
import LocationTab from "./create-property-tabs/location-tab";
import { propertyService } from "@/services/property.service";

interface PropertyFormValues {
  title: string;
  description: string;
  category: string;
  location: { type: string; coordinates: number[] };
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

const initialValues: PropertyFormValues = {
  title: "",
  description: "",
  category: "",
  location: { type: "Point", coordinates: [65.79, 38.86] },
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

export default function CreateProperty() {
  const navigate = useNavigate();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 38.86, lng: 65.79 });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { data: regions, isLoading: regionsLoading } = useQuery<
    IRegion[],
    Error
  >({
    queryKey: ["regions"],
    queryFn: () => regionService.findAll(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // cacheTime o‘rniga gcTime
  });

  const { data: districts, isLoading: districtsLoading } = useQuery<
    IDistrict[],
    Error
  >({
    queryKey: ["districts", selectedRegion],
    queryFn: () =>
      selectedRegion
        ? districtService.findAllByRegionId(selectedRegion)
        : Promise.resolve([]),
    enabled: !!selectedRegion,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // cacheTime o‘rniga gcTime
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  const [debouncedMarkerPosition] = useDebounce(markerPosition, 500);

  const findClosestRegion = useMemo(
    () =>
      (lat: number, lng: number, regions: IRegion[]): IRegion | null => {
        if (!regions || regions.length === 0) return null;
        return regions.reduce((closest, region) => {
          const [regionLng, regionLat] = region.location.coordinates;
          const distance = getDistance(lat, lng, regionLat, regionLng);
          return !closest || distance < closest.distance!
            ? { ...region, distance }
            : closest;
        }, null as (IRegion & { distance?: number }) | null);
      },
    []
  );

  const findClosestDistrict = useMemo(
    () =>
      (lat: number, lng: number, districts: IDistrict[]): IDistrict | null => {
        if (!districts || districts.length === 0) return null;
        return districts.reduce((closest, district) => {
          const [districtLng, districtLat] = district.location.coordinates;
          const distance = getDistance(lat, lng, districtLat, districtLng);
          return !closest || distance < closest.distance!
            ? { ...district, distance }
            : closest;
        }, null as (IDistrict & { distance?: number }) | null);
      },
    []
  );

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  }, []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleSubmit = useCallback(
    async (
      values: PropertyFormValues,
      { setSubmitting }: FormikHelpers<PropertyFormValues>
    ) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(
            key,
            key === "location" || key === "amenities"
              ? JSON.stringify(value)
              : String(value)
          );
        });

        if (bannerFile) formData.append("banner", bannerFile);
        if (videoFile) formData.append("videos", videoFile);
        photoFiles.forEach((photo) => formData.append("photos", photo));

        const data = await propertyService.create(formData);
        console.log(data);
      } catch {
        console.error("Submission error");
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, bannerFile, photoFiles, videoFile]
  );

  if (loadError)
    return <div>Xarita yuklanishida xato: {loadError.message}</div>;
  if (!isLoaded) return <div>Xarita yuklanmoqda...</div>;

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
        {({ isSubmitting, values, setFieldValue }) => {
          // updateLocation-ni Formik kontekstida chaqirish
          useEffect(() => {
            if (debouncedMarkerPosition && regions && districts) {
              const { lat, lng } = debouncedMarkerPosition;
              setFieldValue("location.coordinates", [lng, lat]);
              const closestRegion = findClosestRegion(lat, lng, regions);
              setFieldValue("region", closestRegion?._id || "");
              setSelectedRegion(closestRegion?._id || null);

              const closestDistrict = findClosestDistrict(lat, lng, districts);
              setFieldValue("district", closestDistrict?._id || "");
            }
          }, [
            debouncedMarkerPosition,
            regions,
            districts,
            setFieldValue,
            setSelectedRegion,
          ]);

          return (
            <Form className="space-y-8">
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
                  />
                </TabsContent>
              </Tabs>
              <div className="flex items-center justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Yuklanmoqda..." : "Mulkni Yaratish"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
