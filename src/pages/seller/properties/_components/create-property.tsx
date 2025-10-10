"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, type FieldProps } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Upload,
  X,
  Video,
  ImageIcon,
  Home,
  Bed,
  Bath,
  Car,
  DollarSign,
} from "lucide-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { regionService } from "@/services/region.service";
import { districtService } from "@/services/district.service";
import type { IRegion } from "@/interfaces/region.interface";
import type { IDistrict } from "@/interfaces/district.interface";

// Formadagi barcha maydonlar qabul qilishi mumkin bo'lgan tiplar birlashmasi.
type PropertyValueType =
  | string
  | number
  | string[]
  | number[]
  | { type: string; coordinates: number[] };

// setFieldValue uchun umumiy tip yaratamiz. Bu kodni qayta ishlatish va o'qish uchun qulay.
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

interface BannerUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

interface PhotosUploadProps {
  files: File[];
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

interface VideoUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

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

const BannerUpload = ({ file, onFileChange, onRemove }: BannerUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("banner-upload") as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      {file ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt="Banner preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove banner"
          >
            <X size={16} />
          </button>
          <Badge className="absolute top-2 left-2 bg-blue-500">
            Banner Rasm
          </Badge>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              Banner rasmini yuklang
            </p>
            <p className="text-sm text-gray-500">
              Faqat 1 ta rasm, banner uchun moʻljallangan
            </p>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="banner-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2 bg-transparent"
            onClick={handleButtonClick}
          >
            Rasm Tanlash
          </Button>
        </div>
      )}
    </div>
  );
};

const PhotosUpload = ({
  files,
  onFilesChange,
  onRemove,
}: PhotosUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("photos-upload") as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center mb-4">
        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-900">Rasmlar</p>
        <p className="text-sm text-gray-500">Maksimum 5 ta rasm</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < 5 && (
        <>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesChange}
            className="hidden"
            id="photos-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleButtonClick}
          >
            Rasmlar Qoʻshish ({files.length}/5)
          </Button>
        </>
      )}
    </div>
  );
};

const VideoUpload = ({ file, onFileChange, onRemove }: VideoUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("video-upload") as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {file ? (
        <div className="relative">
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-32 object-cover rounded-lg"
            controls
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove video"
          >
            <X size={16} />
          </button>
          <Badge className="absolute top-2 left-2 bg-green-500">Video</Badge>
        </div>
      ) : (
        <div>
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">Video yuklang</p>
            <p className="text-sm text-gray-500">Faqat 1 ta video fayl</p>
          </div>
          <Input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="hidden"
            id="video-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2 bg-transparent"
            onClick={handleButtonClick}
          >
            Video Tanlash
          </Button>
        </div>
      )}
    </div>
  );
};

const LocationUpdater = ({
  markerPosition,
  regions,
  districts,
  setFieldValue,
  setSelectedRegionCode,
  findClosestRegion,
  findClosestDistrict,
  fetchAddress,
}: {
  markerPosition: { lat: number; lng: number };
  regions: IRegion[] | undefined;
  districts: IDistrict[] | undefined;
  setFieldValue: SetFieldValueType;
  setSelectedRegionCode: (code: string | null) => void;
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
        setFieldValue("region", closestRegion.code);
        setSelectedRegionCode(closestRegion.code);
      } else {
        setFieldValue("region", "");
        setSelectedRegionCode(null);
      }
    }

    if (districts) {
      const closestDistrict = findClosestDistrict(lat, lng, districts);
      if (closestDistrict) {
        setFieldValue("district", closestDistrict.code);
      } else {
        setFieldValue("district", "");
      }
    }
  }, [
    markerPosition,
    regions,
    districts,
    setFieldValue,
    setSelectedRegionCode,
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

  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(
    null
  );
  const { data: districts, isLoading: districtsLoading } = useQuery({
    queryKey: ["districts", selectedRegionCode],
    queryFn: () =>
      selectedRegionCode
        ? districtService.findAllByRegionCode(selectedRegionCode)
        : Promise.resolve([]),
    enabled: !!selectedRegionCode,
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
              setSelectedRegionCode={setSelectedRegionCode}
              findClosestRegion={findClosestRegion}
              findClosestDistrict={findClosestDistrict}
              fetchAddress={fetchAddress}
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Media Fayllar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-sm text-gray-700">
                    Banner Rasm
                  </h4>
                  <BannerUpload
                    file={bannerFile}
                    onFileChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setBannerFile(file);
                    }}
                    onRemove={() => setBannerFile(null)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3 text-sm text-gray-700">
                      Rasmlar (maksimum 5 ta)
                    </h4>
                    <PhotosUpload
                      files={photoFiles}
                      onFilesChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        setPhotoFiles((prev) =>
                          [...prev, ...newFiles].slice(0, 5)
                        );
                      }}
                      onRemove={(index) =>
                        setPhotoFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-sm text-gray-700">
                      Video
                    </h4>
                    <VideoUpload
                      file={videoFile}
                      onFileChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setVideoFile(file);
                      }}
                      onRemove={() => setVideoFile(null)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Asosiy Maʼlumotlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sarlavha *
                  </label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="Masalan: Yangi qurilayotgan loyiha markazda..."
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tavsif *
                  </label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Mulkning batafsil tavsifini yozing..."
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{values.description.length}/140</span>
                    <ErrorMessage
                      name="description"
                      component="span"
                      className="text-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Kategoriya *
                    </label>
                    <Field name="category">
                      {({ field, form }: FieldProps) => (
                        <Select
                          onValueChange={(value) =>
                            form.setFieldValue(field.name, value)
                          }
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategoriya tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Kvartira</SelectItem>
                            <SelectItem value="house">Uy</SelectItem>
                            <SelectItem value="commercial">Tijorat</SelectItem>
                            <SelectItem value="land">Yer uchastkasi</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="construction_status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Qurilish Holati
                    </label>
                    <Field name="construction_status">
                      {({ field, form }: FieldProps) => (
                        <Select
                          onValueChange={(value) =>
                            form.setFieldValue(field.name, value)
                          }
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Holatni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Tayyor</SelectItem>
                            <SelectItem value="under_construction">
                              Qurilmoqda
                            </SelectItem>
                            <SelectItem value="planned">
                              Rejalashtirilgan
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Narx va Maydon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Narx *
                    </label>
                    <Field
                      as={Input}
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Narx Turi *
                    </label>
                    <Field name="price_type">
                      {({ field, form }: FieldProps) => (
                        <Select
                          onValueChange={(value) =>
                            form.setFieldValue(field.name, value)
                          }
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Narx turi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Sotuv</SelectItem>
                            <SelectItem value="rent">Ijaraga</SelectItem>
                            <SelectItem value="total_price">
                              Umumiy narx
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="price_type"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Maydon (m²) *
                    </label>
                    <Field
                      as={Input}
                      id="area"
                      name="area"
                      type="number"
                      placeholder="0"
                    />
                    <ErrorMessage
                      name="area"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="payment_plans"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Toʻlov Rejalari
                    </label>
                    <Field
                      as={Input}
                      id="payment_plans"
                      name="payment_plans"
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Xonalar va Qulayliklar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="bedrooms"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <Bed className="inline h-4 w-4 mr-1" /> Yotoq xonalari
                    </label>
                    <Field
                      as={Input}
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bathrooms"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <Bath className="inline h-4 w-4 mr-1" /> Hammomlar
                    </label>
                    <Field
                      as={Input}
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="floor_level"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <Home className="inline h-4 w-4 mr-1" /> Qavat
                    </label>
                    <Field
                      as={Input}
                      id="floor_level"
                      name="floor_level"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parking_spaces"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <Car className="inline h-4 w-4 mr-1" /> Avtoturargoh
                    </label>
                    <Field
                      as={Input}
                      id="parking_spaces"
                      name="parking_spaces"
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Manzil va Joylashuv
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Toʻliq Manzil * (Xaritada joy tanlang yoki qoʻlda kiriting)
                  </label>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    placeholder="Masalan: Toshkent shahar, Mirzo Ulugʻbek tumani, ..."
                    disabled={isGeocoding}
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  {isGeocoding && (
                    <p className="text-sm text-gray-500 mt-1">
                      Manzil yuklanmoqda...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joylashuvni Xaritada Tanlang *
                  </label>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={markerPosition}
                    zoom={10}
                    onClick={(e) => handleMapClick(e)}
                    onLoad={handleMapLoad}
                  >
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>
                  <ErrorMessage
                    name="location.coordinates"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Viloyat *
                    </label>
                    <Field name="region">
                      {({ field, form }: FieldProps) => (
                        <Select
                          onValueChange={(value) => {
                            form.setFieldValue(field.name, value);
                            setSelectedRegionCode(value);
                            form.setFieldValue("district", "");

                            const selectedRegionObject = regions?.find(
                              (r: IRegion) => r.code === value
                            );
                            if (selectedRegionObject) {
                              const [lng, lat] =
                                selectedRegionObject.location.coordinates;
                              setMarkerPosition({ lat, lng });
                            }
                          }}
                          value={field.value}
                          disabled={regionsLoading || !regions}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                regionsLoading
                                  ? "Yuklanmoqda..."
                                  : "Viloyat tanlang"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {regions?.map((region: IRegion) => (
                              <SelectItem key={region._id} value={region.code}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="region"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tuman *
                    </label>
                    <Field name="district">
                      {({ field, form }: FieldProps) => (
                        <Select
                          onValueChange={(value) =>
                            form.setFieldValue(field.name, value)
                          }
                          value={field.value}
                          disabled={
                            districtsLoading ||
                            !districts ||
                            !selectedRegionCode
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                districtsLoading
                                  ? "Yuklanmoqda..."
                                  : "Tuman tanlang"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {districts?.map((district: IDistrict) => (
                              <SelectItem
                                key={district._id}
                                value={district.code}
                              >
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

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
