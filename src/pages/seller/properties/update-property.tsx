/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useForm,
  Controller,
  type SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { propertyService } from "@/services/property.service";
import type { IAdminApartmentRent } from "@/interfaces/admin/property/admin-apartment-rent.interface";
import type { IAdminApartmentSale } from "@/interfaces/admin/property/admin-apartment-sale.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader, Trash2, Upload } from "lucide-react";
import LocationSection from "./_components/location-section";
import type { CategoryType } from "@/interfaces/types/category.type";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// Schema remains mostly for client-side guidance, server has its own validation
const schema = yup.object().shape({
  title: yup.object({
    uz: yup.string().required("Sarlavha (uz) majburiy"),
    ru: yup.string().required("Sarlavha (ru) majburiy"),
    en: yup.string().required("Sarlavha (en) majburiy"),
  }),
  description: yup.object({
    uz: yup.string().required("Tavsif (uz) majburiy"),
    ru: yup.string().required("Tavsif (ru) majburiy"),
    en: yup.string().required("Tavsif (en) majburiy"),
  }),
  address: yup.object({
    uz: yup.string().required("Manzil (uz) majburiy"),
    ru: yup.string().required("Manzil (ru) majburiy"),
    en: yup.string().required("Manzil (en) majburiy"),
  }),
  price: yup
    .number()
    .typeError("Narx raqam bo'lishi kerak")
    .positive("Narx musbat bo'lishi kerak")
    .required("Narx majburiy"),
  category: yup.string<CategoryType>().required("Kategoriya majburiy"),
});

type FormValues = Partial<IAdminApartmentRent & IAdminApartmentSale> & {
  photos: { value: string | File }[];
  videos: { value: string | File }[];
};

export default function UpdateProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [originalPhotos, setOriginalPhotos] = useState<string[]>([]);
  const [originalVideos, setOriginalVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>(
    {
      resolver: yupResolver(schema as any),
      defaultValues: {
        location: { type: "Point", coordinates: [69.279737, 41.311151] },
        photos: [],
        videos: [],
      },
    },
  );

  const {
    fields: photos,
    remove: removePhoto,
    append: appendPhotos,
  } = useFieldArray({ control, name: "photos" });
  const {
    fields: videos,
    remove: removeVideo,
    append: appendVideos,
  } = useFieldArray({ control, name: "videos" });

  const category = watch("category");
  const location = watch("location");

  const displayLocation = useMemo(
    () => ({
      lat: location?.coordinates?.[1] || 41.311151,
      lng: location?.coordinates?.[0] || 69.279737,
    }),
    [location],
  );

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("Mulk ID topilmadi.");
      return;
    }
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const data = await propertyService.findOnePropertyForUpdate(id);
        setOriginalPhotos(data.photos || []);
        setOriginalVideos(data.videos || []);
        reset({
          ...data,
          photos: (data.photos || []).map((p: string) => ({ value: p })),
          videos: (data.videos || []).map((v: string) => ({ value: v })),
        });
      } catch (err) {
        setError("Mulkni yuklashda xatolik yuz berdi.");
        toast.error("Mulkni yuklashda xatolik yuz berdi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id, reset]);

  const handleNewFiles = (
    e: ChangeEvent<HTMLInputElement>,
    type: "photos" | "videos",
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => ({ value: file }));
      if (type === "photos") appendPhotos(files as any);
      if (type === "videos") appendVideos(files as any);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!id) return;
    setIsSubmitting(true);
    toast.loading("Ma'lumotlar yangilanmoqda...");

    try {
      const currentPhotoValues = (data.photos || []).map((p: any) => p.value);
      const currentVideoValues = (data.videos || []).map((v: any) => v.value);

      const new_photos = currentPhotoValues.filter(
        (p): p is File => p instanceof File,
      );
      const new_videos = currentVideoValues.filter(
        (v): v is File => v instanceof File,
      );

      const keptPhotoUrls = currentPhotoValues.filter(
        (p): p is string => typeof p === "string",
      );
      const keptVideoUrls = currentVideoValues.filter(
        (v): v is string => typeof v === "string",
      );

      const photos_to_delete = originalPhotos.filter(
        (url) => !keptPhotoUrls.includes(url),
      );
      const videos_to_delete = originalVideos.filter(
        (url) => !keptVideoUrls.includes(url),
      );

      const payload: { [key: string]: any } = {};

      // Flatten language and location fields
      if (data.title) {
        payload.title_uz = data.title.uz;
        payload.title_ru = data.title.ru;
        payload.title_en = data.title.en;
      }
      if (data.description) {
        payload.description_uz = data.description.uz;
        payload.description_ru = data.description.ru;
        payload.description_en = data.description.en;
      }
      if (data.address) {
        payload.address_uz = data.address.uz;
        payload.address_ru = data.address.ru;
        payload.address_en = data.address.en;
      }
      if (data.location) {
        payload.location_lat = data.location.coordinates[1];
        payload.location_lng = data.location.coordinates[0];
      }

      const simpleFields: (keyof FormValues)[] = [
        "category",
        "price",
        "is_archived",
        "bedrooms",
        "bathrooms",
        "floor_level",
        "total_floors",
        "area",
        "balcony",
        "furnished",
        "repair_type",
        "heating",
        "air_conditioning",
        "parking",
        "elevator",
        "amenities",
        "contract_duration_months",
        "mortgage_available",
      ];
      simpleFields.forEach((field) => {
        if (data[field] !== undefined && data[field] !== null) {
          payload[field] = data[field];
        }
      });

      payload.new_photos = new_photos;
      payload.new_videos = new_videos;
      payload.photos_to_delete = photos_to_delete;
      payload.videos_to_delete = videos_to_delete;

      await propertyService.update(id, payload);

      toast.dismiss();
      toast.success("Mulk muvaffaqiyatli yangilandi!");
      navigate("/seller/properties");
    } catch (error) {
      const err = error as AxiosError<any>;

      toast.dismiss();
      toast.error(
        err.response?.data?.message ?? "Mulkni yangilashda xatolik yuz berdi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Mulkni Tahrirlash</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Asosiy ma'lumotlar</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title-uz">Sarlavha (O'zbek)</Label>
                <Controller
                  name="title.uz"
                  control={control}
                  render={({ field }) => <Input id="title-uz" {...field} />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-ru">Sarlavha (Rus)</Label>
                <Controller
                  name="title.ru"
                  control={control}
                  render={({ field }) => <Input id="title-ru" {...field} />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-en">Sarlavha (Ingliz)</Label>
                <Controller
                  name="title.en"
                  control={control}
                  render={({ field }) => <Input id="title-en" {...field} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description-uz">Tavsif (O'zbek)</Label>
              <Controller
                name="description.uz"
                control={control}
                render={({ field }) => (
                  <Textarea id="description-uz" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-ru">Tavsif (Rus)</Label>
              <Controller
                name="description.ru"
                control={control}
                render={({ field }) => (
                  <Textarea id="description-ru" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-en">Tavsif (Ingliz)</Label>
              <Controller
                name="description.en"
                control={control}
                render={({ field }) => (
                  <Textarea id="description-en" {...field} />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address-uz">Manzil (O'zbek)</Label>
                <Controller
                  name="address.uz"
                  control={control}
                  render={({ field }) => <Input id="address-uz" {...field} />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-ru">Manzil (Rus)</Label>
                <Controller
                  name="address.ru"
                  control={control}
                  render={({ field }) => <Input id="address-ru" {...field} />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-en">Manzil (Ingliz)</Label>
                <Controller
                  name="address.en"
                  control={control}
                  render={({ field }) => <Input id="address-en" {...field} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Narx</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input id="price" type="number" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategoriya</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select disabled onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APARTMENT_RENT">
                        Apartment Rent
                      </SelectItem>
                      <SelectItem value="APARTMENT_SALE">
                        Apartment Sale
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rasmlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative group">
                <img
                  src={
                    typeof photo.value === "string"
                      ? photo.value
                      : URL.createObjectURL(photo.value as File)
                  }
                  alt=""
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() => removePhoto(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Label
              htmlFor="photo-upload"
              className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Rasm yuklash</span>
              <Input
                id="photo-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleNewFiles(e, "photos")}
                accept="image/*"
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Videolar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {videos.map((video, index) => (
              <div key={video.id} className="relative group">
                <video
                  src={
                    typeof video.value === "string"
                      ? video.value
                      : URL.createObjectURL(video.value as File)
                  }
                  className="w-full h-32 object-cover rounded-md"
                  controls
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() => removeVideo(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Label
              htmlFor="video-upload"
              className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Video yuklash</span>
              <Input
                id="video-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleNewFiles(e, "videos")}
                accept="video/*"
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {category === "APARTMENT_RENT" && (
            <ApartmentRentFields control={control} />
          )}
          {category === "APARTMENT_SALE" && (
            <ApartmentSaleFields control={control} />
          )}
        </CardContent>
      </Card>

      <LocationSection
        location={displayLocation}
        setLocation={(loc) =>
          setValue("location", {
            type: "Point",
            coordinates: [loc.lng, loc.lat],
          })
        }
        isSubmitting={isSubmitting}
      />

      <Card>
        <CardHeader>
          <CardTitle>Bayroqlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Controller
              name="is_archived"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_archived"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="is_archived">Arxivlangan</Label>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Saqlanmoqda...
            </>
          ) : (
            "Saqlash"
          )}
        </Button>
      </div>
    </form>
  );
}

// These components are simplified now as the errors prop is not used
const ApartmentRentFields = ({ control }: { control: any }) => (
  <div className="space-y-4 animate-in fade-in">
    <h3 className="text-lg font-medium">Ijaraga Kvartira Ma'lumotlari</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="rent-bedrooms">Yotoqxonalar soni</Label>
        <Controller
          name="bedrooms"
          control={control}
          render={({ field }) => (
            <Input id="rent-bedrooms" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent-bathrooms">Hammomlar soni</Label>
        <Controller
          name="bathrooms"
          control={control}
          render={({ field }) => (
            <Input id="rent-bathrooms" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent-floor_level">Qavat</Label>
        <Controller
          name="floor_level"
          control={control}
          render={({ field }) => (
            <Input id="rent-floor_level" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent-total_floors">Umumiy qavatlar</Label>
        <Controller
          name="total_floors"
          control={control}
          render={({ field }) => (
            <Input id="rent-total_floors" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent-area">Maydon (kv.m)</Label>
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <Input id="rent-area" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent-contract_duration_months">
          Shartnoma muddati (oy)
        </Label>
        <Controller
          name="contract_duration_months"
          control={control}
          render={({ field }) => (
            <Input
              id="rent-contract_duration_months"
              type="number"
              {...field}
            />
          )}
        />
      </div>
    </div>
    <div className="flex flex-wrap gap-4">
      <Controller
        name="balcony"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="balcony"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="balcony">Balkon</Label>
          </div>
        )}
      />
      <Controller
        name="furnished"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="furnished"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="furnished">Mebelli</Label>
          </div>
        )}
      />
      <Controller
        name="air_conditioning"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="air_conditioning"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="air_conditioning">Konditsioner</Label>
          </div>
        )}
      />
      <Controller
        name="parking"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="parking"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="parking">Parkovka</Label>
          </div>
        )}
      />
      <Controller
        name="elevator"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="elevator"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="elevator">Lift</Label>
          </div>
        )}
      />
    </div>
  </div>
);

const ApartmentSaleFields = ({ control }: { control: any }) => (
  <div className="space-y-4 animate-in fade-in">
    <h3 className="text-lg font-medium">Sotiladigan Kvartira Ma'lumotlari</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sale-bedrooms">Yotoqxonalar soni</Label>
        <Controller
          name="bedrooms"
          control={control}
          render={({ field }) => (
            <Input id="sale-bedrooms" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale-bathrooms">Hammomlar soni</Label>
        <Controller
          name="bathrooms"
          control={control}
          render={({ field }) => (
            <Input id="sale-bathrooms" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale-floor_level">Qavat</Label>
        <Controller
          name="floor_level"
          control={control}
          render={({ field }) => (
            <Input id="sale-floor_level" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale-total_floors">Umumiy qavatlar</Label>
        <Controller
          name="total_floors"
          control={control}
          render={({ field }) => (
            <Input id="sale-total_floors" type="number" {...field} />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sale-area">Maydon (kv.m)</Label>
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <Input id="sale-area" type="number" {...field} />
          )}
        />
      </div>
    </div>
    <div className="flex flex-wrap gap-4">
      <Controller
        name="balcony"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="balcony-sale"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="balcony-sale">Balkon</Label>
          </div>
        )}
      />
      <Controller
        name="furnished"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="furnished-sale"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="furnished-sale">Mebelli</Label>
          </div>
        )}
      />
      <Controller
        name="air_conditioning"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="air_conditioning-sale"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="air_conditioning-sale">Konditsioner</Label>
          </div>
        )}
      />
      <Controller
        name="parking"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="parking-sale"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="parking-sale">Parkovka</Label>
          </div>
        )}
      />
      <Controller
        name="elevator"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="elevator-sale"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="elevator-sale">Lift</Label>
          </div>
        )}
      />
      <Controller
        name="mortgage_available"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="mortgage_available"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="mortgage_available">Ipoteka mavjud</Label>
          </div>
        )}
      />
    </div>
  </div>
);
